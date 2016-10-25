"use strict";
var io = require("socket.io-client");
var DCDataModel_1 = require("./shared/DCDataModel");
var debugMod = require("debug"); // see https://www.npmjs.com/package/debug
var debug = debugMod('ncontrol');
var watchConfig = {};
var Watcher = (function () {
    function Watcher() {
        this.dataModel = new DCDataModel_1.DCDataModel();
        this.dataModel.debug = debugMod("dataModel");
    }
    Watcher.bootstrap = function () {
        return new Watcher();
    };
    Watcher.prototype.run = function (config) {
        var _this = this;
        this.config = config;
        this.io = io.connect(config.wsUrl);
        this.io.on('connect', function () {
            debug("websocket client connected");
        });
        this.io.on('control-data', function (data) {
            _this.dataModel.loadData(data);
        });
        this.io.on('control-updates', function (data) {
            _this.handleControlUpdates(data);
        });
    };
    Watcher.prototype.handleControlUpdates = function (data) {
    };
    return Watcher;
}());
//# sourceMappingURL=watcher.js.map