"use strict";
const TCPCommand_1 = require("../TCPCommand");
class ClearOneCommand extends TCPCommand_1.TCPCommand {
    constructor(config) {
        super(config);
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
    matchesReport(devStr) {
        let matchStr = this.queryString();
        let matchLen = matchStr.length;
        return devStr.substring(0, matchLen) == matchStr;
    }
    queryString() {
        return `${this.device} ${this.cmdStr}`;
    }
    queryResponseMatchString() {
        return this.queryString + '.*';
    }
    updateString(control, update) {
        return this.updateResponseMatchString(update);
    }
    updateResponseMatchString(update) {
        return `${this.device} ${this.cmdStr} ${update.value} ${this.updateTerminator}`;
    }
    parseQueryResponse(control, line) {
        return this.parseReportValue(control, line);
    }
    parseReportValue(control, line) {
        let qStr = this.queryString();
        let val = line.slice(qStr.length);
        // String a trailing " A", indicating an absolute level
        if (val.substring(val.length - 2) == " A") {
            val = val.substring(0, val.length - 2);
        }
        let ret = parseInt(val);
        return ret;
    }
}
exports.ClearOneCommand = ClearOneCommand;
//# sourceMappingURL=ClearOneCommand.js.map