"use strict";
const TCPCommand_1 = require("../TCPCommand");
class ExtronDXPCommand extends TCPCommand_1.TCPCommand {
    constructor(config) {
        super(config);
        this.dxpCmdType = config.dxpCmdType;
        this.channelNum = config.channelNum;
    }
    parseReportValue(control, line) {
        if (this.dxpCmdType == 'status') {
            let matches = line.match(ExtronDXPCommand.statusResponseRE);
            return {
                "3_3V": parseFloat(matches[1]),
                "5V": parseFloat(matches[2]),
                "Temp": parseFloat(matches[3]),
                "Fan": parseInt(matches[4])
            };
        }
        let matches = line.match(this.cmdReportRE);
        if (matches && matches.length > 1) {
            return matches[this.cmdReportREMatchIdx];
        }
        return '';
    }
}
ExtronDXPCommand.tieResponseRE = /^Out(\d) In(\d) (Aud|Vid|All)/;
ExtronDXPCommand.muteResponseRE = /^(Vmt|Amt)(\d)\*(0|1)/;
ExtronDXPCommand.statusResponseRE = /^([\d.]+) ([\d.]+) \+([\d.]+) (\d+)/;
exports.ExtronDXPCommand = ExtronDXPCommand;
//# sourceMappingURL=ExtronDXPCommand.js.map