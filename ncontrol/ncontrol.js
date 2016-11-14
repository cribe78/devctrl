"use strict";
var io = require("socket.io-client");
var DCDataModel_1 = require("./shared/DCDataModel");
var debugMod = require("debug"); // see https://www.npmjs.com/package/debug
var Control_1 = require("./shared/Control");
var Endpoint_1 = require("./shared/Endpoint");
var debug = debugMod('ncontrol');
var NControl = (function () {
    function NControl() {
        this.syncControlsPassNumber = 0;
        this.dataModel = new DCDataModel_1.DCDataModel();
        this.dataModel.debug = debugMod("dataModel");
    }
    NControl.bootstrap = function () {
        return new NControl();
    };
    NControl.prototype.run = function (config) {
        var _this = this;
        var self = this;
        this.config = config;
        debug("connecting to " + config.wsUrl + config.ioPath);
        var connectOpts = {
            transports: ['websocket'],
            path: config.ioPath
        };
        connectOpts['extraHeaders'] = { 'ncontrol-auth-id': config.authId };
        this.io = io.connect(config.wsUrl, connectOpts);
        this.io.on('connect', function () {
            debug("websocket client connected");
            //Get endpoint data
            self.getEndpointConfig();
            self.registerEndpoint();
        });
        this.io.on('connect_error', function (err) {
            debug("io connection error: " + err);
        });
        this.io.on('reconnect', function () {
            _this.registerEndpoint();
            if (_this.endpoint) {
                _this.pushEndpointStatusUpdate(_this.endpoint.status);
            }
        });
        this.io.on('error', function (obj) {
            debug("websocket connection error: " + obj);
        });
        this.io.on('control-data', function (data) {
            self.oldEndpoint = new Endpoint_1.Endpoint(self.endpoint._id, self.endpoint.getDataObject());
            self.dataModel.loadData(data);
            self.checkData();
        });
        this.io.on('control-updates', function (data) {
            self.handleControlUpdates(data);
        });
        debug("testString is " + config.testString);
    };
    NControl.prototype.checkData = function () {
        // Check endpoint for configuration changes
        if (this.oldEndpoint.enabled != this.endpoint.enabled) {
            if (this.endpoint.enabled) {
                debug("Endpoint enabled. Connecting");
                this.communicator.connect();
            }
            else {
                debug("Endpoint disabled.  Disconnecting");
                this.communicator.disconnect();
            }
        }
        else if (this.oldEndpoint.ip != this.endpoint.ip ||
            this.oldEndpoint.port != this.endpoint.port) {
            debug("ip/port change. resetting communicator");
            this.communicator.disconnect();
            this.communicator.connect();
        }
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
        self.endpoint = self.dataModel.getItem(self.config.endpointId, Endpoint_1.Endpoint.tableStr);
        var reqData = self.endpoint.itemRequestData();
        self.getData(reqData, self.getEndpointTypeConfig);
    };
    NControl.prototype.getEndpointTypeConfig = function () {
        if (!this.endpoint.dataLoaded) {
            debug("endpoint data is missing");
            return;
        }
        this.registerEndpoint();
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
                if (control.endpoint_id && control.endpoint_id == this.endpoint._id
                    && update.status == "requested") {
                    debug("control update: " + control.name + " : " + update.value);
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
        if (!this.communicator) {
            var commClass = this.endpoint.type.communicatorClass;
            var requirePath = "./Communicators/" + commClass;
            debug("instantiating communicator " + requirePath);
            this.communicator = require(requirePath);
            if (typeof this.communicator.setConfig !== 'function') {
                debug("it doesn't look like you have your communicator class exported properly");
            }
            this.communicator.setConfig({
                endpoint: this.endpoint,
                controlUpdateCallback: function (control, value) {
                    self.pushControlUpdate(control, value);
                },
                statusUpdateCallback: function (status) {
                    self.pushEndpointStatusUpdate(status);
                }
            });
        }
        this.syncControls();
        if (this.endpoint.enabled) {
            if (!this.communicator.connected) {
                this.communicator.connect();
            }
            else {
                debug("communicator already connected");
            }
        }
        else {
            debug("endpoint not enabled, not connecting");
        }
    };
    NControl.prototype.pushControlUpdate = function (control, value) {
        var update = {
            _id: this.guid(),
            name: control.name + " update",
            control_id: control._id,
            value: value,
            type: "device",
            status: "observed",
            source: this.endpoint._id,
            ephemeral: control.ephemeral
        };
        this.io.emit('control-updates', [update]);
    };
    NControl.prototype.pushEndpointStatusUpdate = function (status) {
        this.endpoint.status = status;
        var update = {
            table: Endpoint_1.Endpoint.tableStr,
            _id: this.endpoint._id,
            "set": { status: status }
        };
        this.updateData(update, function () { });
    };
    NControl.prototype.registerEndpoint = function () {
        this.io.emit('register-endpoint', { endpoint_id: this.config.endpointId });
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