#!/usr/bin/env node
"use strict";
var ioMod = require("socket.io");
var http = require("http");
var url = require("url");
var debugMod = require("debug");
var mongo = require("mongodb");
var DCDataModel_1 = require("./shared/DCDataModel");
var Control_1 = require("./shared/Control");
var debug = debugMod("messenger");
var mongoDebug = debugMod("mongodb");
var app = http.createServer(handler);
var io = ioMod(app);
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
        Messenger.dataModel = new DCDataModel_1.DCDataModel();
        // Connect to mongodb
        var mongoConnStr = "mongodb://" + config.mongoHost + ":" + config.mongoPort
            + "/" + config.mongoDB;
        mongo.MongoClient.connect(mongoConnStr, function (err, db) {
            debug("mongodb connected");
            Messenger.mongodb = db;
        });
        app.listen(config.ioPort);
        io.on('connection', Messenger.ioConnection);
    };
    Messenger.addData = function (request, fn) {
        var resp = { add: {} };
        var request_handled = false;
        var _loop_1 = function(table) {
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
            if (typeof state_1 === "object") return state_1.value;
            if (state_1 === "break") break;
        }
        if (!request_handled) {
            var errmsg = "no valid data found in add request";
            debug(errmsg);
            fn({ error: errmsg });
            return;
        }
    };
    Messenger.broadcastControlValues = function (updates, fn) {
        io.emit('control-updates', updates);
        var controls = Messenger.mongodb.collection(Control_1.Control.tableStr);
        // Commit value to database for non-ephemeral controls
        for (var _i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
            var update = updates_1[_i];
            if (update.status == "observed" && !update.ephemeral) {
                controls.updateOne({ _id: update.control_id }, { '$set': { value: update.value } });
            }
        }
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
        });
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
        });
    };
    Messenger.ioConnection = function (socket) {
        var clientIp = socket.request.connection.remoteAddress;
        if (socket.request.headers['x-forwarded-for']) {
            clientIp = socket.request.headers['x-forwarded-for'];
        }
        debug('a user connected from ' + clientIp);
        socket.on('get-data', Messenger.getData);
        socket.on('add-data', Messenger.addData);
        socket.on('update-data', Messenger.updateData);
        socket.on('control-updates', Messenger.broadcastControlValues);
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
            // Get the updated object and broadcast the changes.
            var table = {};
            col.find({ _id: request._id }).forEach(function (doc) {
                table[doc._id] = doc;
            }, function () {
                var data = { add: {} };
                data.add[request.table] = table;
                io.emit('control-data', data);
                fn(data);
            });
        });
    };
    return Messenger;
}());
module.exports = new Messenger();
//# sourceMappingURL=messenger.js.map