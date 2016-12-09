"use strict";
class EndpointCommunicator {
    constructor() {
        this.controlsByCtid = {};
        this.controls = {};
        this._connected = false;
    }
    get endpoint_id() {
        return this.config.endpoint._id;
    }
    get connected() {
        return this._connected;
    }
    set connected(val) {
        this._connected = val;
    }
    connect() {
        this._connected = true;
    }
    ;
    disconnect() {
        this._connected = false;
    }
    ;
    setConfig(config) {
        this.config = config;
    }
    getControlTemplates() {
        return {};
    }
    /**
     * Process a ControlUpdate, likely by sending a command to
     * a device
     * @param request
     */
    handleControlUpdateRequest(request) {
    }
    setTemplates(controls) {
        this.controls = controls;
        for (let id in controls) {
            this.controlsByCtid[controls[id].ctid] = controls[id];
        }
    }
}
exports.EndpointCommunicator = EndpointCommunicator;
//# sourceMappingURL=EndpointCommunicator.js.map