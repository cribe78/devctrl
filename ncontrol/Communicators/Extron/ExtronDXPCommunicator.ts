import { TCPCommunicator } from "../TCPCommunicator";
import {IExtronDXPCommandConfig, ExtronDXPCommand} from "./ExtronDXPCommand";
import {TCPCommand} from "../TCPCommand";

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
            let config : IExtronDXPCommandConfig = {
                cmdStr: "Out" + i + "Vid",
                endpoint_id: this.endpoint_id,
                control_type: "string",
                usertype: "select",
                templateConfig: {
                    options: inputs
                },
                dxpCmdType: "tie-video",
                channelNum: i
            };

            this.commands[config.cmdStr] = new ExtronDXPCommand(config);

            // Modify and create audio command
            config.cmdStr = "Out" + i + "Aud";
            config.dxpCmdType = "tie-audio";

            this.commands[config.cmdStr] = new ExtronDXPCommand(config);
        }

        //Video/Audio Mute Commands
        for (let i in outputs) {
            let config : IExtronDXPCommandConfig = {
                cmdStr: "Vmt" + i,
                endpoint_id: this.endpoint_id,
                control_type: "boolean",
                usertype: "switch",
                templateConfig: {},
                dxpCmdType: "mute-video",
                channelNum: i
            };

            this.commands[config.cmdStr] = new ExtronDXPCommand(config);

            // Modify and create audio command
            config.cmdStr = "Amt" + i;
            config.dxpCmdType = "mute-audio";

            this.commands[config.cmdStr] = new ExtronDXPCommand(config);
        }

        //Device Status Command
        let statusConfig : IExtronDXPCommandConfig = {
            cmdStr: "status",
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
                    "Login Administrator",
                    () => {
                        this.connected = true;
                        this.config.statusUpdateCallback("online");
                    }
                ])
            }
        ]);
    }


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