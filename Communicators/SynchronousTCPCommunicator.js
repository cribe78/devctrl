"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TCPCommunicator_1 = require("./TCPCommunicator");
var debug = console.log;
var SynchronousTCPCommunicator = (function (_super) {
    __extends(SynchronousTCPCommunicator, _super);
    function SynchronousTCPCommunicator() {
        var _this = _super.apply(this, arguments) || this;
        _this.commandQueue = [];
        _this.expectedResponsesQueue = [];
        _this.commandQueueRunning = false;
        _this.commandTimeoutTimer = 0;
        return _this;
    }
    SynchronousTCPCommunicator.prototype.executeCommandQuery = function (cmd) {
        if (!cmd.queryString()) {
            return;
        }
        var self = this;
        var queryStr = cmd.queryString();
        debug("queueing query: " + queryStr);
        this.queueCommand(queryStr + this.outputLineTerminator, [
            cmd.queryResponseMatchString(),
            function (line) {
                for (var _i = 0, _a = cmd.ctidList; _i < _a.length; _i++) {
                    var ctid = _a[_i];
                    var control = self.controlsByCtid[ctid];
                    var val = cmd.parseQueryResponse(control, line);
                    self.setControlValue(control, val);
                }
                self.connectionConfirmed();
            }
        ]);
    };
    SynchronousTCPCommunicator.prototype.handleControlUpdateRequest = function (request) {
        var _this = this;
        if (!this.connected) {
            return;
        }
        var control = this.controls[request.control_id];
        var command = this.commandsByTemplate[control.ctid];
        var updateStr = command.updateString(control, request);
        debug("sending update: " + updateStr);
        this.queueCommand(updateStr + this.outputLineTerminator, [
            command.updateResponseMatchString(request),
            function (line) {
                _this.setControlValue(control, request.value);
            }
        ]);
        // Mark this control as indeterminate, in case we see a query or other update
        // regarding it but the expected response never comes
        this.indeterminateControls[request.control_id] = true;
    };
    SynchronousTCPCommunicator.prototype.onData = function (data) {
        var strData = '';
        if (this.commsMode == 'string') {
            strData = String(data);
        }
        else if (this.commsMode == 'hex') {
            strData = data.toString('hex');
        }
        debug("data recieved: " + strData);
        this.inputBuffer += strData;
        var lines = this.inputBuffer.split(this.inputLineTerminator);
        while (lines.length > 1) {
            this.processLine(lines[0]);
            lines.splice(0, 1);
            this.runNextCommand();
        }
        this.inputBuffer = lines[0];
    };
    SynchronousTCPCommunicator.prototype.queueCommand = function (cmdStr, expectedResponse) {
        this.commandQueue.push(cmdStr);
        this.expectedResponsesQueue.push(expectedResponse);
        if (!this.commandQueueRunning) {
            this.runCommandQueue();
        }
    };
    SynchronousTCPCommunicator.prototype.runCommandQueue = function () {
        if (this.commandQueueRunning) {
            return;
        }
        this.commandQueueRunning = true;
        this.runNextCommand();
    };
    SynchronousTCPCommunicator.prototype.runNextCommand = function () {
        // If we are out of commands, reset the queues and stop
        if (this.commandTimeoutTimer) {
            clearTimeout(this.commandTimeoutTimer);
        }
        this.commandTimeoutTimer = 0;
        if (this.commandQueue.length == 0 || this.expectedResponsesQueue.length == 0) {
            this.commandQueueRunning = false;
            this.commandQueue = [];
            this.expectedResponsesQueue = [];
            return;
        }
        var command = this.commandQueue[0];
        var expectedResponse = this.expectedResponsesQueue[0];
        this.commandQueue.splice(0, 1);
        this.expectedResponsesQueue.splice(0, 1);
        this.expectedResponses = [expectedResponse];
        var logCommand = command.replace(/\r?\n|\r/g, '');
        debug("sending command: " + logCommand);
        this.writeToSocket(command);
        this.commandTimeoutTimer = setTimeout(this.runNextCommand, 400);
    };
    return SynchronousTCPCommunicator;
}(TCPCommunicator_1.TCPCommunicator));
exports.SynchronousTCPCommunicator = SynchronousTCPCommunicator;
//# sourceMappingURL=SynchronousTCPCommunicator.js.map