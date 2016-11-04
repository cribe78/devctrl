import * as debugMod from "debug";
import {TCPCommunicator} from "../TCPCommunicator";
import {ITCPCommandConfig, TCPCommand} from "../TCPCommand";
import keys = require("core-js/fn/array/keys");
import {IA200Command} from "./IA200Command";

let debug = debugMod("comms");

class IA200Communicator extends TCPCommunicator {
    inputLineTerminator = '';
    outputLineTerminator = '\n';

    buildCommandList() {
        let nineZeros = "000000000";
        let fiveZeros = "00000";
        let inputConfig : ITCPCommandConfig = {
            cmdStr: "Video Input",
            cmdUpdateTemplate: "A00WBA{value}" + nineZeros,
            cmdUpdateResponseTemplate: "K",
            endpoint_id: this.config.endpoint._id,
            control_type: "string",
            usertype: "select",
            templateConfig: {
                options: {
                    A : "Component",
                    B : "RGB",
                    C : "DVI",
                    D : "S-Video",
                    E : "Composite",
                    F : "SDI",
                    G : "HDMI"
                }
            },
            poll: 0
        };

        this.commands[inputConfig.cmdStr] = new IA200Command(inputConfig);

        let keystoneConfig : ITCPCommandConfig = {
            cmdStr: "Keystone TL-X",
            cmdQueryStr: "A00RFAA",
            cmdQueryResponseRE: /V0(\d\d\d)/,
            cmdUpdateTemplate: "A00WFAA{value}" + fiveZeros,
            cmdUpdateResponseTemplate: "K",
            endpoint_id: this.config.endpoint._id,
            control_type: "range",
            usertype: "slider",
            templateConfig: {
                min: 0,
                max: 800
            },
            poll: 1
        };

        this.commands[keystoneConfig.cmdStr] = new IA200Command(keystoneConfig);

        keystoneConfig.cmdStr = "Keystone TL-V";
        keystoneConfig.cmdQueryStr = "A00RFAB";
        keystoneConfig.cmdUpdateTemplate = "A00WFAB{value}" + fiveZeros;

        this.commands[keystoneConfig.cmdStr] = new IA200Command(keystoneConfig);


    }


    // Match one of the IA200 response codes and return it
    matchResponseCode() {
        let data = this.inputBuffer;

        if (data.charAt(0) == "K") {
            // ACK
            return "K";
        }
        else if (data.charAt(0) == "V") {
            // 4 digit number
            return data.slice(0, 5);
        }
        else if (data.charAt(0) == "E") {
            // Error
            return "E";
        }
        else if (data.charAt(0) == "v") {
            // A string
            if (data.search("\r") == -1) {
                // An incomplete string, wait for more
                return "";
            }

            let str = data.slice(0, data.search("\r") + 1);
            return str;
        }

        debug("Error: unmatched IA200 start char:" + data);
        this.inputBuffer = this.inputBuffer.slice(1);

        return '';
    }

    // The IA200 doesn't delineate between responses. Handle all potential responses in
    // custom onData handler
    onData(data: any) {
        let strData = String(data);
        this.inputBuffer += strData;

        let resp;
        while ((resp = this.matchResponseCode())) {
            this.processLine(resp);
            this.inputBuffer = this.inputBuffer.slice(resp.length);
        }
    }
}

let communicator = new IA200Communicator();
module.exports = communicator;