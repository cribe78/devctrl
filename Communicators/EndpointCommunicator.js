"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Control_1 = require("../shared/Control");
var EndpointCommunicator = (function () {
    function EndpointCommunicator() {
        this.controlsByCtid = {};
        this.controls = {};
        this.indeterminateControls = {};
        this._connected = false;
    }
    Object.defineProperty(EndpointCommunicator.prototype, "endpoint_id", {
        get: function () {
            return this.config.endpoint._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EndpointCommunicator.prototype, "connected", {
        get: function () {
            return this._connected;
        },
        set: function (val) {
            this._connected = val;
        },
        enumerable: true,
        configurable: true
    });
    EndpointCommunicator.prototype.connect = function () {
        this._connected = true;
    };
    ;
    EndpointCommunicator.prototype.disconnect = function () {
        this._connected = false;
    };
    ;
    /**
     * A function to log messages.  Determine which messages to log by setting the commLogOptions value on a
     * per-device basis through the application UI.  commLogOptions should be a comma separated list of tags.
     * Tags used by base classes are: polling, updates, matching, rawData, connection, updates
     *
     * @param msg  message to be logged
     * @param tag  message tag, message will only be logged if tag is matched in commLogOptions
     */
    EndpointCommunicator.prototype.log = function (msg, tag) {
        if (tag === void 0) { tag = "default"; }
        var opts = this.config.endpoint.commLogOptionsObj;
        if (opts[tag]) {
            console.log(msg);
        }
        else if (opts["all"]) {
            console.log(msg);
        }
    };
    EndpointCommunicator.prototype.setConfig = function (config) {
        this.config = config;
    };
    EndpointCommunicator.prototype.getControlTemplates = function () {
        return {};
    };
    /**
     * Process a ControlUpdate, likely by sending a command to
     * a device
     * @param request
     */
    EndpointCommunicator.prototype.handleControlUpdateRequest = function (request) {
        throw new Error("handleControlUpdateRequest must be implemented by Communicator");
    };
    EndpointCommunicator.prototype.registerControl = function (control) {
        if (this.controlsByCtid[control.ctid]) {
            throw new Error("duplicate ctid " + control.ctid + " registered");
        }
        this.controlsByCtid[control.ctid] = control;
    };
    EndpointCommunicator.prototype.registerHyperlinkControl = function (config, name, cmd) {
        if (name === void 0) { name = "Device Web Interface"; }
        if (cmd === void 0) { cmd = "hyperlink"; }
        var ctid = this.endpoint_id + "-" + cmd;
        if (this.controlsByCtid[ctid]) {
            throw new Error("duplicate ctid " + ctid + " registered");
        }
        this.controlsByCtid[ctid] = new Control_1.Control(ctid, {
            _id: ctid,
            ctid: ctid,
            endpoint_id: this.endpoint_id,
            usertype: Control_1.Control.USERTYPE_HYPERLINK,
            name: name,
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            poll: 0,
            config: config,
            value: ""
        });
    };
    EndpointCommunicator.prototype.setControlValue = function (control, val) {
        var valDiff = control.value != val;
        if (typeof val == 'object') {
            // Don't send update if nothing will change
            valDiff = JSON.stringify(control.value) != JSON.stringify(val);
        }
        if (valDiff || this.indeterminateControls[control._id]) {
            this.indeterminateControls[control._id] = false;
            this.log("control update: " + control.name + " = " + val, "updates");
            this.config.controlUpdateCallback(control, val);
            control.value = val;
        }
    };
    EndpointCommunicator.prototype.setTemplates = function (controls) {
        this.controls = controls;
        for (var id in controls) {
            var ctid = controls[id].ctid;
            var localControl = this.controlsByCtid[ctid];
            this.controlsByCtid[ctid] = controls[id];
            if (!localControl) {
                this.log("setTemplates: No control located for ctid " + ctid);
            }
            else {
                // Set value of remote control to match local
                this.setControlValue(controls[id], localControl.value);
            }
        }
    };
    return EndpointCommunicator;
}());
EndpointCommunicator.LOG_POLLING = "polling";
EndpointCommunicator.LOG_MATCHING = "matching";
EndpointCommunicator.LOG_RAW_DATA = "rawData";
EndpointCommunicator.LOG_CONNECTION = "connection";
EndpointCommunicator.LOG_UPDATES = "updates";
exports.EndpointCommunicator = EndpointCommunicator;
//# sourceMappingURL=EndpointCommunicator.js.map