"use strict";
const TCPCommunicator_1 = require("../TCPCommunicator");
const AP400Controls_1 = require("./AP400Controls");
const debugMod = require("debug");
let debug = debugMod("comms");
class AP400Communicator extends TCPCommunicator_1.TCPCommunicator {
    constructor() {
        super();
        this.device = "#30";
    }
    connect() {
        debug("connecting to AP 400");
        super.connect();
    }
    preprocessLine(line) {
        // Strip a leading prompt
        let start = "AP 400> ";
        if (line.substring(0, start.length) == start) {
            return line.slice(start.length);
        }
        return line;
    }
    buildCommandList() {
        // First build a command list
        for (let cmdIdx in AP400Controls_1.commands) {
            let cmdDef = AP400Controls_1.commands[cmdIdx];
            let cmdConfig = {
                endpoint_id: this.config.endpoint._id,
                cmdStr: cmdDef.cmdStr,
                control_type: cmdDef.control_type,
                usertype: cmdDef.usertype,
                channel: '',
                channelName: '',
                device: this.device,
                templateConfig: cmdDef.templateConfig || {}
            };
            if (cmdDef.updateTerminator) {
                cmdConfig.updateTerminator = cmdDef.updateTerminator;
            }
            if (cmdDef.ioList) {
                for (let ioStr in cmdDef.ioList) {
                    cmdConfig.channel = ioStr;
                    cmdConfig.channelName = cmdDef.ioList[ioStr];
                    let cmd = new cmdDef.ctor(cmdConfig);
                    this.commands[cmd.cmdStr] = cmd;
                }
            }
            else {
                let cmd = new cmdDef.ctor(cmdConfig);
                this.commands[cmd.cmdStr] = cmd;
            }
        }
    }
}
let communicator = new AP400Communicator();
module.exports = communicator;
//# sourceMappingURL=AP400Communicator.js.map