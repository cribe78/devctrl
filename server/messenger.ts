#!/usr/bin/env node
"use strict";

import * as ioMod from "socket.io";
import * as http from "http";
import * as url from "url";
import * as mongo from "mongodb";
import * as querystring from "querystring";
import {IDCDataRequest, IDCDataUpdate, IDCDataDelete, IDCDataAdd, IDCDataExchange} from "../app/shared/DCSerializable";
import {DCDataModel, IndexedDataSet} from "../app/shared/DCDataModel";
import {ControlUpdateData} from "../app/shared/ControlUpdate";
import {Control} from "../app/shared/Control";
import {UserSession} from "../app/shared/UserSession";
import {Endpoint, EndpointStatus} from "../app/shared/Endpoint";
import {ClientType, UserInfo, UserInfoData} from "../app/shared/UserInfo";


let debug = console.log;
let mongoDebug = console.log;

class Messenger {
    mongodb: mongo.Db;
    dataModel: DCDataModel;
    config : any;
    app: http.Server;
    io :SocketIO.Server;
    sessions: mongo.Collection;

    constructor() {}

    run(config: any) {
        this.dataModel = new DCDataModel();
        this.config = config;

        this.app = http.createServer((req, response) => {
            this.httpHandler(req, response);
        });


        // Connect to mongodb
        let mongoConnStr = "mongodb://" + config.mongoHost + ":" + config.mongoPort
            + "/" + config.mongoDB;

        mongo.MongoClient.connect( mongoConnStr, (err, db) =>{
            debug("mongodb connected");
            this.mongodb = db;
            this.sessions = this.mongodb.collection("sessions");
            this.setEndpointsDisconnected();
        });

        this.app.listen(config.ioPort, "localhost");
        this.io = ioMod(this.app, { path: config.ioPath});
        debug(`socket.io listening at ${config.ioPath} on port ${config.ioPort}`);
        this.io.on('connection', (socket) => {
            this.ioConnection(socket);
        });

        // Set authorization function
        this.io.use((socket,next) => {
            let id = this.socketAuthId(socket);
            //debug("authenticating user " + id);
            if (id) {
                let col = this.mongodb.collection("sessions");
                col.findOne({_id : id}, (err, res) => {
                    if (err) {
                        debug(`mongodb error during auth for ${id}: ${err.message}`);
                        next(new Error("Authentication error"));
                        return;
                    }

                    if (res && res.auth) {
                        debug(`user ${id} authenticated`);
                        socket["session"] = res;
                        next();
                        return;
                    }

                    debug("connection attempt from unauthorized user " + id);
                    next(new Error("Unauthorized"));
                });
            }
        });
    }


    addData(request: IDCDataAdd, fn: (data: IDCDataExchange) => any) {
        let resp = { add : {}};
        let request_handled = false;

        for (let table in this.dataModel.types) {
            if (request[table]) {
                let col = this.mongodb.collection(table);
                resp.add[table] = {};
                if (Array.isArray(request[table])) {
                    // Add an array of documents
                    let addDocs = [];
                    for (let data of request[table]) {
                        // Sanitize data by creating objects and serializing them
                        try {
                            data._id = (new mongo.ObjectID()).toString();
                            let obj = new this.dataModel.types[table](data._id, data);
                            let doc = obj.getDataObject();
                            addDocs.push(doc);
                        }
                        catch (e) {
                            let errmsg = "invalid data received: " + e.message;
                            debug(errmsg);
                            fn({ error: errmsg});
                            return;
                        }
                    }

                    col.insertMany(addDocs, (err, r) => {
                        if (err) {
                            mongoDebug(err.message);
                            fn({ error: err.message});

                            return;
                        }

                        mongoDebug(r.insertedCount + " records added to " + table);

                        resp.add[table] = {};
                        for (let doc of addDocs) {
                            resp.add[table][doc._id] = doc;
                        }
                        this.dataModel.loadData(resp);
                        this.io.emit('control-data', resp);
                        fn(resp);
                    });
                }
                else {
                    //TODO:  is this form of the API used anywhere?
                    debug("single item add API hit, exiting");
                    process.exit();

                    /**
                    let doc;

                    /
                    // Sanitize data by creating an object and serializing it
                    try {
                        let data = request[table];
                        let data._id = (new mongo.ObjectID()).toString();
                        let obj = new this.dataModel.types[table](dataId, data);
                        doc = obj.getDataObject();
                    }
                    catch (e) {
                        let errmsg = "invalid data received: " + e.message;
                        debug(errmsg);
                        fn({ error: errmsg});
                        return;
                    }

                    col.insertOne(doc, (err, r) => {
                        if (err) {
                            mongoDebug(err.message);
                            fn({ error: err.message});

                            return;
                        }

                        mongoDebug("record added to " + table);
                        resp.add[table][request[table]._id] = request[table];

                        // Keep local dataModel in sync
                        this.dataModel.loadData(resp);
                        this.io.emit('control-data', resp);
                        fn(resp);
                    });
                     **/
                }

                request_handled = true;
                break;
            }
        }

        if (! request_handled) {
            let errmsg = "no valid data found in add request";
            debug(errmsg);
            fn({ error: errmsg});
            return;
        }
    }

