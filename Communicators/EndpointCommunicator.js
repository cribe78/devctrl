"use strict";
var debug = console.log;
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
    EndpointCommunicator.prototype.setControlValue = function (control, val) {
        var valDiff = control.value != val;
        if (typeof val == 'object') {
            // Don't send update if nothing will change
            valDiff = JSON.stringify(control.value) != JSON.stringify(val);
        }
        if (valDiff || this.indeterminateControls[control._id]) {
            this.indeterminateControls[control._id] = false;
            debug("control update: " + control.name + " = " + val);
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
                debug("setTemplates: No control located for ctid " + ctid);
            }
            else {
                // Set value of remote control to match local
                this.setControlValue(controls[id], localControl.value);
            }
        }
    };
    return EndpointCommunicator;
}());
exports.EndpointCommunicator = EndpointCommunicator;
//# sourceMappingURL=EndpointCommunicator.js.map