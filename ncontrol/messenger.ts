#!/usr/bin/env node
"use strict";

import * as ioMod from "socket.io";
import * as http from "http";
import * as debugMod from "debug";
import * as mongo from "mongodb";
import {IDCDataRequest} from "../shared/DCSerializable";
import {DCDataModel} from "../shared/DCDataModel";

let debug = debugMod("messenger");
let mongoDebug = debugMod("mongodb");

let app = http.createServer(handler);
let io :SocketIO.Server = ioMod(app);

function handler(req: any, res: any) {
    res.writeHead(200);
    res.end("Hello World");
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
                            let obj = new Messenger.dataModel.types[table](data._id, data);
                            let doc = obj.getDataObject();
                            delete doc._id;

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
                        let obj = new Messenger.dataModel.types[table](data._id, data);
                        doc = obj.getDataObject();
                        delete doc._id;
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

                break;
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
            }
        );
    }

    static ioConnection(socket: SocketIO.Socket) {
        let clientIp = socket.request.connection.remoteAddress;

        debug('a user connected from ' + clientIp);
        socket.on('get-data', Messenger.getData);
        socket.on('add-data', Messenger.addData);
    }


}

module.exports = new Messenger();