    adminAuth(req: http.IncomingMessage, response: http.ServerResponse, identifier: string) {
        if (! identifier) {
            this.errorResponse(response, 400, "Don't come here without a session");
            return;
        }

        let adminExpires = Date.now() + (1000 * 120); // 2 minutes from now
        let expDate = new Date(adminExpires);
        let expStr = expDate.toTimeString();

        debug("admin expiration set to " + expStr);
        let loginExpires = parseInt(req.headers['oidc_claim_exp'] as string) * 1000;


        let session : UserSession = {
            login_expires: loginExpires,
            auth: true,
            admin_auth: true,
            admin_auth_expires: adminExpires,
            admin_auth_requested: false,
            username: req.headers["oidc_claim_preferred_username"] as string
        };


        this.sessions.findOneAndUpdate({ _id : identifier }, { '$set' : session },
            { returnOriginal: false},
            (err, r) => {
                if (err) {
                    this.errorResponse(response, 503, "mongodb error: " + err.message);
                    return;
                }

                if (r.value) {
                    debug("auth_requested set to " + r.value.admin_auth_requested);
                    response.setHeader('Content-Type', 'application/json');
                    response.writeHead(200);
                    response.end(JSON.stringify({ session: r.value}));
                }
                else {
                    this.errorResponse(response, 503, "failed to update user session");
                }
            }
        );
    }



    adminAuthCheck(socket : SocketIO.Socket) {
        let authCheckPromise = new Promise((resolve, reject) => {
            let session = socket["session"];

            if (! session.admin_auth) {
                debug(`no admin. unauthorized update request from ${session._id} (${session.client_name})`);
                reject({error: "unauthorized"});
                return;
            }

            if (session.admin_auth_expires > Date.now() || session.admin_auth_expires == -1) {
                debug(`admin authorization granted for ${session._id} (${session.client_name})`);
                resolve(true);
                return;
            }

            // Check for updated session info
            let col = this.mongodb.collection("sessions");

            col.findOne({_id : session._id}, (err, res) => {
                if (err) {
                    debug(`mongodb error during auth for ${session._id}: ${err.message}`);
                    reject({error: err.message});
                    return;
                }

                if (res) {
                    this["session"] = res;

                    if (res.admin_auth && res.admin_auth_expires > Date.now() || res.admin_auth_expires == -1) {
                        resolve(true);
                        return;
                    }

                    debug(`unauthorized update request from ${session._id} (${session.client_name})`);
                    debug(`auth = ${res.admin_auth}, expires = ${res.admin_auth_expires}, now = ${Date.now()}`);
                    reject({error: "unauthorized"});
                    return;
                }

                debug("authCheck: session no found " + session._id);
                reject({error: "session not found"});
            });
        });

        return authCheckPromise;
    }


