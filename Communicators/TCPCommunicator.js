"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EndpointCommunicator_1 = require("./EndpointCommunicator");
var net = require("net");
var Endpoint_1 = require("../shared/Endpoint");
//TODO: convert expectedResponse from an array to a proper object
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
            self.log("connected to " + connectOpts.host + ":" + connectOpts.port, EndpointCommunicator_1.EndpointCommunicator.LOG_CONNECTION);
            self.doDeviceLogon();
        });
        this.socket.on('error', function (e) {
            self.log("caught socket error: " + e.message, EndpointCommunicator_1.EndpointCommunicator.LOG_CONNECTION);
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
        this.log("sending query: " + queryStr, EndpointCommunicator_1.EndpointCommunicator.LOG_POLLING);
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
        var control = this.controls[request.control_id];
        if (!this.connected) {
            return;
        }
        var command = this.commandsByTemplate[control.ctid];
        if (command) {
            var updateStr = command.updateString(control, request);
            this.log("sending update: " + updateStr, EndpointCommunicator_1.EndpointCommunicator.LOG_UPDATES);
            this.queueCommand(updateStr + this.outputLineTerminator, [
                command.updateResponseMatchString(request),
                function (line) {
                    _this.setControlValue(control, request.value);
                }
            ]);
            // Mark this control as indeterminate, in case we see a query or other update
            // regarding it but the expected response never comes
            this.indeterminateControls[request.control_id] = true;
        }
    };
    TCPCommunicator.prototype.matchLineToCommand = function (line) {
        for (var cmdStr in this.commands) {
            var cmd = this.commands[cmdStr];
            if (cmd.matchesReport(line)) {
                this.log("read: " + line + ", matches cmd " + cmd.name, EndpointCommunicator_1.EndpointCommunicator.LOG_MATCHING);
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
                this.log(line + " matched expected response \"" + eresp[0] + "\" at [" + idx + "]", EndpointCommunicator_1.EndpointCommunicator.LOG_MATCHING);
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
            this.log("data recieved: " + lines[0], EndpointCommunicator_1.EndpointCommunicator.LOG_RAW_DATA);
            this.processLine(lines[0]);
            lines.splice(0, 1);
        }
        this.inputBuffer = lines[0];
    };
    TCPCommunicator.prototype.onEnd = function () {
        var self = this;
        if (this.config.endpoint.enabled) {
            this.log("device disconnected " + this.host + ", reconnect in " + this.backoffTime + "ms", "connection");
            this.connected = false;
            this.config.statusUpdateCallback(Endpoint_1.EndpointStatus.Offline);
            if (!this.socket["destroyed"]) {
                this.log("destroying socket", EndpointCommunicator_1.EndpointCommunicator.LOG_CONNECTION);
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
            this.log("successfully disconnected from " + this.host, EndpointCommunicator_1.EndpointCommunicator.LOG_CONNECTION);
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
            this.log("WARNING polling device, expected response queue has reached length of " + exd);
        }
        for (var id in this.controls) {
            var control = this.controls[id];
            if (control.poll) {
                var cmd = this.commandsByTemplate[control.ctid];
                if (cmd) {
                    this.executeCommandQuery(cmd);
                }
                else {
                    this.log("command not found for poll control " + control.ctid);
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
            this.log("read, unmatched: " + line, EndpointCommunicator_1.EndpointCommunicator.LOG_MATCHING);
        }
    };
    /**
     * This implementation just writes the command to the socket.  Child classes
     * can do fancier things
     */
    TCPCommunicator.prototype.queueCommand = function (cmdStr, expectedResponse) {
        this.writeToSocket(cmdStr);
        if (expectedResponse[0] == '') {
            // Get on with it
            expectedResponse[1]('');
        }
        else {
            this.expectedResponses.push(expectedResponse);
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
        this.log("sending data: " + val, EndpointCommunicator_1.EndpointCommunicator.LOG_RAW_DATA);
        var bufferToSend = Buffer.from(val, bufMode);
        this.socket.write(bufferToSend);
    };
    return TCPCommunicator;
}(EndpointCommunicator_1.EndpointCommunicator));
exports.TCPCommunicator = TCPCommunicator;
//# sourceMappingURL=TCPCommunicator.js.map