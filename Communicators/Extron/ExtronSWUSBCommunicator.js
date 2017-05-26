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
var debugMod = require("debug");
var TCPCommunicator_1 = require("../TCPCommunicator");
var TCPCommand_1 = require("../TCPCommand");
var debug = debugMod("comms");
var ExtronSWUSBCommunicator = (function (_super) {
    __extends(ExtronSWUSBCommunicator, _super);
    function ExtronSWUSBCommunicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inputLineTerminator = '\r\n';
        _this.outputLineTerminator = '';
        return _this;
    }
    ExtronSWUSBCommunicator.prototype.buildCommandList = function () {
        var config = {
            cmdStr: "Input",
            cmdQueryStr: "I",
            cmdQueryResponseRE: /Chn(\d)/,
            cmdUpdateTemplate: "%d!",
            cmdUpdateResponseTemplate: "Chn%d",
            cmdReportRE: /Chn(\d)/,
            endpoint_id: this.config.endpoint._id,
            control_type: "string",
            usertype: "select",
            templateConfig: {
                options: {
                    1: "Input 1",
                    2: "Input 2",
                    3: "Input 3",
                    4: "Input 4"
                }
            },
            poll: 1
        };
        this.commands[config.cmdStr] = new TCPCommand_1.TCPCommand(config);
    };
    ExtronSWUSBCommunicator.prototype.preprocessLine = function (line) {
        if (line.match(/^ser2net port/)) {
            return '';
        }
        return line;
    };
    return ExtronSWUSBCommunicator;
}(TCPCommunicator_1.TCPCommunicator));
var communicator = new ExtronSWUSBCommunicator();
module.exports = communicator;
//# sourceMappingURL=ExtronSWUSBCommunicator.js.map