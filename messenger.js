#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ioMod = require("socket.io");
var http = require("http");
var url = require("url");
var mongo = require("mongodb");
var DCDataModel_1 = require("./shared/DCDataModel");
var Control_1 = require("./shared/Control");
var Endpoint_1 = require("./shared/Endpoint");
//let debug = debugMod("messenger");
var debug = console.log;
//let mongoDebug = debugMod("mongodb");
var mongoDebug = console.log;
var app = http.createServer(handler);
var io;
function handler(req, res) {
    var parts = url.parse(req.url);
    var pathComponents = parts.pathname.split("/");
    debug("http request: " + parts.pathname);
    if (pathComponents[0] == '') {
        pathComponents = pathComponents.slice(1);
    }
    var api = pathComponents[0], endpoint = pathComponents[1], path = pathComponents.slice(2);
    //TODO: implement REST API for all data functions
    if (api == "api") {
        if (endpoint == "data") {
            if (req.method == 'DELETE') {
                var table = path[0], _id = path[1];
                Messenger.deleteData({ table: table, _id: _id }, function (data) {
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
    debug("api call to " + req.url + " unhandled");
    res.writeHead(500);
    res.end("unhandled api call");
}
var Messenger = (function () {
    function Messenger() {
    }
    Messenger.prototype.run = function (config) {
        var _this = this;
        Messenger.dataModel = new DCDataModel_1.DCDataModel();
        this.config = config;
        // Connect to mongodb
        var mongoConnStr = "mongodb://" + config.mongoHost + ":" + config.mongoPort
            + "/" + config.mongoDB;
        mongo.MongoClient.connect(mongoConnStr, function (err, db) {
            debug("mongodb connected");
            Messenger.mongodb = db;
            Messenger.setEndpointsDisconnected();
        });
        app.listen(config.ioPort);
        io = ioMod(app, { path: config.ioPath });
        debug("socket.io listening at " + config.ioPath + " on port " + config.ioPort);
        io.on('connection', Messenger.ioConnection);
        // Set authorization function
        io.use(function (socket, next) {
            var id = _this.socketAuthId(socket);
            //debug("authenticating user " + id);
            if (id) {
                var col = Messenger.mongodb.collection("sessions");
                col.findOne({ _id: id }, function (err, res) {
                    if (err) {
                        debug("mongodb error during auth for " + id + ": " + err.message);
                        next(new Error("Authentication error"));
                        return;
                    }
                    if (res && res.auth) {
                        debug("user " + id + " authenticated");
                        socket["session"] = res;
                        next();
                        return;
                    }
                    debug("connection attempt from unauthorized user " + id);
                    next(new Error("Unauthorized"));
                });
            }
        });
    };
    Messenger.addData = function (request, fn) {
        var resp = { add: {} };
        var request_handled = false;
        var _loop_1 = function (table) {
            if (request[table]) {
                var col = Messenger.mongodb.collection(table);
                resp.add[table] = {};
                if (Array.isArray(request[table])) {
                    // Add an array of documents
                    var addDocs_1 = [];
                    for (var idx in request[table]) {
                        // Sanitize data by creating objects and serializing them
                        try {
                            var data = request[table][idx];
                            data._id = (new mongo.ObjectID()).toString();
                            var obj = new Messenger.dataModel.types[table](data._id, data);
                            var doc = obj.getDataObject();
                            addDocs_1.push(doc);
                        }
                        catch (e) {
                            var errmsg = "invalid data received: " + e.message;
                            debug(errmsg);
                            fn({ error: errmsg });
                            return { value: void 0 };
                        }
                    }
                    col.insertMany(addDocs_1, function (err, r) {
                        if (err) {
                            mongoDebug(err.message);
                            fn({ error: err.message });
                            return;
                        }
                        mongoDebug(r.insertedCount + " records added to " + table);
                        resp.add[table] = {};
                        for (var _i = 0, addDocs_2 = addDocs_1; _i < addDocs_2.length; _i++) {
                            var doc = addDocs_2[_i];
                            resp.add[table][doc._id] = doc;
                        }
                        Messenger.dataModel.loadData(resp);
                        io.emit('control-data', resp);
                        fn(resp);
                    });
                }
                else {
                    var doc = void 0;
                    // Sanitize data by creating an object and serializing it
                    try {
                        var data = request[table];
                        data._id = (new mongo.ObjectID()).toString();
                        var obj = new Messenger.dataModel.types[table](data._id, data);
                        doc = obj.getDataObject();
                    }
                    catch (e) {
                        var errmsg = "invalid data received: " + e.message;
                        debug(errmsg);
                        fn({ error: errmsg });
                        return { value: void 0 };
                    }
                    col.insertOne(doc, function (err, r) {
                        if (err) {
                            mongoDebug(err.message);
                            fn({ error: err.message });
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
                return "break";
            }
        };
        for (var table in Messenger.dataModel.types) {
            var state_1 = _loop_1(table);
            if (typeof state_1 === "object")
                return state_1.value;
            if (state_1 === "break")
                break;
        }
        if (!request_handled) {
            var errmsg = "no valid data found in add request";
            debug(errmsg);
            fn({ error: errmsg });
            return;
        }
    };
    Messenger.adminAuthCheck = function (socket) {
        var _this = this;
        var authCheckPromise = new Promise(function (resolve, reject) {
            var session = socket["session"];
            if (!session.admin_auth) {
                debug("no admin. unauthorized update request from " + session._id + " (" + session.client_name + ")");
                reject({ error: "unauthorized" });
                return;
            }
            if (session.admin_auth_expires > Date.now() || session.admin_auth_expires == -1) {
                debug("admin authorization granted for " + session._id + " (" + session.client_name + ")");
                resolve(true);
                return;
            }
            // Check for updated session info
            var col = Messenger.mongodb.collection("sessions");
            col.findOne({ _id: session._id }, function (err, res) {
                if (err) {
                    debug("mongodb error during auth for " + session._id + ": " + err.message);
                    reject({ error: err.message });
                    return;
                }
                if (res) {
                    _this["session"] = res;
                    if (res.admin_auth && res.admin_auth_expires > Date.now() || res.admin_auth_expires == -1) {
                        resolve(true);
                        return;
                    }
                    debug("unauthorized update request from " + session._id + " (" + session.client_name + ")");
                    debug("auth = " + res.admin_auth + ", expires = " + res.admin_auth_expires + ", now = " + Date.now());
                    reject({ error: "unauthorized" });
                    return;
                }
                debug("authCheck: session no found " + session._id);
                reject({ error: "session not found" });
            });
        });
        return authCheckPromise;
    };
    Messenger.broadcastControlValues = function (updates, fn, socket) {
        var controlsCollection = Messenger.mongodb.collection(Control_1.Control.tableStr);
        var controls = Messenger.dataModel.controls;
        var _loop_2 = function (update) {
            //debug(`control update received: ${update.control_id} = ${update.value}`);
            if (!controls[update.control_id]) {
                debug("dropping update of invalid control_id " + update.control_id + " from " + socket["session"].client_name);
                return { value: void 0 };
            }
            if (update.status == "observed" && !update.ephemeral) {
                controlsCollection.updateOne({ _id: update.control_id }, { '$set': { value: update.value } }, function (err, r) {
                    if (err) {
                        mongoDebug("control value update error: " + err.message);
                        return;
                    }
                    // update the data model
                    controls[update.control_id].value = update.value;
                });
            }
        };
        // Commit value to database for non-ephemeral controls
        for (var _i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
            var update = updates_1[_i];
            var state_2 = _loop_2(update);
            if (typeof state_2 === "object")
                return state_2.value;
        }
        io.emit('control-updates', updates);
    };
    Messenger.deleteData = function (data, fn) {
        debug("delete " + data._id + " from " + data.table);
        if (!Messenger.dataModel.types[data.table]) {
            var errmsg = "deleteData: invalid table name " + data.table;
            debug(errmsg);
            fn({ error: errmsg });
            return;
        }
        var col = Messenger.mongodb.collection(data.table);
        col.deleteOne({ _id: data._id }, function (err, res) {
            if (err) {
                var errmsg = "deleteData: mongo error: " + err.message;
                debug(errmsg);
                fn({ error: errmsg });
                return;
            }
            if (res.result.n == 0) {
                var errmsg = "deleteData: doc not found: " + data._id;
                debug(errmsg);
                fn({ error: errmsg });
                return;
            }
            var resp = { "delete": data };
            fn(resp);
            io.emit("control-data", resp);
            Messenger.dataModel.loadData(resp);
        });
    };
    Messenger.disconnectSocket = function (socket) {
        if (socket["endpoint_id"]) {
            var _id_1 = socket["endpoint_id"];
            debug("client disconnected: setting endpoint " + _id_1 + " to offline");
            var col_1 = Messenger.mongodb.collection(Endpoint_1.Endpoint.tableStr);
            col_1.updateOne({ _id: _id_1 }, { '$set': { status: Endpoint_1.EndpointStatus.Offline } }, function (err, r) {
                if (err) {
                    mongoDebug("update { request.table } error: { err.message }");
                    return;
                }
                // Get the updated object and broadcast the changes.
                var table = {};
                col_1.findOne({ _id: _id_1 }, function (err, doc) {
                    if (err) {
                        mongoDebug("update { request.table } error: { err.message }");
                        return;
                    }
                    table[doc._id] = doc;
                    var data = { add: {} };
                    data.add[Endpoint_1.Endpoint.tableStr] = table;
                    io.emit('control-data', data);
                });
            });
        }
        else {
            var session = socket["session"];
            if (session) {
                debug("client " + session._id + " (" + session.client_name + " disconnected");
            }
            else {
                debug("unidentified client disconnected");
            }
        }
    };
    Messenger.getData = function (request, fn) {
        debug("data requested from " + request.table);
        var col = Messenger.mongodb.collection(request.table);
        var table = {};
        col.find(request.params).forEach(function (doc) {
            table[doc._id] = doc;
        }, function () {
            var data = { add: {} };
            data.add[request.table] = table;
            fn(data);
            Messenger.dataModel.loadData(data);
        });
    };
    Messenger.ioConnection = function (socket) {
        var clientIp = socket.request.connection.remoteAddress;
        if (socket.request.headers['x-forwarded-for']) {
            clientIp = socket.request.headers['x-forwarded-for'];
        }
        debug('a user connected from ' + clientIp);
        socket.on('get-data', Messenger.getData);
        socket.on('add-data', function (req, fn) {
            Messenger.adminAuthCheck(socket)
                .then(function () {
                Messenger.addData(req, fn);
            })
                .catch(function (msg) { fn(msg); });
        });
        socket.on('update-data', function (req, fn) {
            Messenger.adminAuthCheck(socket)
                .then(function () {
                Messenger.updateData(req, fn);
            })
                .catch(function (msg) { fn(msg); });
        });
        socket.on('control-updates', function (req, fn) {
            Messenger.broadcastControlValues(req, fn, socket);
        });
        socket.on('register-endpoint', function (req, fn) {
            Messenger.adminAuthCheck(socket)
                .then(function () {
                Messenger.registerEndpoint(req, fn, socket);
            })
                .catch(function (msg) { fn(msg); });
        });
        socket.on('disconnect', function () {
            Messenger.disconnectSocket(socket);
        });
    };
    /**
     * Register endpoint associates and endpoint id with the socket held by
     * the ncontrol instance communicating with that endpoint.  If the socket
     * is disconnected, we can update the endpoint status accordingly.
     *
     * @param request
     * @param fn
     * @socket socket SocketIO.Socket the socket this message was sent on
     */
    Messenger.registerEndpoint = function (request, fn, socket) {
        if (!request.endpoint_id) {
            debug('register endpoint: endpoint_id not specified');
            fn({ error: "endpoint_id not specified" });
            return;
        }
        debug("endpoint " + request.endpoint_id + " registered on socket " + socket.id);
        socket["endpoint_id"] = request.endpoint_id;
    };
    /**
     * At startup, set all endpoints to a disconnected status
     */
    Messenger.setEndpointsDisconnected = function () {
        var col = Messenger.mongodb.collection(Endpoint_1.Endpoint.tableStr);
        return col.updateMany({}, { '$set': { status: Endpoint_1.EndpointStatus.Offline } });
    };
    Messenger.prototype.socketAuthId = function (socket) {
        if (socket.handshake && socket.handshake.headers['cookie']) {
            var cookies = {};
            var cstrs = socket.handshake.headers['cookie'].split(';');
            for (var _i = 0, cstrs_1 = cstrs; _i < cstrs_1.length; _i++) {
                var cstr = cstrs_1[_i];
                var _a = cstr.split("="), name_1 = _a[0], value = _a[1];
                cookies[name_1.trim()] = value;
            }
            if (cookies[this.config.identifierName]) {
                return cookies[this.config.identifierName];
            }
        }
        if (socket.handshake && socket.handshake.headers['ncontrol-auth-id']) {
            return socket.handshake.headers['ncontrol-auth-id'];
        }
        return '';
    };
    Messenger.updateData = function (request, fn) {
        var col = Messenger.mongodb.collection(request.table);
        if (request.set._id) {
            delete request.set._id;
        }
        col.updateOne({ _id: request._id }, { '$set': request.set }, function (err, r) {
            if (err) {
                mongoDebug("update { request.table } error: { err.message }");
                fn({ error: err.message });
                return;
            }
            debug("data updated on " + request.table + "." + request._id);
            // Get the updated object and broadcast the changes.
            var table = {};
            col.find({ _id: request._id }).forEach(function (doc) {
                table[doc._id] = doc;
            }, function () {
                var data = { add: {} };
                data.add[request.table] = table;
                io.emit('control-data', data);
                fn(data);
                Messenger.dataModel.loadData(data);
            });
        });
    };
    return Messenger;
}());
module.exports = new Messenger();
//# sourceMappingURL=messenger.js.map