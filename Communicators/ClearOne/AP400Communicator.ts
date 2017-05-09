import { TCPCommunicator } from "../TCPCommunicator";
import { commands } from "./AP400Controls";
import {TCPCommand} from "../TCPCommand";
import {IClearOneCommandConfig, ClearOneCommand} from "./ClearOneCommand";

import * as debugMod from "debug";
let debug = debugMod("comms");


export interface IAP400CommandConfig {
    cmdStr: string;
    ioList?: any;
    ctor: typeof ClearOneCommand;
    control_type: string;
    usertype: string;
    readonly?: boolean;
    updateTerminator?: string;
    templateConfig?: any;
}

class AP400Communicator extends TCPCommunicator {
    device = "#30";

    constructor() {
        super();
    }

    connect() {
        debug("connecting to AP 400");
        super.connect();
    }


    preprocessLine(line: string) : string {
        // Strip a leading prompt
        let start = "AP 400> ";
        if (line.substring(0, start.length) == start) {
            return line.slice(start.length);
        }

        return line;
    }



    buildCommandList() {
        // First build a command list
        for (let cmdIdx in commands) {
            let cmdDef = commands[cmdIdx];
            let cmdConfig : IClearOneCommandConfig = {
                endpoint_id: this.config.endpoint._id,
                cmdStr: cmdDef.cmdStr,
                control_type: cmdDef.control_type,
                usertype: cmdDef.usertype,
                channel: '',
                channelName: '',
                device: this.device,
                templateConfig: cmdDef.templateConfig || {}
            };

            if (cmdDef.updateTerminator) {
                cmdConfig.updateTerminator = cmdDef.updateTerminator;
            }

            if (cmdDef.ioList) {
                for (let ioStr in cmdDef.ioList) {
                    cmdConfig.channel = ioStr;
                    cmdConfig.channelName = cmdDef.ioList[ioStr];

                    let cmd = new cmdDef.ctor(cmdConfig);
                    this.commands[cmd.cmdStr] = cmd;
                }
            }
            else {
                let cmd : TCPCommand = new cmdDef.ctor(cmdConfig);
                this.commands[cmd.cmdStr] = cmd;
            }
        }
    }
}

let communicator = new AP400Communicator();
module.exports = communicator;