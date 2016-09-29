"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TCPCommand_1 = require("../TCPCommand");
var ExtronDXPCommand = (function (_super) {
    __extends(ExtronDXPCommand, _super);
    function ExtronDXPCommand(config) {
        _super.call(this, config);
        this.dxpCmdType = config.dxpCmdType;
        this.channelNum = config.channelNum;
    }
    ExtronDXPCommand.prototype.deviceQueryString = function () {
        switch (this.dxpCmdType) {
            case 'tie-video':
                return this.channelNum + '%';
            case 'tie-audio':
                return this.channelNum + '$';
            case 'mute-audio':
                return this.channelNum + 'Z';
            case 'mute-video':
                return this.channelNum + 'B';
            case 'status':
                return 'S';
            default:
                return '';
        }
    };
    ExtronDXPCommand.prototype.deviceUpdateString = function (control, update) {
        switch (this.dxpCmdType) {
            case 'tie-video':
                return update.value + "*" + this.channelNum + "%";
            case 'tie-audio':
                return update.value + "*" + this.channelNum + "%";
            case 'mute-audio':
                return this.channelNum + "*" + update.value + "Z";
            case 'mute-video':
                return this.channelNum + "*" + update.value + "B";
            default:
                return '';
        }
    };
    ExtronDXPCommand.prototype.matchesDeviceString = function (str) {
        switch (this.dxpCmdType) {
            case 'tie-video':
                return (str.search('Out' + this.channelNum + ' In\d Vid') != -1);
            case 'tie-audio':
                return (str.search('Out' + this.channelNum + ' In\d Aud') != -1);
            case 'mute-audio':
                return (str.search('Amt' + this.channelNum + '\*\d') != -1);
            case 'mute-video':
                return (str.search('Vmt' + this.channelNum + '\*\d') != -1);
        }
        return false;
    };
    ExtronDXPCommand.prototype.parseControlValue = function (control, line) {
        var ret = 0;
        var matches;
        var retstr;
        switch (this.dxpCmdType) {
            case 'tie-video':
            case 'tie-audio':
                matches = line.match(ExtronDXPCommand.tieResponseRE);
                retstr = matches[2];
                ret = parseInt(retstr);
                break;
            case 'mute-video':
            case 'mute-audio':
                matches = line.match(ExtronDXPCommand.muteResponseRE);
                retstr = matches[3];
                ret = parseInt(retstr);
                break;
            case 'status':
                matches = line.match(ExtronDXPCommand.statusResponseRE);
                ret = {
                    "3.3V": parseFloat(matches[1]),
                    "5V": parseFloat(matches[2]),
                    "Temp": parseFloat(matches[3]),
                    "Fan": parseInt(matches[4])
                };
        }
        return ret;
    };
    ExtronDXPCommand.tieResponseRE = /^Out(\d) In(\d) (Aud|Vid|All)/;
    ExtronDXPCommand.muteResponseRE = /^(Vmt|Amt)(\d)\*(0|1)/;
    ExtronDXPCommand.statusResponseRE = /^([\d.]+) ([\d.]+) \+([\d.]+) (\d+)/;
    return ExtronDXPCommand;
}(TCPCommand_1.TCPCommand));
exports.ExtronDXPCommand = ExtronDXPCommand;
//# sourceMappingURL=ExtronDXPCommand.js.map