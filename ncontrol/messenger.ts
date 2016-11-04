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

let debug = debugMod("messenger");
let mongoDebug = debugMod("mongodb");

let app = http.createServer(handler);
let io :SocketIO.Server = ioMod(app);

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

    constructor() {
    }

    run(config: any) {
        Messenger.dataModel = new DCDataModel();

        // Connect to mongodb
        let mongoConnStr = "mongodb://" + config.mongoHost + ":" + config.mongoPort
            + "/" + config.mongoDB;

        mongo.MongoClient.connect( mongoConnStr, function(err, db) {
            debug("mongodb connected");
            Messenger.mongodb = db;
        });

        app.listen(config.ioPort);

        io.on('connection', Messenger.ioConnection);
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


    static broadcastControlValues(updates: ControlUpdateData[], fn: any) {
        io.emit('control-updates', updates);

        let controls = Messenger.mongodb.collection(Control.tableStr);

        // Commit value to database for non-ephemeral controls
        for (let update of updates) {
            if (update.status == "observed" && ! update.ephemeral) {
                controls.updateOne({ _id: update.control_id}, { '$set' : { value: update.value}});
            }
        }
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
        });

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
        socket.on('add-data', Messenger.addData);
        socket.on('update-data', Messenger.updateData);
        socket.on('control-updates', Messenger.broadcastControlValues);
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
                    }
                );
            }
        );
    }
}

module.exports = new Messenger();