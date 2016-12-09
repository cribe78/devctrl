"use strict";
const TCPCommunicator_1 = require("../TCPCommunicator");
const ExtronDXPCommand_1 = require("./ExtronDXPCommand");
const Endpoint_1 = require("../../shared/Endpoint");
let outputs = {};
let inputs = {};
for (let i = 1; i <= 8; i++) {
    outputs[i] = "Output " + i;
    inputs[i] = "Input " + i;
}
class ExtronDXPCommunicator extends TCPCommunicator_1.TCPCommunicator {
    constructor() {
        super(...arguments);
        this.inputLineTerminator = '\r\n';
        this.outputLineTerminator = '\r\n';
        this.endpointPassword = "DWCONTROL";
    }
    buildCommandList() {
        // Video/Audio Tie Commands
        for (let i in outputs) {
            // Video Output command
            let vidoutConfig = {
                cmdStr: "Out" + i + "Vid",
                cmdQueryStr: i + "%",
                cmdQueryResponseRE: /(\d)/,
                cmdUpdateTemplate: '%d*' + i + '%%',
                cmdUpdateResponseTemplate: 'Out' + i + ' In%d Vid',
                cmdReportRE: 'Out' + i + ' In(\\d) Vid',
                endpoint_id: this.endpoint_id,
                control_type: "string",
                usertype: "select",
                templateConfig: {
                    options: inputs
                },
                dxpCmdType: "tie-video",
                channelNum: i
            };
            this.commands[vidoutConfig.cmdStr] = new ExtronDXPCommand_1.ExtronDXPCommand(vidoutConfig);
        }
        for (let i in outputs) {
            // Audio Output command
            let audoutConfig = {
                cmdStr: "Out" + i + "Aud",
                cmdQueryStr: i + "$",
                cmdQueryResponseRE: /(\d)/,
                cmdUpdateTemplate: '%d*' + i + '$',
                cmdUpdateResponseTemplate: 'Out' + i + ' In%d Aud',
                cmdReportRE: 'Out' + i + ' In(\d) Aud',
                endpoint_id: this.endpoint_id,
                control_type: "string",
                usertype: "select",
                templateConfig: {
                    options: inputs
                },
                dxpCmdType: "tie-audio",
                channelNum: i
            };
            this.commands[audoutConfig.cmdStr] = new ExtronDXPCommand_1.ExtronDXPCommand(audoutConfig);
        }
        for (let i in outputs) {
            //Video/Audio Mute Commands
            let vmuteConfig = {
                cmdStr: "Vmt" + i,
                cmdQueryStr: i + "B",
                cmdQueryResponseRE: '(0|1)',
                cmdUpdateTemplate: `${i}*%dB`,
                cmdUpdateResponseTemplate: `Vmt${i}*%d`,
                cmdReportRE: 'Vmt' + i + '*(0|1)',
                endpoint_id: this.endpoint_id,
                control_type: "boolean",
                usertype: "switch",
                templateConfig: {},
                dxpCmdType: "mute-video",
                channelNum: i
            };
            this.commands[vmuteConfig.cmdStr] = new ExtronDXPCommand_1.ExtronDXPCommand(vmuteConfig);
        }
        for (let i in outputs) {
            let amuteConfig = {
                cmdStr: "Amt" + i,
                cmdQueryStr: i + "Z",
                cmdQueryResponseRE: '(0|1)',
                cmdUpdateTemplate: `${i}*%dZ`,
                cmdUpdateResponseTemplate: `Amt${i}*%d`,
                cmdReportRE: new RegExp('Amt' + i + '*(0|1)'),
                endpoint_id: this.endpoint_id,
                control_type: "boolean",
                usertype: "switch",
                templateConfig: {},
                dxpCmdType: "mute-audio",
                channelNum: i
            };
            this.commands[amuteConfig.cmdStr] = new ExtronDXPCommand_1.ExtronDXPCommand(amuteConfig);
        }
        //Device Status Command
        let statusConfig = {
            cmdStr: "status",
            cmdQueryStr: "S",
            endpoint_id: this.endpoint_id,
            control_type: "string",
            usertype: "readonly",
            templateConfig: {},
            dxpCmdType: "status",
            poll: 1
        };
        this.commands["status"] = new ExtronDXPCommand_1.ExtronDXPCommand(statusConfig);
    }
    doDeviceLogon() {
        this.socket.write("\r");
        this.expectedResponses.push([
            "Password:",
            () => {
                this.socket.write(this.endpointPassword + "\r");
                this.expectedResponses.push([
                    "Login (Administrator|User)",
                    () => {
                        this.connected = true;
                        this.config.statusUpdateCallback(Endpoint_1.EndpointStatus.Online);
                        this.online();
                    }
                ]);
            }
        ]);
    }
    /*
    * This implementation should be more efficient than the default implementation
    * which checks every command individually
     */
    matchLineToCommand(line) {
        let matches = line.match(ExtronDXPCommand_1.ExtronDXPCommand.tieResponseRE);
        if (matches) {
            let cmdStr = "Out" + matches[1] + matches[2];
            if (this.commands[cmdStr]) {
                return this.commands[cmdStr];
            }
            return false;
        }
        matches = line.match(ExtronDXPCommand_1.ExtronDXPCommand.muteResponseRE);
        if (matches) {
            let cmdStr = matches[1] + matches[2];
            if (this.commands[cmdStr]) {
                return this.commands[cmdStr];
            }
        }
        matches = line.match(ExtronDXPCommand_1.ExtronDXPCommand.statusResponseRE);
        if (matches) {
            return this.commands["status"];
        }
        return false;
    }
}
let communicator = new ExtronDXPCommunicator();
module.exports = communicator;
//# sourceMappingURL=ExtronDXPCommunicator.js.map