    broadcastControlValues(updates: ControlUpdateData[], fn: any, socket : SocketIO.Socket) {
        let controlsCollection = this.mongodb.collection(Control.tableStr);
        let controls = this.dataModel.tables[Control.tableStr] as IndexedDataSet<Control>;


        // Commit value to database for non-ephemeral controls
        for (let update of updates) {
            //debug(`control update received: ${update.control_id} = ${update.value}`);
            if (! controls[update.control_id]) {
                debug(`dropping update of invalid control_id ${update.control_id} from ${socket["session"].client_name}`);
                return;
            }
            if (update.status == "observed" && ! update.ephemeral) {
                controlsCollection.updateOne({ _id: update.control_id},
                    { '$set' : { value: update.value}},
                    (err, r) => {
                        if (err) {
                            mongoDebug(`control value update error: ${err.message}`);
                            return;
                        }

                        // update the data model
                        controls[update.control_id].value = update.value;
                    });
            }
        }

        this.io.emit('control-updates', updates);
    }

    createEndpointSession(req: http.IncomingMessage, response: http.ServerResponse) {
        let  identifier = (new mongo.ObjectID()).toString();

        let parts = url.parse(req.url);
        let clientName = parts.query;

        //  Create a new UserInfo object
        let uiData : UserInfoData = {
            _id : "0",
            name : clientName,
            clientType: ClientType.ncontrol
        };

        this.addData( { userInfo: [uiData]}, (data) => {
            let newId = Object.keys(data.add.userInfo)[0];

            // New session
            let session : UserSession = {
                _id: identifier,
                login_expires: 0,
                auth: true,
                admin_auth: true,
                admin_auth_expires: -1,
                userInfo_id: newId
            };


            if (req.headers["oidc_claim_preferred_username"]) {
                session.username = req.headers["oidc_claim_preferred_username"] as string;
            }

            this.sessions.insertOne(session, (err, result) => {
                if (err) {
                    this.errorResponse(response, 503, "mongodb error: " + err.message);
                    return;
                }

                response.writeHead(200);
                response.end(JSON.stringify({ session: session}));
            });
        });
    }

    deleteData(data: IDCDataDelete, fn: any) {
        debug(`delete ${data._id} from ${data.table}`);

        if (! this.dataModel.types[data.table]) {
            let errmsg = `deleteData: invalid table name ${data.table}`;
            debug(errmsg);
            fn({ error: errmsg});
            return;
        }

        let col = this.mongodb.collection(data.table);

        col.deleteOne({ _id : data._id }, (err, res) => {
            if (err) {
                let errmsg = "deleteData: mongo error: " + err.message;
                debug(errmsg);
                fn({error: errmsg});
                return;
            }

            if (res.result.n == 0) {
                let errmsg = "deleteData: doc not found: " + data._id;
                debug(errmsg);
                fn({error: errmsg});
                return;
            }

            let resp = { "delete": data };
            fn(resp);
            this.io.emit("control-data", resp);
            this.dataModel.loadData(resp);
        });

    }


    disconnectSocket(socket : SocketIO.Socket) {
        if (socket["endpoint_id"]) {
            let _id = socket["endpoint_id"];

            debug(`client disconnected: setting endpoint ${_id} to offline`);
            let col = this.mongodb.collection(Endpoint.tableStr);

            col.updateOne({ _id : _id }, { '$set' : { status : EndpointStatus.Offline }},
                (err, r) => {
                    if (err) {
                        mongoDebug(`update { request.table } error: { err.message }`);
                        return;
                    }

                    // Get the updated object and broadcast the changes.
                    let table = {};
                    col.findOne({_id: _id}, (err, doc) => {
                        if (err) {
                            mongoDebug(`update { request.table } error: { err.message }`);
                            return;
                        }

                        table[doc._id] = doc;
                        let data = {add: {}};
                        data.add[Endpoint.tableStr] = table;
                        this.io.emit('control-data', data);
                    });
                }
            );
        }
        else {
            let session = socket["session"];
            if (session) {
                debug(`client ${session._id} (${session.client_name} disconnected`);
            }
            else {
                debug("unidentified client disconnected");
            }
        }
    }

