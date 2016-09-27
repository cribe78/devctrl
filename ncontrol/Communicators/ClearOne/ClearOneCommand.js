"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TCPCommand_1 = require("../TCPCommand");
var ClearOneCommand = (function (_super) {
    __extends(ClearOneCommand, _super);
    function ClearOneCommand(config) {
        _super.call(this, config);
        this.channelName = '';
        this.updateTerminator = '';
        if (config.channel) {
            this.channel = config.channel;
            this.cmdStr = config.cmdStr + " " + config.channel;
            this.channelName = config.channelName;
            this.name = config.cmdStr + " " + config.channelName;
        }
        if (config.updateTerminator) {
            this.updateTerminator = config.updateTerminator;
        }
        this.device = config.device;
    }
    ClearOneCommand.prototype.matchesDeviceString = function (devStr) {
        var matchStr = this.deviceQueryString();
        var matchLen = matchStr.length;
        return devStr.substring(0, matchLen) == matchStr;
    };
    ClearOneCommand.prototype.deviceQueryString = function () {
        return this.device + " " + this.cmdStr;
    };
    ClearOneCommand.prototype.deviceUpdateString = function (control, update) {
        return this.device + " " + this.cmdStr + " " + update.value + " " + this.updateTerminator;
    };
    ClearOneCommand.prototype.parseControlValue = function (control, line) {
        var qStr = this.deviceQueryString();
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