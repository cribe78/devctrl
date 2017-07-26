import {SynchronousTCPCommunicator} from "../SynchronousTCPCommunicator";
import {TCPCommand} from "../TCPCommand";
import {Control} from "../../app/shared/Control";
class ESeriesCommunicator extends SynchronousTCPCommunicator {
    // Communications port is 3002

    constructor() {
        super();
        //this.inputLineTerminator = ")";
        //this.outputLineTerminator = ")";
    }


    buildCommandList() {
        this.registerSwitchCommand("Power", "PWR");
        this.registerRangeCommand("HORZ Position", "HOR", 0, 100);
        this.registerRangeCommand("VERT Position", "VRT", 0, 100);
    }

    registerRangeCommand(name: string, cmd: string, min: number, max: number) {
        this.commands[name] = new TCPCommand({
            cmdStr: name,
            cmdQueryStr: `(${cmd}?)`,
            cmdQueryResponseRE: `\\(${cmd}\\!(\\d+)\\)`,
            cmdUpdateTemplate: `(#${cmd}%i)`,
            cmdUpdateResponseTemplate: `(${cmd}!%i)`,
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
            cmdStr: name,
            cmdQueryStr: `(${cmd}?)`,
            cmdQueryResponseRE: `\\(${cmd}\\!(\\d+)\\)`,  // eg. (PWR!1)
            cmdUpdateTemplate: `(#${cmd}%i)`,
            cmdUpdateResponseTemplate: `(${cmd}!%i)`,
            endpoint_id: this.endpoint_id,
            control_type: Control.CONTROL_TYPE_BOOLEAN,
            usertype: Control.USERTYPE_SWITCH,
            poll: 1,
            templateConfig: {}
        })
    }
}

let communicator = new ESeriesCommunicator();
module.exports = communicator;