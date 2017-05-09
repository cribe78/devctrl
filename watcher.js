"use strict";
var io = require("socket.io-client");
var DCDataModel_1 = require("./shared/DCDataModel");
var ControlUpdate_1 = require("./shared/ControlUpdate");
var ActionTrigger_1 = require("./shared/ActionTrigger");
//let debug = debugMod('watcher');
var debug = console.log;
var watchConfig = {};
var Watcher = (function () {
    function Watcher() {
        // watcherRules is the set of WatcherRules, indexed by trigger_control_id
        this.watcherRules = {};
        this.dataModel = new DCDataModel_1.DCDataModel();
        //this.dataModel.debug = debugMod("dataModel");
        this.dataModel.debug = debug;
    }
    Watcher.bootstrap = function () {
        return new Watcher();
    };
    Watcher.prototype.getData = function (reqData) {
        var _this = this;
        var self = this;
        this.io.emit('get-data', reqData, function (data) {
            if (data.error) {
                debug("get-data error: " + data.error);
            }
            else {
                self.dataModel.loadData(data);
                if (data.add && data.add[ActionTrigger_1.ActionTrigger.tableStr]) {
                    _this.loadWatcherRules();
                }
            }
        });
    };
    Watcher.prototype.run = function (config) {
        var _this = this;
        this.config = config;
        var connectOpts = {
            transports: ['websocket'],
            path: config.ioPath
        };
        connectOpts['extraHeaders'] = { 'ncontrol-auth-id': config.authId };
        this.io = io.connect(config.wsUrl, connectOpts);
        this.io.on('connect', function () {
            debug("websocket client connected");
            var reqData = { table: ActionTrigger_1.ActionTrigger.tableStr, params: {} };
            _this.getData(reqData);
        });
        this.io.on('control-data', function (data) {
            _this.dataModel.loadData(data);
            if ((data.add && data.add[ActionTrigger_1.ActionTrigger.tableStr]) ||
                data.delete && data.delete.table == ActionTrigger_1.ActionTrigger.tableStr) {
                _this.loadWatcherRules();
            }
        });
        this.io.on('control-updates', function (data) {
            debug("control updates received");
            _this.handleControlUpdates(data);
        });
        3;
    };
    Watcher.prototype.guid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    Watcher.prototype.generateUpdateSet = function (data, checkStatus) {
        if (checkStatus === void 0) { checkStatus = true; }
        var updates = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var updateData = data_1[_i];
            if (this.watcherRules[updateData.control_id]) {
                var controlRules = this.watcherRules[updateData.control_id];
                for (var ruleId in controlRules) {
                    var rule = controlRules[ruleId];
                    var update = new ControlUpdate_1.ControlUpdate(updateData._id, updateData);
                    var ruleUpdate = rule.generateControlUpdate(update, this.guid(), checkStatus);
                    if (Watcher.isString(ruleUpdate)) {
                        debug("watcherRule match fail: " + ruleUpdate);
                    }
                    else if (!rule.enabled) {
                        debug("skipping disabled rule " + rule.name);
                    }
                    else {
                        updates.push(ruleUpdate);
                    }
                }
            }
        }
        return updates;
    };
    Watcher.prototype.handleControlUpdates = function (data) {
        // Get the initial set of updates
        var updateList = this.generateUpdateSet(data);
        var updateSet = {}; // Set of updates to send, indexed by control_id
        for (var _i = 0, updateList_1 = updateList; _i < updateList_1.length; _i++) {
            var update = updateList_1[_i];
            if (updateSet[update.control_id]) {
                debug("duplicate updates detected for control " + update.control_id);
                debug("original: " + updateSet[update.control_id].name);
                debug("duplicate: " + update.name);
            }
            else {
                updateSet[update.control_id] = update;
            }
        }
        // Detect recursive updates
        var pass = 1;
        while (updateList.length > 0) {
            pass++;
            updateList = this.generateUpdateSet(updateList, false);
            for (var _a = 0, updateList_2 = updateList; _a < updateList_2.length; _a++) {
                var update = updateList_2[_a];
                if (updateSet[update.control_id]) {
                    debug("recursive updates detected on pass " + pass + " for control " + update.control_id);
                    debug("original: " + updateSet[update.control_id].name);
                    debug("duplicate: " + update.name);
                    this.io.emit("error", { error: "recursive watcher updates encountered" });
                }
            }
        }
        var finalUpdateList = [];
        for (var id in updateSet) {
            finalUpdateList.push(updateSet[id]);
        }
        if (finalUpdateList.length > 0) {
            debug(finalUpdateList.length + " updates generated. pushing to messanger");
            this.io.emit('control-updates', finalUpdateList);
        }
    };
    Watcher.isString = function (x) {
        return typeof x === "string";
    };
    Watcher.prototype.loadWatcherRules = function () {
        //Rebuild watcherRules
        this.watcherRules = {};
        for (var id in this.dataModel.watcher_rules) {
            var rule = this.dataModel.watcher_rules[id];
            if (!this.watcherRules[rule.trigger_control_id]) {
                this.watcherRules[rule.trigger_control_id] = {};
            }
            this.watcherRules[rule.trigger_control_id][id] = rule;
        }
    };
    return Watcher;
}());
var watcher = Watcher.bootstrap();
module.exports = watcher;
//# sourceMappingURL=watcher.js.map