"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EndpointCommunicator_1 = require("../EndpointCommunicator");
var net = require("net");
var debugMod = require("debug");
var debug = debugMod("comms");
var TCPCommunicator = (function (_super) {
    __extends(TCPCommunicator, _super);
    function TCPCommunicator() {
        _super.call(this);
        this.connected = false;
        this.commands = {};
        this.commandsByTemplate = {};
        this.lineTerminator = '\r\n';
        this.socketEncoding = 'utf8';
        this.inputBuffer = '';
        this.pollTimer = 0;
        this.backoffTime = 1000;
    }
    TCPCommunicator.prototype.connect = function () {
        var self = this;
        this.host = this.config.endpoint.ip;
        this.port = this.config.endpoint.port;
        var connectOpts = {
            port: this.config.endpoint.port,
            host: this.config.endpoint.ip
        };
        this.socket = net.connect(connectOpts, function () {
            debug("connected to " + connectOpts.host + ":" + connectOpts.port);
            self.connected = true;
        });
        this.socket.on('data', function (data) {
            self.onData(data);
        });
        this.socket.on('end', function () {
            self.onEnd();
        });
        if (!this.pollTimer) {
            this.pollTimer = setInterval(function () {
                self.poll();
            }, 10000);
        }
    };
    TCPCommunicator.prototype.connectionConfirmed = function () {
        this.backoffTime = 1000;
    };
    TCPCommunicator.prototype.getControlTemplates = function () {
        return this.controlsByCtid;
    };
    TCPCommunicator.prototype.handleControlUpdateRequest = function (request) {
        if (!this.connected) {
            return;
        }
        var control = this.controls[request.control_id];
        var command = this.commandsByTemplate[control.ctid];
        var updateStr = command.deviceUpdateString(control, request);
        debug("sending update: " + updateStr);
        this.socket.write(updateStr + this.lineTerminator);
    };
    TCPCommunicator.prototype.onData = function (data) {
        var strData = String(data);
        this.inputBuffer += strData;
        var lines = this.inputBuffer.split(this.lineTerminator);
        while (lines.length > 1) {
            //debug("data recieved: " + lines[0]);
            this.processLine(lines[0]);
            lines.splice(0, 1);
        }
        this.inputBuffer = lines[0];
    };
    TCPCommunicator.prototype.onEnd = function () {
        var self = this;
        debug("device disconnected " + this.host + ", reconnect in " + this.backoffTime + "ms");
        this.connected = false;
        setTimeout(function () {
            self.connect();
        }, this.backoffTime);
        if (this.backoffTime < 20000) {
            this.backoffTime = this.backoffTime * 2;
        }
    };
    TCPCommunicator.prototype.poll = function () {
        if (!this.connected) {
            return;
        }
        debug("polling device");
        for (var id in this.controls) {
            var control = this.controls[id];
            if (control.poll) {
                var cmd = this.commandsByTemplate[control.ctid];
                if (cmd) {
                    var queryStr = cmd.deviceQueryString();
                    debug("sending query: " + queryStr);
                    this.socket.write(queryStr + this.lineTerminator);
                }
                else {
                    debug("command not found for poll control " + control.ctid);
                }
            }
        }
    };
    TCPCommunicator.prototype.preprocessLine = function (line) {
        return line;
    };
    TCPCommunicator.prototype.processLine = function (line) {
        line = this.preprocessLine(line);
        // Match line to a command
        var matched = false;
        for (var cmdStr in this.commands) {
            var cmd = this.commands[cmdStr];
            if (cmd.matchesDeviceString(line)) {
                matched = true;
                debug("read: " + line + ", matches cmd " + cmd.name);
                for (var _i = 0, _a = cmd.ctidList; _i < _a.length; _i++) {
                    var ctid = _a[_i];
                    var control = this.controlsByCtid[ctid];
                    var val = cmd.parseControlValue(control, line);
                    if (control.value != val) {
                        this.config.controlUpdateCallback(control, val);
                        control.value = val;
                    }
                }
                break;
            }
        }
        if (!matched) {
            debug("read, unmatched: " + line);
        }
        else {
            this.connectionConfirmed();
        }
    };
    TCPCommunicator.prototype.setTemplates = function (templates) {
        _super.prototype.setTemplates.call(this, templates);
    };
    return TCPCommunicator;
}(EndpointCommunicator_1.EndpointCommunicator));
exports.TCPCommunicator = TCPCommunicator;
//# sourceMappingURL=TCPCommunicator.js.map