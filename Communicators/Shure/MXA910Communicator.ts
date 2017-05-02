import {TCPCommunicator} from "../TCPCommunicator";
import {MXA910Command} from "./MXA910Command";
import {Control} from "../../shared/Control";
let debug= console.log;

class MXA910Communicator extends TCPCommunicator {
    inputLineTerminator = '>';

    buildCommandList() {
        this.registerSwitchCommand("Mute All", "DEVICE_AUDIO_MUTE");
        this.registerSwitchReadonlyCommand("Mute LED", "DEV_MUTE_STATUS_LED_STATE");
    }

    matchLineToError(line: string) {
        if (line == "< REP ERR ") {
            console.log("ERROR REPORTED");
            return true;
        }

        return false;
    }

    registerSwitchCommand(name: string, cmd: string) {
        this.commands[name] = new MXA910Command({
            cmdStr: name,
            cmdQueryStr: `< GET ${cmd} >`,
            cmdQueryResponseRE: `< REP ${cmd} (\\w+)`,
            cmdUpdateTemplate: `< SET ${cmd} %s >`,
            cmdUpdateResponseTemplate: `< REP ${cmd} %s `,
            cmdReportRE: `< REP ${cmd} (\\w+) `,
            endpoint_id: this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_BOOLEAN,
            usertype: Control.USERTYPE_SWITCH,
            templateConfig: {},
            poll: 0
        });
    }

    registerSwitchReadonlyCommand(name: string, cmd: string) {
        this.commands[name] = new MXA910Command({
            cmdStr: name,
            cmdQueryStr: `< GET ${cmd} >`,
            cmdQueryResponseRE: `< REP ${cmd} (\\w+)`,
            cmdUpdateTemplate: `< SET ${cmd} %s >`,
            cmdUpdateResponseTemplate: `< REP ${cmd} %s `,
            cmdReportRE: `< REP ${cmd} (\\w+) `,
            endpoint_id: this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_BOOLEAN,
            usertype: Control.USERTYPE_SWITCH_READONLY,
            templateConfig: {},
            readonly: true,
            poll: 0
        });
    }
}

let communicator = new MXA910Communicator();
module.exports = communicator;