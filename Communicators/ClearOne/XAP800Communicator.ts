import {TCPCommunicator} from "../TCPCommunicator";
import {IClearOneCommandConfig} from "./ClearOneCommand";

let debug = console.log;

let micChannels = {
    "1 M": "Input 1",
    "2 M": "Input 2",
    "3 M": "Input 3",
    "4 M": "Input 4",
    "5 M": "Input 5",
    "6 M": "Input 6",
    "7 M": "Input 7",
    "8 M": "Input 8"
};

let lineChannels = {
    "9 L" : "Input 9",
    "10 L" : "Input 10",
    "11 L" : "Input 11",
    "12 L" : "Input 12"
};

let outputChannels = {
    "1 O" : "Output 1",
    "2 O" : "Output 2",
    "3 O" : "Output 3",
    "4 O" : "Output 4",
    "5 O" : "Output 5",
    "6 O" : "Output 6",
    "7 O" : "Output 7",
    "8 O" : "Output 8",
    "9 O" : "Output 9",
    "10 O" : "Output 10",
    "11 O" : "Output 11",
    "12 O" : "Output 12",
};


class XAP800Communicator extends TCPCommunicator {
    device = "#30";

    constructor() { super(); }

    buildCommandList() {
        let mtrxConfig = {
            endpoint_id: this.config.endpoint._id,
            cmdStr: "MTRX",
            control_type: "int",
            usertype: "clearone-mtrx",
            device: this.device
        };

        for (let inCh in micChannels) {
            for (let outCh in outputChannels) {
                mtrxConfig['templateConfig'] = { inputType: "mic"};
                mtrxConfig['channel'] = inCh + " " + outCh;
                mtrxConfig['channelName'] = micChannels[inCh] + "-" + outputChannels[outCh];
            }
        }

        for (let inCh in lineChannels) {
            for (let outCh in outputChannels) {
                mtrxConfig['templateConfig'] = { inputType: "line"};
                mtrxConfig['channel'] = inCh + " " + outCh;
                mtrxConfig['channelName'] = micChannels[inCh] + "-" + outputChannels[outCh];
            }
        }

    }


    generateCommandSet(config: IClearOneCommandConfig, ioList: any, ctor) {
        for (let ioStr in ioList) {

        }
    }

}

let communicator = new XAP800Communicator();
module.exports = communicator;