    doLogon(req: http.IncomingMessage, response: http.ServerResponse, identifier: string) {
        if (! identifier) {
            this.errorResponse(response, 400, "Don't come here without a session");
            return;
        }

        let parts = url.parse(req.url);
        let queryVars = querystring.parse(parts.query);

        let admin_auth_requested = false;
        if (queryVars['admin_auth_requested']) {
            admin_auth_requested = true;
        }

        debug("do_logon, admin_auth_requested = " + admin_auth_requested);

        let loginExpires = parseInt(req.headers['oidc_claim_exp'] as string) * 1000;
        let loginExpiresTime = new Date(loginExpires);
        let nowDate = new Date();
        let nowTimeStr = nowDate.toTimeString().substr(0, 17);
        debug(`loginExpires: ${loginExpiresTime.toTimeString().substr(0, 17)}, Now: ${nowTimeStr}`);

        this.sessions.findOneAndUpdate({ _id: identifier},
            { '$set' : {
                login_expires : loginExpires,
                auth: true,
                admin_auth_requested: admin_auth_requested,
                username: req.headers["oidc_claim_preferred_username"]
            }},
            (err, doc) => {
                if (err) {
                    this.errorResponse(response, 503, "mongodb error: " + err.message);
                    return;
                }

                // Redirect to the location specified in the query string
                if (doc.value) {
                    let location = '/';
                    if (queryVars.location) {
                        location = queryVars.location;
                    }

                    debug(`logon complete, redirecting to ${location}, aar=${admin_auth_requested}`);

                    response.setHeader('Location', location);
                    response.writeHead(302);
                    response.end();
                }
                else {
                    // No session found
                    this.errorResponse(response, 400, "Session not found for identifier " + identifier);
                }
            }
        );
    }


    errorResponse(res: http.ServerResponse, code: number, message: string) {
        res.writeHead(code);
        res.end(message);

        debug(`error: ${message}`);
    }


    getData(request: IDCDataRequest, fn: any) {

        debug("data requested from " + request.table);
        let col = this.mongodb.collection(request.table);

        let table = {};
        col.find(request.params).forEach(
            (doc) => {
                table[doc._id] = doc;
            },
            () => {
                let data = { add : {} };
                data.add[request.table] = table;
                fn(data);
                this.dataModel.loadData(data);
            }
        );
    }

    getIdentifier(req: http.IncomingMessage) : string {
        let cookies = {};
        let cookieStr = req.headers['cookie'] as string;
        if (cookieStr) {
            let cstrs = cookieStr.split(';');

            for (let cstr of cstrs) {
                let [name, value] = cstr.split("=");
                cookies[name.trim()] = value;
            }
        }

        if (cookies[this.config.identifierName]) {
            return cookies[this.config.identifierName];
        }

        return '';
    }

    httpHandler(req: any, res: any) {

        let parts = url.parse(req.url);
        let pathComponents = parts.pathname.split("/");

        debug(`http request: ${parts.pathname}`);

        if (pathComponents[0] == '') {
            pathComponents= pathComponents.slice(1);
        }

        let [api, endpoint, ...path] = pathComponents;

        //TODO: implement REST API for all data functions
        if (api == "api") {
            if (endpoint == "data") {
                if (req.method == 'DELETE') {
                    let [table, _id] = path;

                    this.deleteData({ table: table, _id: _id}, (data) => {
                        if (data.error) {
                            res.writeHead(400);
                            res.end(JSON.stringify(data));
                            return;
                        }

                        res.writeHead(200);
                        res.end(JSON.stringify(data));
                        return;
                    });

                    return;
                }
            }
            else if (endpoint == "test") {
                res.writeHead(200);
                res.end("yeah, I'm alive");
                return;
            }
            else {
                res.writeHead(400);
                res.end("api endpoint not recognized");
                return;
            }
        }
        else if (api == "auth") {
            let identifier = this.getIdentifier(req);


            if (endpoint == 'admin') {
                /**
                 * admin location should be protected by the proxying webserver
                 * admin authorization will be granted to any user who hits the location
                 */
                if (path[0] == 'get_auth') {
                    this.adminAuth(req, res, identifier);
                    return;
                }
                else if (path[0] == 'create_endpoint_session') {
                    /**
                     * This endpoint requires the same protection as the admin_auth endpoint
                     * https://devctrl.dwi.ufl.edu/auth/create_endpoint_session?endpoint-name
                     */
                    this.createEndpointSession(req, res);
                    return;
                }
            }
            else if (endpoint == 'do_logon') {
                /**
                 * This endpoint should be protected.  Only users authorized to access the application
                 * should be able to access it
                 */
                this.doLogon(req, res, identifier);
                return;
            }
            else if (endpoint == 'user_session') {
                this.userSession(req, res, identifier);
                return;
            }
            else if (endpoint == 'revoke_admin') {
                this.revokeAdminAuth(req, res, identifier);
                return;
            }
        }
        else {
            res.writeHead(200);
            res.end("API missed");
            return;
        }

        debug(`api call to ${req.url} unhandled`);
        res.writeHead(500);
        res.end("unhandled api call");
    }


