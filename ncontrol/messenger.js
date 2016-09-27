#!/usr/bin/env node
"use strict";
var ioMod = require("socket.io");
var http = require("http");
var debugMod = require("debug");
var mongo = require("mongodb");
var DCDataModel_1 = require("../shared/DCDataModel");
var debug = debugMod("messenger");
var mongoDebug = debugMod("mongodb");
var app = http.createServer(handler);
var io = ioMod(app);
function handler(req, res) {
    res.writeHead(200);
    res.end("Hello World");
    //TODO: add REST API for data functions
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
                return "break";
            }
        };
        for (var table in Messenger.dataModel.types) {
            var state_1 = _loop_1(table);
            if (typeof state_1 === "object") return state_1.value;
            if (state_1 === "break") break;
        }
    };
    Messenger.broadcastControlValues = function (request, fn) {
        io.emit('control-updates', request);
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