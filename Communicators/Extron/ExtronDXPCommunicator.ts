import { TCPCommunicator } from "../TCPCommunicator";
import {IExtronDXPCommandConfig, ExtronDXPCommand} from "./ExtronDXPCommand";
import {TCPCommand} from "../TCPCommand";
import {EndpointStatus} from "../../shared/Endpoint";

let outputs = {};
let inputs = {};
for (let i = 1; i <= 8; i++) {
    outputs[i] = "Output " + i;
    inputs[i] = "Input " + i;
}

class ExtronDXPCommunicator extends TCPCommunicator {
    inputLineTerminator = '\r\n';
    outputLineTerminator = '\r\n';
    endpointPassword = "DWCONTROL";


    buildCommandList() {

        // Video/Audio Tie Commands
        for (let i in outputs) {
            // Video Output command
            let vidoutConfig:IExtronDXPCommandConfig = {
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

            this.commands[vidoutConfig.cmdStr] = new ExtronDXPCommand(vidoutConfig);
        }
        for (let i in outputs) {
            // Audio Output command
            let audoutConfig : IExtronDXPCommandConfig = {
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

            this.commands[audoutConfig.cmdStr] = new ExtronDXPCommand(audoutConfig);
        }
        for (let i in outputs) {
            //Video/Audio Mute Commands
            let vmuteConfig : IExtronDXPCommandConfig = {
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


            this.commands[vmuteConfig.cmdStr] = new ExtronDXPCommand(vmuteConfig);
        }
        for (let i in outputs) {
            let amuteConfig : IExtronDXPCommandConfig = {
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

            this.commands[amuteConfig.cmdStr] = new ExtronDXPCommand(amuteConfig);

        }

        //Device Status Command
        let statusConfig : IExtronDXPCommandConfig = {
            cmdStr: "status",
            cmdQueryStr: "S",
            endpoint_id: this.endpoint_id,
            control_type: "string",
            usertype: "readonly",
            templateConfig: {},
            dxpCmdType: "status",
            poll: 1
        };

        this.commands["status"] = new ExtronDXPCommand(statusConfig);
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
                        this.config.statusUpdateCallback(EndpointStatus.Online);
                        this.online();
                    }
                ])
            }
        ]);


    }


    /*
    * This implementation should be more efficient than the default implementation
    * which checks every command individually
     */
    matchLineToCommand(line: string) : TCPCommand | boolean {
        let matches =  line.match(ExtronDXPCommand.tieResponseRE);
        if (matches) {
            let cmdStr = "Out" + matches[1] + matches[2];

            if (this.commands[cmdStr]) {
                return this.commands[cmdStr];
            }

            return false;
        }

        matches = line.match(ExtronDXPCommand.muteResponseRE);
        if (matches) {
            let cmdStr = matches[1] + matches[2];

            if (this.commands[cmdStr]) {
                return this.commands[cmdStr];
            }
        }

        matches = line.match(ExtronDXPCommand.statusResponseRE);
        if (matches) {
            return this.commands["status"];
        }

        return false;
    }

}




let communicator = new ExtronDXPCommunicator();
module.exports = communicator;