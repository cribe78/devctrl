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
var ClearOneCommand = (function (_super) {
    __extends(ClearOneCommand, _super);
    function ClearOneCommand(config) {
        var _this = _super.call(this, config) || this;
        _this.channelName = '';
        _this.updateTerminator = '';
        if (config.channel) {
            _this.channel = config.channel;
            _this.cmdStr = config.cmdStr + " " + config.channel;
            _this.channelName = config.channelName;
            _this.name = config.cmdStr + " " + config.channelName;
        }
        if (config.updateTerminator) {
            _this.updateTerminator = config.updateTerminator;
        }
        _this.device = config.device;
        return _this;
    }
    ClearOneCommand.prototype.matchesReport = function (devStr) {
        var matchStr = this.queryString();
        var matchLen = matchStr.length;
        return devStr.substring(0, matchLen) == matchStr;
    };
    ClearOneCommand.prototype.queryString = function () {
        return this.device + " " + this.cmdStr;
    };
    ClearOneCommand.prototype.queryResponseMatchString = function () {
        return this.queryString() + '.*';
    };
    ClearOneCommand.prototype.updateString = function (control, update) {
        return this.updateResponseMatchString(update);
    };
    ClearOneCommand.prototype.updateResponseMatchString = function (update) {
        var value = update.value;
        if (this.control_type == Control_1.Control.CONTROL_TYPE_BOOLEAN) {
            // Use "1" and "0" instead of "true" and "false"
            value = value ? 1 : 0;
        }
        return this.device + " " + this.cmdStr + " " + value + " " + this.updateTerminator;
    };
    ClearOneCommand.prototype.parseQueryResponse = function (control, line) {
        return this.parseReportValue(control, line);
    };
    ClearOneCommand.prototype.parseReportValue = function (control, line) {
        var qStr = this.queryString();
        var val = line.slice(qStr.length);
        // String a trailing " A", indicating an absolute level
        if (val.substring(val.length - 2) == " A") {
            val = val.substring(0, val.length - 2);
        }
        var ret = parseInt(val);
        return ret;
    };
    return ClearOneCommand;
}(TCPCommand_1.TCPCommand));
exports.ClearOneCommand = ClearOneCommand;
//# sourceMappingURL=ClearOneCommand.js.map