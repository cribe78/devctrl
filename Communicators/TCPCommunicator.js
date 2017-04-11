"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EndpointCommunicator_1 = require("./EndpointCommunicator");
var net = require("net");
var Endpoint_1 = require("../shared/Endpoint");
//let debug = debugMod("comms");
var debug = console.log;
var TCPCommunicator = (function (_super) {
    __extends(TCPCommunicator, _super);
    function TCPCommunicator() {
        var _this = _super.call(this) || this;
        _this.commands = {};
        _this.commandsByTemplate = {};
        _this.inputLineTerminator = '\r\n';
        _this.outputLineTerminator = '\r\n';
        _this.socketEncoding = 'utf8';
        _this.inputBuffer = '';
        _this.pollTimer = 0;
        _this.backoffTime = 1000;
        _this.expectedResponses = [];
        _this.commsMode = "string";
        return _this;
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
        this.socket.on('error', function (e) {
            debug("caught socket error: " + e.message);
            self.onEnd();
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
    TCPCommunicator.prototype.disconnect = function () {
        this.socket.end();
        this.connected = false;
        this.config.statusUpdateCallback(Endpoint_1.EndpointStatus.Offline);
    };
    TCPCommunicator.prototype.doDeviceLogon = function () {
        this.connected = true;
        this.config.statusUpdateCallback(Endpoint_1.EndpointStatus.Online);
        this.online();
    };
    ;
    TCPCommunicator.prototype.executeCommandQuery = function (cmd) {
        if (!cmd.queryString()) {
            return;
        }
        var self = this;
        var queryStr = cmd.queryString();
        debug("sending query: " + queryStr);
        this.writeToSocket(queryStr + this.outputLineTerminator);
        this.expectedResponses.push([
            cmd.queryResponseMatchString(),
            function (line) {
                for (var _i = 0, _a = cmd.ctidList; _i < _a.length; _i++) {
                    var ctid = _a[_i];
                    var control = self.controlsByCtid[ctid];
                    //debug("control id is " + control._id);
                    var val = cmd.parseQueryResponse(control, line);
                    self.setControlValue(control, val);
                }
                self.connectionConfirmed();
            }
        ]);
    };
    TCPCommunicator.prototype.getControlTemplates = function () {
        this.buildCommandList();
        for (var cmd in this.commands) {
            var templateList = this.commands[cmd].getControlTemplates();
            for (var _i = 0, templateList_1 = templateList; _i < templateList_1.length; _i++) {
                var tpl = templateList_1[_i];
                // Don't mess with this.controls.  That belongs to the data model
                //this.controls[tpl._id] = tpl;
                this.controlsByCtid[tpl.ctid] = tpl;
                this.commandsByTemplate[tpl.ctid] = this.commands[cmd];
            }
        }
        return this.controlsByCtid;
    };
    TCPCommunicator.prototype.handleControlUpdateRequest = function (request) {
        var _this = this;
        if (!this.connected) {
            return;
        }
        var control = this.controls[request.control_id];
        var command = this.commandsByTemplate[control.ctid];
        var updateStr = command.updateString(control, request);
        debug("sending update: " + updateStr);
        this.writeToSocket(updateStr + this.outputLineTerminator);
        this.expectedResponses.push([
            command.updateResponseMatchString(request),
            function (line) {
                _this.setControlValue(control, request.value);
            }
        ]);
        // Mark this control as indeterminate, in case we see a query or other update
        // regarding it but the expected response never comes
        this.indeterminateControls[request.control_id] = true;
    };
    TCPCommunicator.prototype.matchLineToCommand = function (line) {
        for (var cmdStr in this.commands) {
            var cmd = this.commands[cmdStr];
            if (cmd.matchesReport(line)) {
                debug("read: " + line + ", matches cmd " + cmd.name);
                return cmd;
            }
        }
        return false;
    };
    TCPCommunicator.prototype.matchLineToError = function (line) {
        return false;
    };
    TCPCommunicator.prototype.matchLineToExpectedResponse = function (line) {
        for (var idx = 0; idx < this.expectedResponses.length; idx++) {
            var eresp = this.expectedResponses[idx];
            if (line.search(eresp[0]) > -1) {
                debug(line + " matched expected response \"" + eresp[0] + "\" at [" + idx + "]");
                //Execute expected response callback
                eresp[1](line);
                this.expectedResponses = this.expectedResponses.slice(idx + 1);
                return true;
            }
        }
        return false;
    };
    TCPCommunicator.prototype.onData = function (data) {
        var strData = '';
        if (this.commsMode == 'string') {
            strData = String(data);
        }
        else if (this.commsMode == 'hex') {
            strData = data.toString('hex');
        }
        this.inputBuffer += strData;
        var lines = this.inputBuffer.split(this.inputLineTerminator);
        while (lines.length > 1) {
            debug("data recieved: " + lines[0]);
            this.processLine(lines[0]);
            lines.splice(0, 1);
        }
        this.inputBuffer = lines[0];
    };
    TCPCommunicator.prototype.onEnd = function () {
        var self = this;
        if (this.config.endpoint.enabled) {
            debug("device disconnected " + this.host + ", reconnect in " + this.backoffTime + "ms");
            this.connected = false;
            this.config.statusUpdateCallback(Endpoint_1.EndpointStatus.Offline);
            if (!this.socket["destroyed"]) {
                debug("destroying socket");
                this.socket.destroy();
            }
            setTimeout(function () {
                self.connect();
            }, this.backoffTime);
            if (this.backoffTime < 20000) {
                this.backoffTime = this.backoffTime * 2;
            }
        }
        else {
            debug("successfully disconnected from " + this.host);
        }
    };
    /**
     *  Functions to perform when device connection has been confirmed
     */
    TCPCommunicator.prototype.online = function () {
        this.queryAll();
    };
    TCPCommunicator.prototype.poll = function () {
        if (!this.connected) {
            return;
        }
        var exd = this.expectedResponses.length;
        if (exd > 1000) {
            debug("WARNING polling device, expected response queue has reached length of " + exd);
        }
        for (var id in this.controls) {
            var control = this.controls[id];
            if (control.poll) {
                var cmd = this.commandsByTemplate[control.ctid];
                if (cmd) {
                    this.executeCommandQuery(cmd);
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
        if (this.matchLineToError(line)) {
            return;
        }
        // Check line against expected responses
        if (this.matchLineToExpectedResponse(line)) {
            return;
        }
        // Match line to a command
        var match = this.matchLineToCommand(line);
        if (match) {
            var cmd = match;
            for (var _i = 0, _a = cmd.ctidList; _i < _a.length; _i++) {
                var ctid = _a[_i];
                var control = this.controlsByCtid[ctid];
                var val = cmd.parseReportValue(control, line);
                this.setControlValue(control, val);
            }
            this.connectionConfirmed();
        }
        else {
            debug("read, unmatched: " + line);
        }
    };
    /**
     * Query all controls, regardless of poll setting.
     *
     * Override this method to exclude polling of certain controls
     */
    TCPCommunicator.prototype.queryAll = function () {
        for (var cmdStr in this.commands) {
            if (!this.commands[cmdStr].writeonly) {
                this.executeCommandQuery(this.commands[cmdStr]);
            }
        }
    };
    TCPCommunicator.prototype.writeToSocket = function (val) {
        var bufMode = 'ascii';
        if (this.commsMode == 'hex') {
            bufMode = 'hex';
        }
        var bufferToSend = Buffer.from(val, bufMode);
        this.socket.write(bufferToSend);
    };
    return TCPCommunicator;
}(EndpointCommunicator_1.EndpointCommunicator));
exports.TCPCommunicator = TCPCommunicator;
//# sourceMappingURL=TCPCommunicator.js.map