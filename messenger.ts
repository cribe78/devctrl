#!/usr/bin/env node
"use strict";

import * as ioMod from "socket.io";
import * as http from "http";
import * as url from "url";
import * as debugMod from "debug";
import * as mongo from "mongodb";
import {IDCDataRequest, IDCDataUpdate, IDCDataDelete} from "./shared/DCSerializable";
import {DCDataModel} from "./shared/DCDataModel";
import {ControlUpdateData} from "./shared/ControlUpdate";
import {Control} from "./shared/Control";
import {UserSession} from "./shared/UserSession";
import {Endpoint, EndpointStatus} from "./shared/Endpoint";

//let debug = debugMod("messenger");
let debug = console.log;
//let mongoDebug = debugMod("mongodb");
let mongoDebug = console.log;

let app = http.createServer(handler);
let io :SocketIO.Server;

function handler(req: any, res: any) {



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

                Messenger.deleteData({ table: table, _id: _id}, function(data) {
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
    else {
        res.writeHead(200);
        res.end("API missed");
        return;
    }

    debug(`api call to ${req.url} unhandled`);
    res.writeHead(500);
    res.end("unhandled api call");

}


class Messenger {
    static mongodb: mongo.Db;
    static dataModel: DCDataModel;
    config : any;

    constructor() {
    }

    run(config: any) {
        Messenger.dataModel = new DCDataModel();
        this.config = config;

        // Connect to mongodb
        let mongoConnStr = "mongodb://" + config.mongoHost + ":" + config.mongoPort
            + "/" + config.mongoDB;

        mongo.MongoClient.connect( mongoConnStr, function(err, db) {
            debug("mongodb connected");
            Messenger.mongodb = db;
            Messenger.setEndpointsDisconnected();
        });

        app.listen(config.ioPort);
        io = ioMod(app, { path: config.ioPath});
        debug(`socket.io listening at ${config.ioPath} on port ${config.ioPort}`);
        io.on('connection', Messenger.ioConnection);

        // Set authorization function
        io.use((socket,next) => {
            let id = this.socketAuthId(socket);
            //debug("authenticating user " + id);
            if (id) {
                let col = Messenger.mongodb.collection("sessions");
                col.findOne({_id : id}, function(err, res) {
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


    static addData(request: any, fn: any) {
        let resp = { add : {}};
        let request_handled = false;

        for (let table in Messenger.dataModel.types) {
            if (request[table]) {
                let col = Messenger.mongodb.collection(table);
                resp.add[table] = {};
                if (Array.isArray(request[table])) {
                    // Add an array of documents
                    let addDocs = [];
                    for (let idx in request[table]) {
                        // Sanitize data by creating objects and serializing them
                        try {
                            let data = request[table][idx];
                            data._id = (new mongo.ObjectID()).toString();
                            let obj = new Messenger.dataModel.types[table](data._id, data);
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

                    col.insertMany(addDocs, function(err, r) {
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

                        io.emit('control-data', resp);
                        fn(resp);
                    });
                }
                else {
                    let doc;

                    // Sanitize data by creating an object and serializing it
                    try {
                        let data = request[table];
                        data._id = (new mongo.ObjectID()).toString();
                        let obj = new Messenger.dataModel.types[table](data._id, data);
                        doc = obj.getDataObject();
                    }
                    catch (e) {
                        let errmsg = "invalid data received: " + e.message;
                        debug(errmsg);
                        fn({ error: errmsg});
                        return;
                    }

                    col.insertOne(doc, function(err, r) {
                        if (err) {
                            mongoDebug(err.message);
                            fn({ error: err.message});

                            return;
                        }

                        mongoDebug("record added to " + table);
                        resp.add[table][request[table]._id] = request[table];

                        // Keep local dataModel in sync
                        Messenger.dataModel.loadData(resp);
                        io.emit('control-data', resp);
                        fn(resp);
                    });
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

    static adminAuthCheck(socket : SocketIO.Socket) {
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
            let col = Messenger.mongodb.collection("sessions");

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


    static broadcastControlValues(updates: ControlUpdateData[], fn: any, socket : SocketIO.Socket) {
        let controlsCollection = Messenger.mongodb.collection(Control.tableStr);
        let controls = Messenger.dataModel.controls;

        // Commit value to database for non-ephemeral controls
        for (let update of updates) {
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

        io.emit('control-updates', updates);
    }

    static deleteData(data: IDCDataDelete, fn: any) {
        debug(`delete ${data._id} from ${data.table}`);

        if (! Messenger.dataModel.types[data.table]) {
            let errmsg = `deleteData: invalid table name ${data.table}`;
            debug(errmsg);
            fn({ error: errmsg});
            return;
        }

        let col = Messenger.mongodb.collection(data.table);

        col.deleteOne({ _id : data._id }, function(err, res) {
            if (err) {
                let errmsg = "deleteData: mongo error: " + err.message;
                debug(errmsg);
                fn({error: errmsg});
                return;
            }

            if (res.result.n == 0) {
                let errmsg = "deleteData: doc not found: " + data._id;
                debug(errmsg);
                fn({error: errmsg})
                return;
            }

            let resp = { "delete": data }
            fn(resp);
            io.emit("control-data", resp);
            Messenger.dataModel.loadData(resp);
        });

    }


    static disconnectSocket(socket : SocketIO.Socket) {
        if (socket["endpoint_id"]) {
            let _id = socket["endpoint_id"];

            debug(`client disconnected: setting endpoint ${_id} to offline`);
            let col = Messenger.mongodb.collection(Endpoint.tableStr);

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
                        io.emit('control-data', data);
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

    static getData(request: IDCDataRequest, fn: any) {

        debug("data requested from " + request.table);
        let col = Messenger.mongodb.collection(request.table);

        let table = {};
        col.find(request.params).forEach(
            function(doc) {
                table[doc._id] = doc;
            },
            function() {
                let data = { add : {} };
                data.add[request.table] = table;
                fn(data);
                Messenger.dataModel.loadData(data);
            }
        );
    }

    static ioConnection(socket: SocketIO.Socket) {
        let clientIp = socket.request.connection.remoteAddress;
        if (socket.request.headers['x-forwarded-for']) {
            clientIp = socket.request.headers['x-forwarded-for'];
        }

        debug('a user connected from ' + clientIp);
        socket.on('get-data', Messenger.getData);
        socket.on('add-data', (req, fn) => {
            Messenger.adminAuthCheck(socket)
                .then(() => {
                    Messenger.addData(req, fn);
                })
                .catch((msg) => { fn(msg) });
        });
        socket.on('update-data', (req, fn) => {
            Messenger.adminAuthCheck(socket)
                .then(() => {
                    Messenger.updateData(req, fn);
                })
                .catch((msg) => { fn(msg) });
        });
        socket.on('control-updates', (req, fn) => {
            Messenger.broadcastControlValues(req, fn, socket);
        });
        socket.on('register-endpoint', (req, fn) => {
            Messenger.adminAuthCheck(socket)
                .then(() => {
                    Messenger.registerEndpoint(req, fn, socket);
                })
                .catch((msg) => { fn(msg) });
        });

        socket.on('disconnect', () => {
            Messenger.disconnectSocket(socket);
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

    static registerEndpoint(request, fn : any, socket : SocketIO.Socket) {
        if (! request.endpoint_id) {
            debug('register endpoint: endpoint_id not specified');
            fn({ error: "endpoint_id not specified"});
            return;
        }

        debug(`endpoint ${request.endpoint_id} registered on socket ${socket.id}`);
        socket["endpoint_id"] = request.endpoint_id;
    }

    /**
     * At startup, set all endpoints to a disconnected status
     */

    static setEndpointsDisconnected() {
        let col = Messenger.mongodb.collection(Endpoint.tableStr);
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


    static updateData(request: IDCDataUpdate, fn: any) {
        let col = Messenger.mongodb.collection(request.table);

        if (request.set._id) {
            delete request.set._id;
        }

        col.updateOne({ _id : request._id }, { '$set' : request.set },
            function(err, r) {
                if (err) {
                    mongoDebug(`update { request.table } error: { err.message }`);
                    fn({error: err.message});

                    return;
                }

                debug(`data updated on ${request.table}.${request._id}`);
                // Get the updated object and broadcast the changes.
                let table = {};
                col.find({_id: request._id}).forEach(
                    function (doc) {
                        table[doc._id] = doc;
                    },
                    function () {
                        let data = {add: {}};
                        data.add[request.table] = table;
                        io.emit('control-data', data);
                        fn(data);
                        Messenger.dataModel.loadData(data);
                    }
                );
            }
        );
    }
}

module.exports = new Messenger();