import {SynchronousTCPCommunicator} from "../SynchronousTCPCommunicator";
import {TCPCommand} from "../TCPCommand";
import {Control} from "../../shared/Control";
class IN2128Communicator extends SynchronousTCPCommunicator {
    constructor() {
        super();
    }

    buildCommandList() {
        this.registerSwitchCommand("Power", "PWR");
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


    registerSwitchCommand(name: string, cmd: string) {
        this.commands[name] = new TCPCommand({
            cmdStr: cmd,
            cmdQueryStr: `(${cmd}?)`,
            cmdQueryResponseRE: `\\(0-1,(\\d)\\)`,  // eg. (0-1,1)
            cmdUpdateTemplate: `(${cmd}%i!)`,
            cmdUpdateResponseTemplate: `(0-1,%i)`,
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