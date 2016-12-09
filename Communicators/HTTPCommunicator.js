"use strict";
const Endpoint_1 = require("../shared/Endpoint");
const EndpointCommunicator_1 = require("./EndpointCommunicator");
const http = require("http");
let debug = console.log;
class HTTPCommunicator extends EndpointCommunicator_1.EndpointCommunicator {
    constructor() {
        super();
        this.commands = {};
    }
    buildCommandList() { }
    connect() {
        this._connected = true;
        this.config.statusUpdateCallback(Endpoint_1.EndpointStatus.Online);
    }
    ;
    disconnect() {
        this._connected = false;
        this.config.statusUpdateCallback(Endpoint_1.EndpointStatus.Offline);
    }
    ;
    getControlTemplates() {
        this.buildCommandList();
        for (let cmd in this.commands) {
            let controls = this.commands[cmd].getControls();
            for (let control of controls) {
                this.controlsByCtid[control.ctid] = control;
            }
        }
        return this.controlsByCtid;
    }
    /**
     * Process a ControlUpdate, likely by sending a command to
     * a device
     * @param update ControlUpdateData The request control update
     */
    handleControlUpdateRequest(update) {
        let control = this.controls[update.control_id];
        let command = this.commands[control.ctid];
        if (!command) {
            debug(`No command found for control ${control.name}`);
            return;
        }
        let requestOptions = {
            hostname: this.config.endpoint.address,
            path: command.commandPath(update.value)
        };
        http.get("http://" + requestOptions.hostname + requestOptions.path, (res) => {
            if (res.statusCode !== 200) {
                debug("invalid status code response: " + res.statusCode);
            }
            else {
                debug(`preset ${update.value} successfully selected`);
                res.setEncoding('utf8');
                let body = '';
                res.on('data', (chunk) => { body += chunk; });
                res.on('end', () => {
                    if (command.matchResponse(body)) {
                        debug(`${control.name} response matched expected`);
                        this.config.controlUpdateCallback(control, update.value);
                    }
                    else {
                        debug(`${control.name} update response did not match: ${body}`);
                    }
                });
            }
        });
    }
    setTemplates(controls) {
        this.controls = controls;
        for (let id in controls) {
            this.controlsByCtid[controls[id].ctid] = controls[id];
        }
    }
}
exports.HTTPCommunicator = HTTPCommunicator;
//# sourceMappingURL=HTTPCommunicator.js.map