    ioConnection(socket: SocketIO.Socket) {
        let clientIp = socket.request.connection.remoteAddress;
        if (socket.request.headers['x-forwarded-for']) {
            clientIp = socket.request.headers['x-forwarded-for'];
        }

        debug('a user connected from ' + clientIp);
        socket.on('get-data', (req, fn) => {
            this.getData(req, fn);
        });
        socket.on('add-data', (req, fn) => {
            this.adminAuthCheck(socket)
                .then(() => {
                    this.addData(req, fn);
                })
                .catch((msg) => { fn(msg) });
        });
        socket.on('update-data', (req, fn) => {
            this.adminAuthCheck(socket)
                .then(() => {
                    this.updateData(req, fn);
                })
                .catch((msg) => { fn(msg) });
        });
        socket.on('control-updates', (req, fn) => {
            this.broadcastControlValues(req, fn, socket);
        });
        socket.on('register-endpoint', (req, fn) => {
            this.adminAuthCheck(socket)
                .then(() => {
                    this.registerEndpoint(req, fn, socket);
                })
                .catch((msg) => { fn(msg) });
        });

        socket.on('disconnect', () => {
            this.disconnectSocket(socket);
        });
    }

    /**
     * Register endpoint associates and endpoint id with the socket held by
     * the ncontrol instance communicating with that endpoint.  If the socket
     * is disconnected, we can update the endpoint status accordingly.
     *
     * @param request
     * @param fn
     * @socket socket SocketIO.Socket the socket this message was sent on
     */

    registerEndpoint(request, fn : any, socket : SocketIO.Socket) {
        if (! request.endpoint_id) {
            debug('register endpoint: endpoint_id not specified');
            fn({ error: "endpoint_id not specified"});
            return;
        }

        debug(`endpoint ${request.endpoint_id} registered on socket ${socket.id}`);
        socket["endpoint_id"] = request.endpoint_id;
    }


    revokeAdminAuth(req: http.IncomingMessage, response: http.ServerResponse, identifier: string) {
        // This endpoint sets removes the admin auth from the session
        // Additional actions will be required to ensure that users cannot regain admin auth
        // without resupplying credentials
        if (! identifier) {
            this.errorResponse(response, 400, "Don't come here without a session");
            return;
        }

        let adminExpires = Date.now(); // now
        let loginExpires = parseInt(req.headers['oidc_claim_exp'] as string) * 1000;


        let session : UserSession = {
            login_expires: loginExpires,
            auth: true,
            admin_auth: false,
            admin_auth_expires: adminExpires,
            admin_auth_requested: false,
            username: req.headers["oidc_claim_preferred_username"] as string
        };


        this.sessions.findOneAndUpdate({ _id : identifier }, { '$set' : session },
            { returnOriginal: false},
            (err, r) => {
                if (err) {
                    this.errorResponse(response, 503, "mongodb error: " + err.message);
                    return;
                }

                if (r.value) {
                    debug("auth_requested set to " + r.value.admin_auth_requested);
                    response.setHeader('Content-Type', 'application/json');
                    response.writeHead(200);
                    response.end(JSON.stringify({ session: r.value}));
                }
                else {
                    this.errorResponse(response, 503, "failed to update user session");
                }
            }
        );
    }

    /**
     * At startup, set all endpoints to a disconnected status
     */

    setEndpointsDisconnected() {
        let col = this.mongodb.collection(Endpoint.tableStr);
        return col.updateMany({}, { '$set' : { status : EndpointStatus.Offline}});
    }

    socketAuthId(socket) {

        if (socket.handshake && socket.handshake.headers['cookie']) {
            let cookies = {};

            let cstrs = socket.handshake.headers['cookie'].split(';');

            for (let cstr of cstrs) {
                let [name, value] = cstr.split("=");
                cookies[name.trim()] = value;
            }


            if (cookies[this.config.identifierName]) {
                return cookies[this.config.identifierName];
            }
        }

        if (socket.handshake && socket.handshake.headers['ncontrol-auth-id']) {
            return socket.handshake.headers['ncontrol-auth-id'];
        }

        return '';
    }


