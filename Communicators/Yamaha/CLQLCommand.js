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
var TCPCommand_1 = require("../TCPCommand");
var Control_1 = require("../../shared/Control");
var sprintf_js_1 = require("sprintf-js");
/**
 * Implemented with the help of ParamChangeList_V200_CL_V100_QL.xls, provided by Yamaha support
 */
var CLQLCommand = (function (_super) {
    __extends(CLQLCommand, _super);
    function CLQLCommand(config) {
        var _this = _super.call(this, config) || this;
        _this.prmChgRequest = config.prmChgRequest ? config.prmChgRequest : "0";
        _this.deviceType = config.deviceType ? config.deviceType : "3e"; // "Digital Mixer"
        _this.deviceModel = config.deviceModel ? config.deviceModel : "19"; // "CL5/CL3/CL1"
        _this.commandGroup = config.commandGroup ? config.commandGroup : CLQLCommand.CGROUP_SETUP;
        _this.command = typeof config.command == 'undefined' ? "" : config.command;
        _this.subCommand = typeof config.subCommand == 'undefined' ? "" : config.subCommand;
        _this.channel = typeof config.channel == 'undefined' ? "" : config.channel;
        return _this;
    }
    CLQLCommand.fromCLHexString = function (str) {
        if (str.length != 10) {
            throw Error("sorry, we're looking for a string of length 10");
        }
        return parseInt(str.slice(-6, -4), 16) * 128 * 128 +
            parseInt(str.slice(-4, -2), 16) * 128 +
            parseInt(str.slice(-2), 16);
    };
    CLQLCommand.prototype.parseValue = function (value) {
        if (this.control_type == Control_1.Control.CONTROL_TYPE_RANGE
            || this.control_type == Control_1.Control.CONTROL_TYPE_INT) {
            return CLQLCommand.fromCLHexString(value);
        }
        else if (this.control_type == Control_1.Control.CONTROL_TYPE_BOOLEAN) {
            return this.parseBoolean(value);
        }
        return value;
    };
    CLQLCommand.prototype.queryResponseMatchString = function () {
        var header = "f0431"
            + this.prmChgRequest
            + this.deviceType
            + this.deviceModel
            + this.commandGroup
            + this.command;
        if (this.commandGroup == CLQLCommand.CGROUP_SETUP) {
            return header + this.subCommand + this.channel + "(.*)";
        }
        return header;
    };
    CLQLCommand.prototype.queryString = function () {
        if (this.cmdQueryStr) {
            return this.cmdQueryStr;
        }
        var header = "f0433"
            + this.prmChgRequest
            + this.deviceType
            + this.deviceModel
            + this.commandGroup
            + this.command;
        if (this.commandGroup == CLQLCommand.CGROUP_SETUP) {
            return header + this.subCommand + this.channel;
        }
        return header;
    };
    /**
     * This protocol uses a non standard hex representation
     * @param num a number to convert to hex representation
     */
    CLQLCommand.toCLhexString = function (num) {
        if (num < 0) {
            throw new RangeError("GTFO, I have no idea what to do with negative numbers");
        }
        // Each byte in this format represents a 7 bit number.
        // FOr example:
        // 127 = 00 7f
        // 128 = 01 00
        var byte3 = Math.floor(num / (128 * 128));
        var remainder = num - byte3 * 128 * 128;
        var byte2 = Math.floor(remainder / 128);
        var byte1 = remainder - byte2 * 128;
        return sprintf_js_1.sprintf("0000%02x%02x%02x", byte3, byte2, byte1);
    };
    CLQLCommand.prototype.updateResponseMatchString = function (update) {
        // This protocol doesn't confirm updates
        return '';
    };
    CLQLCommand.prototype.updateString = function (control, update) {
        var header = "f0431"
            + this.prmChgRequest
            + this.deviceType
            + this.deviceModel
            + this.commandGroup
            + this.command;
        var value = update.value;
        if (this.control_type == Control_1.Control.CONTROL_TYPE_BOOLEAN) {
            value = value ? 1 : 0;
        }
        if (this.commandGroup == CLQLCommand.CGROUP_SETUP) {
            var strVal = CLQLCommand.toCLhexString(value);
            return header + this.subCommand + this.channel + strVal;
        }
        return '';
    };
    return CLQLCommand;
}(TCPCommand_1.TCPCommand));
CLQLCommand.CGROUP_SETUP = "01"; // Scene/Setup
CLQLCommand.CGROUP_METER = "21"; // Level Meter
CLQLCommand.CGROUP_ACK = "32";
exports.CLQLCommand = CLQLCommand;
//# sourceMappingURL=CLQLCommand.js.map