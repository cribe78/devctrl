import * as debugMod from "debug";
import {TCPCommunicator} from "../TCPCommunicator";
import {ITCPCommandConfig} from "../TCPCommand";
import {ExtronSWUSBCommand} from "./ExtronSWUSBCommand";


let debug = debugMod("comms");

class ExtronSWUSBCommunicator extends TCPCommunicator {
    inputLineTerminator = '\r\n';
    outputLineTerminator = '';


    buildCommandList() {
        let config : ITCPCommandConfig = {
            cmdStr: "Input",
            endpoint_id: this.config.endpoint._id,
            control_type: "string",
            usertype: "select",
            templateConfig: {
                options: {
                    1: "Input 1",
                    2: "Input 2",
                    3: "Input 3",
                    4: "Input 3"
                }
            },
            poll: 1
        };

        this.commands[config.cmdStr] = new ExtronSWUSBCommand(config);
    }

    connect() {
        debug("connecting to SWUSB-4");
        super.connect();
    }
}

let communicator = new ExtronSWUSBCommunicator();
module.exports = communicator;