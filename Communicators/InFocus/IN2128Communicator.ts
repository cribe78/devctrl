import {SynchronousTCPCommunicator} from "../SynchronousTCPCommunicator";
import {TCPCommand} from "../TCPCommand";
import {Control} from "../../app/shared/Control";
class IN2128Communicator extends SynchronousTCPCommunicator {
    // Network port is 23

    constructor() {
        super();
        this.inputLineTerminator = ")";
        this.outputLineTerminator = ")\r\n";
        this.commandTimeoutDuration = 1000;  // This thing is slow, was timing out at the default duration of 400ms
    }

    buildCommandList() {
        this.registerSwitchCommand("Power", "PWR");
        this.registerSwitchCommand("Mute", "MTE");
        this.registerSwitchCommand("Video Mute", "BLK");
        this.registerStringCommand("Lamp Hours", "LMP");
    }

    registerRangeCommand(name: string, cmd: string, min: number, max: number) {
        this.commands[name] = new TCPCommand({
            cmdStr: name,
            cmdQueryStr: `(${cmd}?`,
            cmdQueryResponseRE: `(${cmd}\\!(\\d\\d)`,
            cmdUpdateTemplate: `(#${cmd}%i`,
            cmdUpdateResponseTemplate: `(${cmd}%i`,
            endpoint_id: this.endpoint_id,
            control_type: Control.CONTROL_TYPE_RANGE,
            usertype: Control.USERTYPE_SLIDER,
            poll: 1,
            templateConfig: {
                min: min,
                max: max
            }
        })
    }

    registerStringCommand(name: string, cmd: string) {
        this.commands[name] = new TCPCommand({
            cmdStr: name,
            cmdQueryStr: `(${cmd}?`,
            cmdQueryResponseRE: `\\(0-65535,(\\d+)`,  // eg. (0-65535,1045)
            endpoint_id: this.endpoint_id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: Control.USERTYPE_READONLY,
            poll: 1,
            readonly: true,
            templateConfig: {}
        })
    }

    registerSwitchCommand(name: string, cmd: string) {
        this.commands[name] = new TCPCommand({
            cmdStr: name,
            cmdQueryStr: `(${cmd}?`,
            cmdQueryResponseRE: `\\(0-1,(\\d)`,  // eg. (0-1,1)
            cmdUpdateTemplate: `(${cmd}%i!)`,
            cmdUpdateResponseTemplate: `(0-1,%i`,
            endpoint_id: this.endpoint_id,
            control_type: Control.CONTROL_TYPE_BOOLEAN,
            usertype: Control.USERTYPE_SWITCH,
            poll: 1,
            templateConfig: {}
        })
    }
}

let communicator = new IN2128Communicator();
module.exports = communicator;