    updateData(request: IDCDataUpdate, fn: any) {
        //TODO: sanitize table name
        let col = this.mongodb.collection(request.table);

        if (request.set._id) {
            delete request.set._id;
        }

        col.updateOne({ _id : request._id }, { '$set' : request.set },
            (err, r) => {
                if (err) {
                    mongoDebug(`update ${request.table} error: ${err.message}`);
                    fn({error: err.message});

                    return;
                }

                debug(`data updated on ${request.table}.${request._id}`);
                // Get the updated object and broadcast the changes.
                let table = {};
                col.find({_id: request._id}).forEach(
                    (doc) => {
                        table[doc._id] = doc;
                    },
                    () =>{
                        let data = {add: {}};
                        data.add[request.table] = table;
                        this.io.emit('control-data', data);
                        fn(data);
                        this.dataModel.loadData(data);
                    }
                );
            }
        );
    }

    userSession(req: http.IncomingMessage, response: http.ServerResponse, identifier: string) {
        // This endpoint returns the current user session or creates a new one if necessary
        let idProvided = true;

        if (! identifier) {
            idProvided = false;
            // This identifier is secret and known only to this client
            identifier = (new mongo.ObjectID()).toString();
        }

        if (idProvided) {
            this.sessions.findOne({ _id: identifier}, (err, doc) => {
                if (err) {
                    this.errorResponse(response, 503, "mongodb error: " + err.message);
                    return;
                }

                if (doc) {
                    let session:UserSession = (<UserSession>doc);

                    // Create UserInfo object if necessary
                    if (! session.userInfo_id) {
                        let uiData : UserInfoData = {
                            _id : "0",
                            name: session.client_name,
                            clientType: ClientType.web
                        };

                        this.addData({ userInfo: [uiData]}, (data) => {
                            let newId = Object.keys(data.add.userInfo)[0];
                            session.userInfo_id = newId;

                            this.sessions.updateOne({ _id: session._id },
                                { '$set' : { userInfo_id : newId}},
                                (err, doc) => {
                                    if (err) {
                                        this.errorResponse(response, 503, "mongodb error updating UserSession:" + err.message);
                                        return;
                                    }

                                    response.writeHead(200);
                                    response.end(JSON.stringify({session: session}));
                                });
                        });
                    }
                    else {
                        response.writeHead(200);
                        response.end(JSON.stringify({session: session}));
                    }
                }
                else {
                    // No session found
                    this.errorResponse(response, 400, "Session not found for identifier " + identifier);
                }
            });
        }
        else {
            //  Create a new UserInfo object
            let uiData : UserInfoData = {
                _id : "0",
                name : "unknown client",
                clientType: ClientType.web
            };

            if (req.headers['x-forwarded-for']) {
                uiData.name = req.headers['x-forwarded-for'] as string;
            }

            this.addData({ userInfo: [uiData]}, (data) => {
                let newId = Object.keys(data.add.userInfo)[0];


                // New session
                let session : UserSession = {
                    _id: identifier,
                    login_expires: 0,
                    auth: false,
                    admin_auth: false,
                    admin_auth_expires: 0,
                    userInfo_id: newId
                };


                if (req.headers["oidc_claim_preferred_username"]) {
                    session.username = req.headers["oidc_claim_preferred_username"] as string;
                }

                this.sessions.insertOne(session, (err, _result) => {
                    if (err) {
                        this.errorResponse(response, 503, "mongodb error: " + err.message);
                        return;
                    }

                    let oneYear = 1000 * 3600 * 24 * 365;
                    let cookieExpire = new Date(Date.now() + oneYear);
                    let expStr = cookieExpire.toUTCString();
                    let idCookie = `${this.config.identifierName}=${identifier};expires=${expStr};path=/`;

                    response.setHeader('Set-Cookie', [idCookie]);
                    response.writeHead(200);
                    response.end(JSON.stringify({ session: session}));
                });

            });
        }
    }
}

module.exports = new Messenger();