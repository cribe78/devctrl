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
        var _this = _super.call(this) || this;
        _this.commands = {};
        _this.commandsByControl = {};
        return _this;
    }
    HTTPCommunicator.prototype.buildCommandList = function () { };
    HTTPCommunicator.prototype.connect = function () {
        var _this = this;
        this._connected = true;
        this.config.statusUpdateCallback(Endpoint_1.EndpointStatus.Online);
        if (!this.pollTimer) {
            this.pollTimer = setInterval(function () {
                _this.poll();
            }, 10000);
        }
    };
    ;
    HTTPCommunicator.prototype.disconnect = function () {
        this._connected = false;
        this.config.statusUpdateCallback(Endpoint_1.EndpointStatus.Offline);
    };
    ;
    HTTPCommunicator.prototype.executeCommandQuery = function (cmd) {
        var _this = this;
        if (cmd.writeonly) {
            debug("not querying writeonly command " + cmd.name);
        }
        var control = this.controlsByCtid[cmd.controlData.ctid];
        var requestOptions = {
            hostname: this.config.endpoint.address,
            path: cmd.queryPath()
        };
        var requestPath = "http://" + requestOptions.hostname + requestOptions.path;
        debug("sending request:" + requestPath);
        http.get(requestPath, function (res) {
            if (res.statusCode !== 200) {
                debug("invalid status code response: " + res.statusCode);
            }
            else {
                //debug(`cmd ${cmd.name} successfully queried`);
                res.setEncoding('utf8');
                var body_1 = '';
                res.on('data', function (chunk) { body_1 += chunk; });
                res.on('end', function () {
                    var val = cmd.parseQueryResponse(body_1);
                    if (typeof val !== 'undefined') {
                        debug(cmd.name + " response parsed: " + body_1 + "," + val);
                        _this.config.controlUpdateCallback(control, val);
                    }
                    else {
                        debug(cmd.name + " update response did not match: " + body_1);
                    }
                });
            }
        })
            .on('error', function (e) {
            debug("Error on query: " + e.message);
            _this.disconnect();
        });
    };
    HTTPCommunicator.prototype.getControlTemplates = function () {
        this.buildCommandList();
        for (var cmd in this.commands) {
            var controls = this.commands[cmd].getControls();
            for (var _i = 0, controls_1 = controls; _i < controls_1.length; _i++) {
                var control = controls_1[_i];
                this.controlsByCtid[control.ctid] = control;
                this.commandsByControl[control.ctid] = this.commands[cmd];
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
        var requestPath = "http://" + requestOptions.hostname + requestOptions.path;
        debug("sending request:" + requestPath);
        http.get(requestPath, function (res) {
            if (res.statusCode !== 200) {
                debug("invalid status code response: " + res.statusCode);
            }
            else {
                //debug(`${command.name} set to ${update.value} successfully`);
                res.setEncoding('utf8');
                var body_2 = '';
                res.on('data', function (chunk) { body_2 += chunk; });
                res.on('end', function () {
                    if (command.matchResponse(body_2)) {
                        var newVal = command.parseCommandResponse(body_2, update.value);
                        debug(control.name + " response successful, value: " + newVal);
                        _this.config.controlUpdateCallback(control, newVal);
                    }
                    else {
                        debug(control.name + " update response did not match: " + body_2);
                    }
                });
            }
        }).on('error', function (e) {
            debug("Error on update request: " + e.message);
            _this.disconnect();
        });
    };
    HTTPCommunicator.prototype.poll = function () {
        if (!this.connected) {
            return;
        }
        debug("polling device");
        for (var id in this.controls) {
            var control = this.controls[id];
            if (control.poll) {
                var cmd = this.commandsByControl[control.ctid];
                if (cmd) {
                    this.executeCommandQuery(cmd);
                }
                else {
                    debug("command not found for poll control " + control.ctid);
                }
            }
        }
    };
    return HTTPCommunicator;
}(EndpointCommunicator_1.EndpointCommunicator));
exports.HTTPCommunicator = HTTPCommunicator;
//# sourceMappingURL=HTTPCommunicator.js.map