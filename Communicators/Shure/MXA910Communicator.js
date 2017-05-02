"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TCPCommunicator_1 = require("../TCPCommunicator");
var MXA910Command_1 = require("./MXA910Command");
var Control_1 = require("../../shared/Control");
var debug = console.log;
var MXA910Communicator = (function (_super) {
    __extends(MXA910Communicator, _super);
    function MXA910Communicator() {
        var _this = _super.apply(this, arguments) || this;
        _this.inputLineTerminator = '>';
        return _this;
    }
    MXA910Communicator.prototype.buildCommandList = function () {
        this.registerSwitchCommand("Mute All", "DEVICE_AUDIO_MUTE");
        this.registerSwitchReadonlyCommand("Mute LED", "DEV_MUTE_STATUS_LED_STATE");
    };
    MXA910Communicator.prototype.matchLineToError = function (line) {
        if (line == "< REP ERR ") {
            console.log("ERROR REPORTED");
            return true;
        }
        return false;
    };
    MXA910Communicator.prototype.registerSwitchCommand = function (name, cmd) {
        this.commands[name] = new MXA910Command_1.MXA910Command({
            cmdStr: name,
            cmdQueryStr: "< GET " + cmd + " >",
            cmdQueryResponseRE: "< REP " + cmd + " (\\w+)",
            cmdUpdateTemplate: "< SET " + cmd + " %s >",
            cmdUpdateResponseTemplate: "< REP " + cmd + " %s ",
            cmdReportRE: "< REP " + cmd + " (\\w+) ",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_BOOLEAN,
            usertype: Control_1.Control.USERTYPE_SWITCH,
            templateConfig: {},
            poll: 0
        });
    };
    MXA910Communicator.prototype.registerSwitchReadonlyCommand = function (name, cmd) {
        this.commands[name] = new MXA910Command_1.MXA910Command({
            cmdStr: name,
            cmdQueryStr: "< GET " + cmd + " >",
            cmdQueryResponseRE: "< REP " + cmd + " (\\w+)",
            cmdUpdateTemplate: "< SET " + cmd + " %s >",
            cmdUpdateResponseTemplate: "< REP " + cmd + " %s ",
            cmdReportRE: "< REP " + cmd + " (\\w+) ",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_BOOLEAN,
            usertype: Control_1.Control.USERTYPE_SWITCH_READONLY,
            templateConfig: {},
            readonly: true,
            poll: 0
        });
    };
    return MXA910Communicator;
}(TCPCommunicator_1.TCPCommunicator));
var communicator = new MXA910Communicator();
module.exports = communicator;
//# sourceMappingURL=MXA910Communicator.js.map