import * as debugMod from "debug";
import {TCPCommunicator} from "../TCPCommunicator";
import {ITCPCommandConfig, TCPCommand} from "../TCPCommand";


let debug = debugMod("comms");

class ExtronSWUSBCommunicator extends TCPCommunicator {
    inputLineTerminator = '\r\n';
    outputLineTerminator = '';


    buildCommandList() {
        let config : ITCPCommandConfig = {
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

        this.commands[config.cmdStr] = new TCPCommand(config);
    }


    preprocessLine(line: string) : string {
        if (line.match(/^ser2net port/)) {
            return '';
        }

        return line;
    }
}

let communicator = new ExtronSWUSBCommunicator();
module.exports = communicator;