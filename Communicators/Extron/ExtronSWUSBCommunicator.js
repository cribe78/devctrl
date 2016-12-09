"use strict";
const debugMod = require("debug");
const TCPCommunicator_1 = require("../TCPCommunicator");
const TCPCommand_1 = require("../TCPCommand");
let debug = debugMod("comms");
class ExtronSWUSBCommunicator extends TCPCommunicator_1.TCPCommunicator {
    constructor() {
        super(...arguments);
        this.inputLineTerminator = '\r\n';
        this.outputLineTerminator = '';
    }
    buildCommandList() {
        let config = {
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
    }
    preprocessLine(line) {
        if (line.match(/^ser2net port/)) {
            return '';
        }
        return line;
    }
}
let communicator = new ExtronSWUSBCommunicator();
module.exports = communicator;
//# sourceMappingURL=ExtronSWUSBCommunicator.js.map