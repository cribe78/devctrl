"use strict";
var io = require("socket.io-client");
var Shared_1 = require("../shared/Shared");
var EndpointCommunicator_1 = require("./EndpointCommunicator");
var debugMod = require("debug");
var Control_1 = require("../shared/Control");
var debug = debugMod('ncontrol');
var NControl = (function () {
    function NControl() {
        this.syncControlsPassNumber = 0;
        this.dataModel = new Shared_1.DCDataModel();
        this.dataModel.debug = debugMod("dataModel");
    }
    NControl.bootstrap = function () {
        return new NControl();
    };
    NControl.prototype.run = function (config) {
        var self = this;
        this.config = config;
        this.io = io.connect(config.wsUrl);
        this.io.on('connect', function () {
            debug("websocket client connected");
            //Get endpoint data
            self.getEndpointConfig();
            EndpointCommunicator_1.EndpointCommunicator.listCommunicators();
        });
        this.io.on('control-data', function (data) {
            self.dataModel.loadData(data);
        });
        this.io.on('control-updates', function (data) {
            debug("control-updates: " + data);
            self.handleControlUpdates(data);
        });
        debug("testString is " + config.testString);
    };
    NControl.prototype.getControls = function () {
        var reqData = {
            table: Control_1.Control.tableStr,
            params: {
                endpoint_id: this.endpoint._id
            }
        };
        this.getData(reqData, this.launchCommunicator);
    };
    NControl.prototype.addData = function (reqData, then) {
        var self = this;
        this.io.emit('add-data', reqData, function (data) {
            if (data.error) {
                debug("add-data error: " + data.error);
            }
            else {
                self.dataModel.loadData(data);
            }
            then.call(self); // If the callback doesn't belong to this class, this could get weird
        });
    };
    NControl.prototype.getData = function (reqData, then) {
        var self = this;
        this.io.emit('get-data', reqData, function (data) {
            if (data.error) {
                debug("get-data error: " + data.error);
            }
            else {
                self.dataModel.loadData(data);
            }
            then.call(self); // If the callback doesn't belong to this class, this could get weird
        });
    };
    NControl.prototype.updateData = function (reqData, then) {
        var self = this;
        this.io.emit('update-data', reqData, function (data) {
            if (data.error) {
                debug("update-data error: " + data.error);
            }
            else {
                self.dataModel.loadData(data);
            }
            then.call(self); // If the callback doesn't belong to this class, this could get weird
        });
    };
    NControl.prototype.getEndpointConfig = function () {
        var self = this;
        self.endpoint = self.dataModel.getItem(self.config.endpointId, Shared_1.Endpoint.tableStr);
        var reqData = self.endpoint.itemRequestData();
        self.getData(reqData, self.getEndpointTypeConfig);
    };
    NControl.prototype.getEndpointTypeConfig = function () {
        if (!this.endpoint.dataLoaded) {
            debug("endpoint data is missing");
            return;
        }
        this.getData(this.endpoint.type.itemRequestData(), this.getControls);
    };
    NControl.prototype.guid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    NControl.prototype.handleControlUpdates = function (data) {
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var update = data_1[_i];
            if (this.dataModel.controls[update.control_id]) {
                var control = this.dataModel.controls[update.control_id];
                if (control.endpoint_id && control.endpoint_id == this.endpoint._id) {
                    this.communicator.handleControlUpdateRequest(update);
                }
            }
        }
    };
    NControl.prototype.launchCommunicator = function () {
        var self = this;
        if (!this.endpoint.type.dataLoaded) {
            debug("endpointType data is missing");
        }
        var commClass = this.endpoint.type.communicatorClass;
        var requirePath = "./Communicators/" + commClass;
        this.communicator = require(requirePath);
        this.communicator.setConfig({
            endpoint: this.endpoint,
            controlUpdateCallback: function (control, value) {
                self.pushControlUpdate(control, value);
            }
        });
        this.syncControls();
        this.communicator.connect();
    };
    NControl.prototype.pushControlUpdate = function (control, value) {
        var update = {
            _id: this.guid(),
            control_id: control._id,
            value: value,
            type: "device",
            status: "observed",
            source: this.endpoint._id
        };
        this.io.emit('control-updates', [update]);
    };
    NControl.prototype.syncControls = function () {
        this.syncControlsPassNumber++;
        if (this.syncControlsPassNumber > 2) {
            throw new Error("failed to sync control templates");
        }
        // Get ControlTemplates from communicator
        var controlTemplates = this.communicator.getControlTemplates();
        var newControls = [];
        var ctByCtid = {};
        for (var id in this.dataModel.controls) {
            var ct = this.dataModel.controls[id];
            ctByCtid[ct.ctid] = ct;
        }
        // Match communicator control templates to server control templates by ctid
        for (var ctid in controlTemplates) {
            if (!ctByCtid[ctid]) {
                newControls.push(controlTemplates[ctid].getDataObject());
            }
        }
        // newControls is an array of templates to create
        // Create new ControlTemplates on server
        if (newControls.length > 0) {
            debug("adding new controls");
            this.addData({ controls: newControls }, this.syncControls);
            return;
        }
        debug("controls successfully synced!");
        // Pass completed ControlTemplate set to communicator
        this.communicator.setTemplates(this.dataModel.controls);
    };
    return NControl;
}());
var ncontrol = NControl.bootstrap();
module.exports = ncontrol;
//# sourceMappingURL=ncontrol.js.map