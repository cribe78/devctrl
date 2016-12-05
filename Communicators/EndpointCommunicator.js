"use strict";
var EndpointCommunicator = (function () {
    function EndpointCommunicator() {
        this.controlsByCtid = {};
        this.controls = {};
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
    };
    EndpointCommunicator.prototype.setTemplates = function (controls) {
        this.controls = controls;
        for (var id in controls) {
            this.controlsByCtid[controls[id].ctid] = controls[id];
        }
    };
    return EndpointCommunicator;
}());
exports.EndpointCommunicator = EndpointCommunicator;
//# sourceMappingURL=EndpointCommunicator.js.map