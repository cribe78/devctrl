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
        var _this = _super.call(this, config) || this;
        _this.dxpCmdType = config.dxpCmdType;
        _this.channelNum = config.channelNum;
        return _this;
    }
    ExtronDXPCommand.prototype.parseReportValue = function (control, line) {
        if (this.dxpCmdType == 'status') {
            var matches_1 = line.match(ExtronDXPCommand.statusResponseRE);
            return {
                "3_3V": parseFloat(matches_1[1]),
                "5V": parseFloat(matches_1[2]),
                "Temp": parseFloat(matches_1[3]),
                "Fan": parseInt(matches_1[4])
            };
        }
        var matches = line.match(this.cmdReportRE);
        if (matches && matches.length > 1) {
            return matches[this.cmdReportREMatchIdx];
        }
        return '';
    };
    return ExtronDXPCommand;
}(TCPCommand_1.TCPCommand));
ExtronDXPCommand.tieResponseRE = /^Out(\d) In(\d) (Aud|Vid|All)/;
ExtronDXPCommand.muteResponseRE = /^(Vmt|Amt)(\d)\*(0|1)/;
ExtronDXPCommand.statusResponseRE = /^([\d.]+) ([\d.]+) \+([\d.]+) (\d+)/;
exports.ExtronDXPCommand = ExtronDXPCommand;
//# sourceMappingURL=ExtronDXPCommand.js.map