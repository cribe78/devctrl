import {SynchronousTCPCommunicator} from "../SynchronousTCPCommunicator";
import {TCPCommand} from "../TCPCommand";
import {Control} from "../../shared/Control";
import {NECCommand} from "./NECCommand";
class NECCommunicator extends SynchronousTCPCommunicator {
    // the NEC projector communications protocol is a binary protocol that doesn't map particularly well
    // onto the functions provided by the TCPCommunicator and TCPCommand class.

    // I've extended those classes just enough to get a couple of commands working with this projector, but
    // add any more controls should probably done with a fresh implementation.  This one is kind of hacky.
    // Among other issues, this protocol doesn't use line endings or message delimiters.  The length of each message
    // is encoded in 12 bits within the message.

    // Port 7142

    // Models:
    // M300WS (entrance)   0x130410
    // M352WS (back wall)  0x220810

    constructor() {
        super();
        this.commsMode = "hex";
        this.inputLineTerminator = /\w\w$/;  // This is actually just the checksum at the end of the message
        this.outputLineTerminator = '';
    }

    buildCommandList() {
        this.commands["Model Name"] = new NECCommand({
            cmdStr: "Model Name",
            cmdQueryStr: "0085000001048a",
            cmdQueryResponseRE: "2085\\w{6}(\\w+)",
            endpoint_id: this.endpoint_id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: Control.USERTYPE_READONLY,
            poll: 0,
            readonly: true,
            templateConfig : {}
        });

        this.commands["Power"] = new NECCommand({
            cmdStr: "Power",
            cmdQueryStr: "00bf00000102c2",
            cmdQueryResponseRE: "20bf\\w{8}(\\w\\w)",
            endpoint_id: this.endpoint_id,
            control_type: Control.CONTROL_TYPE_BOOLEAN,
            usertype: Control.USERTYPE_SWITCH,
            poll: 1,
            templateConfig: {}
        });

        this.commands["Power Status"] = new TCPCommand({
            cmdStr: "Power Status",
            cmdQueryStr: "00bf00000102c2",
            cmdQueryResponseRE: "20bf\\w{8}(\\w\\w)",
            endpoint_id: this.endpoint_id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: Control.USERTYPE_SELECT_READONLY,
            poll: 1,
            readonly: true,
            templateConfig: {
                options: {
                    "00" : "Sleep",
                    "04" : "Power On",
                    "05" : "Cooling Down",
                    "06" : "Standby (error)",
                    "0f" : "Standby (power saving)",
                    "10" : "Network standby"
                }
            }
        });

        this.commands["Video Mute"] = new NECCommand({
            cmdStr: "Video Mute",
            cmdQueryStr: "00bf00000102c2",
            cmdQueryResponseRE: "20bf\\w{18}(\\w\\w)",
            cmdUpdateResponseTemplate: "22\\w",
            endpoint_id: this.endpoint_id,
            control_type: Control.CONTROL_TYPE_BOOLEAN,
            usertype: Control.USERTYPE_SWITCH,
            poll: 1,
            templateConfig: {}
        });
    }

}

let communicator = new NECCommunicator();
module.exports = communicator;