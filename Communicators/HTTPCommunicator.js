"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Endpoint_1 = require("../shared/Endpoint");
var EndpointCommunicator_1 = require("./EndpointCommunicator");
var http = require("http");
var debug = console.log;
var HTTPCommunicator = (function (_super) {
    __extends(HTTPCommunicator, _super);
    function HTTPCommunicator() {
        _super.call(this);
        this.commands = {};
    }
    HTTPCommunicator.prototype.buildCommandList = function () { };
    HTTPCommunicator.prototype.connect = function () {
        this._connected = true;
        this.config.statusUpdateCallback(Endpoint_1.EndpointStatus.Online);
    };
    ;
    HTTPCommunicator.prototype.disconnect = function () {
        this._connected = false;
        this.config.statusUpdateCallback(Endpoint_1.EndpointStatus.Offline);
    };
    ;
    HTTPCommunicator.prototype.getControlTemplates = function () {
        this.buildCommandList();
        for (var cmd in this.commands) {
            var controls = this.commands[cmd].getControls();
            for (var _i = 0, controls_1 = controls; _i < controls_1.length; _i++) {
                var control = controls_1[_i];
                this.controlsByCtid[control.ctid] = control;
            }
        }
        return this.controlsByCtid;
    };
    /**
     * Process a ControlUpdate, likely by sending a command to
     * a device
     * @param update ControlUpdateData The request control update
     */
    HTTPCommunicator.prototype.handleControlUpdateRequest = function (update) {
        var _this = this;
        var control = this.controls[update.control_id];
        var command = this.commands[control.ctid];
        if (!command) {
            debug("No command found for control " + control.name);
            return;
        }
        var requestOptions = {
            hostname: this.config.endpoint.address,
            path: command.commandPath(update.value)
        };
        http.get("http://" + requestOptions.hostname + requestOptions.path, function (res) {
            if (res.statusCode !== 200) {
                debug("invalid status code response: " + res.statusCode);
            }
            else {
                debug("preset " + update.value + " successfully selected");
                res.setEncoding('utf8');
                var body_1 = '';
                res.on('data', function (chunk) { body_1 += chunk; });
                res.on('end', function () {
                    if (command.matchResponse(body_1)) {
                        debug(control.name + " response matched expected");
                        _this.config.controlUpdateCallback(control, update.value);
                    }
                    else {
                        debug(control.name + " update response did not match: " + body_1);
                    }
                });
            }
        });
    };
    HTTPCommunicator.prototype.setTemplates = function (controls) {
        this.controls = controls;
        for (var id in controls) {
            this.controlsByCtid[controls[id].ctid] = controls[id];
        }
    };
    return HTTPCommunicator;
}(EndpointCommunicator_1.EndpointCommunicator));
exports.HTTPCommunicator = HTTPCommunicator;
//# sourceMappingURL=HTTPCommunicator.js.map