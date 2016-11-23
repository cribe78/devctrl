"use strict";

import * as io from "socket.io-client";
import {DCDataModel, IndexedDataSet} from "./shared/DCDataModel";
import {IDCDataRequest, IDCDataUpdate} from "./shared/DCSerializable";
import * as debugMod from "debug"; // see https://www.npmjs.com/package/debug
import {Control} from "./shared/Control";
import {ControlUpdateData, ControlUpdate} from "./shared/ControlUpdate";
import {Endpoint, EndpointStatus} from "./shared/Endpoint";
import {WatcherRule} from "./shared/WatcherRule";

//let debug = debugMod('watcher');
let debug = console.log;

let watchConfig = {

}


class Watcher {
    config: any;
    dataModel: DCDataModel;
    io : SocketIOClient.Socket;
    // watcherRules is the set of WatcherRules, indexed by watched_control_id
    watcherRules : {
        [index: string] : IndexedDataSet<WatcherRule>
    } = {};


    constructor() {
        this.dataModel = new DCDataModel();
        //this.dataModel.debug = debugMod("dataModel");
        this.dataModel.debug = debug;
    }
    static bootstrap() {
        return new Watcher();
    }

    private getData(reqData: IDCDataRequest) {
        var self = this;
        this.io.emit('get-data', reqData, (data) => {
            if ( data.error ) {
                debug("get-data error: " + data.error);
            }
            else {
                self.dataModel.loadData(data);
                if (data.add && data.add[WatcherRule.tableStr]) {
                    this.loadWatcherRules();
                }
            }
        });
    }

    run(config: any) {
        this.config = config;
        let connectOpts = {
            transports: ['websocket'],
            path : config.ioPath
        };

        connectOpts['extraHeaders'] = { 'ncontrol-auth-id' : config.authId };

        this.io = io.connect(config.wsUrl, connectOpts);

        this.io.on('connect', () => {
            debug("websocket client connected");

            let reqData : IDCDataRequest = {table: WatcherRule.tableStr, params: {}};
            this.getData(reqData);
        });

        this.io.on('control-data', (data) => {
            this.dataModel.loadData(data);
            if ((data.add && data.add[WatcherRule.tableStr]) ||
                data.delete && data.delete.table == WatcherRule.tableStr) {
                this.loadWatcherRules();
            }
        });

        this.io.on('control-updates', (data) => {
            debug("control updates received");
            this.handleControlUpdates(data);
        });3
    }

    guid() : string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }


    generateUpdateSet(data: ControlUpdateData[], checkStatus = true) {
        let updates : ControlUpdateData[] = [];
        for (let updateData of data) {
            if (this.watcherRules[updateData.control_id]) {
                let controlRules = this.watcherRules[updateData.control_id];
                for (let ruleId in controlRules) {
                    let rule = controlRules[ruleId];
                    let update = new ControlUpdate(updateData._id, updateData);

                    let ruleUpdate = rule.generateControlUpdate(update, this.guid(), checkStatus);

                    if (Watcher.isString(ruleUpdate)) {
                        debug(`watcherRule match fail: ${ruleUpdate}`);
                    }
                    else {
                        updates.push(ruleUpdate);
                    }
                }
            }
        }

        return updates;
    }

    handleControlUpdates(data: ControlUpdateData[]) {
        // Get the initial set of updates
        let updateList = this.generateUpdateSet(data);
        let updateSet : IndexedDataSet<ControlUpdateData> = {}; // Set of updates to send, indexed by control_id

        for (let update of updateList) {
            if (updateSet[update.control_id]) {
                debug(`duplicate updates detected for control ${update.control_id}`);
                debug(`original: ${updateSet[update.control_id].name}`);
                debug(`duplicate: ${update.name}`);
            }
            else {
                updateSet[update.control_id] = update;
            }
        }

        // Detect recursive updates
        let pass = 1;
        while (updateList.length > 0) {
            pass++;
            updateList = this.generateUpdateSet(updateList, false);

            for (let update of updateList) {
                if (updateSet[update.control_id]) {
                    debug(`recursive updates detected on pass ${pass} for control ${update.control_id}`);
                    debug(`original: ${updateSet[update.control_id].name}`);
                    debug(`duplicate: ${update.name}`);
                    this.io.emit("error", { error: "recursive watcher updates encountered"});
                }
            }

        }

        let finalUpdateList = [];
        for (let id in updateSet) {
            finalUpdateList.push(updateSet[id]);
        }

        if (finalUpdateList.length > 0) {
            debug(`${finalUpdateList.length} updates generated. pushing to messanger`);
            this.io.emit('control-updates', finalUpdateList);
        }

    }

    static isString(x: any): x is string {
        return typeof x === "string";
    }

    loadWatcherRules() {
        //Rebuild watcherRules
        this.watcherRules = {};
        for (let id in this.dataModel.watcher_rules) {
            let rule = this.dataModel.watcher_rules[id];

            if (! this.watcherRules[rule.watched_control_id]) {
                this.watcherRules[rule.watched_control_id] = {};
            }

            this.watcherRules[rule.watched_control_id][id] = rule;
        }
    }
}

let watcher = Watcher.bootstrap();
module.exports = watcher;