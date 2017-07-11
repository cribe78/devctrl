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
var TCPCommunicator_1 = require("./TCPCommunicator");
var EndpointCommunicator_1 = require("./EndpointCommunicator");
var SynchronousTCPCommunicator = (function (_super) {
    __extends(SynchronousTCPCommunicator, _super);
    function SynchronousTCPCommunicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
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
        this.log("queueing query: " + queryStr, EndpointCommunicator_1.EndpointCommunicator.LOG_POLLING);
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
    SynchronousTCPCommunicator.prototype.onData = function (data) {
        var strData = '';
        if (this.commsMode == 'string') {
            strData = String(data);
        }
        else if (this.commsMode == 'hex') {
            strData = data.toString('hex');
        }
        this.log("data recieved: " + strData, EndpointCommunicator_1.EndpointCommunicator.LOG_RAW_DATA);
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
        var _this = this;
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
        this.log("sending command: " + logCommand, EndpointCommunicator_1.EndpointCommunicator.LOG_RAW_DATA);
        this.writeToSocket(command);
        if (expectedResponse[0] == '') {
            expectedResponse[1]('');
        }
        else {
            this.commandTimeoutTimer = setTimeout(function () {
                _this.runNextCommand();
            }, 400);
        }
    };
    return SynchronousTCPCommunicator;
}(TCPCommunicator_1.TCPCommunicator));
exports.SynchronousTCPCommunicator = SynchronousTCPCommunicator;
//# sourceMappingURL=SynchronousTCPCommunicator.js.map