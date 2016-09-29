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
        this.inputLineTerminator = '\r\n';
        this.outputLineTerminator = '\r\n';
        this.socketEncoding = 'utf8';
        this.inputBuffer = '';
        this.pollTimer = 0;
        this.backoffTime = 1000;
        this.expectedResponses = [];
    }
    TCPCommunicator.prototype.buildCommandList = function () {
    };
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
            self.doDeviceLogon();
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
    TCPCommunicator.prototype.doDeviceLogon = function () {
        this.connected = true;
    };
    ;
    TCPCommunicator.prototype.getControlTemplates = function () {
        this.buildCommandList();
        for (var cmd in this.commands) {
            var templateList = this.commands[cmd].getControlTemplates();
            for (var _i = 0, templateList_1 = templateList; _i < templateList_1.length; _i++) {
                var tpl = templateList_1[_i];
                this.controls[tpl._id] = tpl;
                this.controlsByCtid[tpl.ctid] = tpl;
                this.commandsByTemplate[tpl.ctid] = this.commands[cmd];
            }
        }
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
        this.socket.write(updateStr + this.outputLineTerminator);
    };
    TCPCommunicator.prototype.matchLineToCommand = function (line) {
        for (var cmdStr in this.commands) {
            var cmd = this.commands[cmdStr];
            if (cmd.matchesDeviceString(line)) {
                debug("read: " + line + ", matches cmd " + cmd.name);
                return cmd;
            }
        }
        return false;
    };
    TCPCommunicator.prototype.matchLineToExpectedResponse = function (line) {
        for (var idx = 0; idx < this.expectedResponses.length; idx++) {
            var eresp = this.expectedResponses[idx];
            if (line.search(eresp[0]) > -1) {
                debug(line + " matched expected response \"" + eresp[0] + "\" at [" + idx + "]");
                eresp[1]();
                this.expectedResponses = this.expectedResponses.slice(idx + 1);
                return true;
            }
        }
        return false;
    };
    TCPCommunicator.prototype.onData = function (data) {
        var strData = String(data);
        this.inputBuffer += strData;
        var lines = this.inputBuffer.split(this.inputLineTerminator);
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
                    this.socket.write(queryStr + this.outputLineTerminator);
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
        //Ignore empty lines
        if (line == '')
            return;
        // Check line against expected responses
        if (this.matchLineToExpectedResponse(line)) {
            return;
        }
        ;
        // Match line to a command
        var match = this.matchLineToCommand(line);
        //TODO: match error strings
        if (match) {
            var cmd = match;
            for (var _i = 0, _a = cmd.ctidList; _i < _a.length; _i++) {
                var ctid = _a[_i];
                var control = this.controlsByCtid[ctid];
                var val = cmd.parseControlValue(control, line);
                if (control.value != val) {
                    debug("control update: " + control.name + " = " + val);
                    this.config.controlUpdateCallback(control, val);
                    control.value = val;
                }
            }
            this.connectionConfirmed();
        }
        else {
            debug("read, unmatched: " + line);
        }
    };
    TCPCommunicator.prototype.setTemplates = function (templates) {
        _super.prototype.setTemplates.call(this, templates);
    };
    return TCPCommunicator;
}(EndpointCommunicator_1.EndpointCommunicator));
exports.TCPCommunicator = TCPCommunicator;
//# sourceMappingURL=TCPCommunicator.js.map