"use strict";
const HTTPCommunicator_1 = require("../HTTPCommunicator");
const Control_1 = require("../../shared/Control");
const HTTPCommand_1 = require("../HTTPCommand");
let debug = console.log;
class AWHE130Communicator extends HTTPCommunicator_1.HTTPCommunicator {
    // /cgi-bin/aw_ptz?cmd=#R14&res=1
    // response: s14
    // /cgi-bin/mjpeg?resolution=1920x1080&quality=1
    constructor() {
        super();
    }
    buildCommandList() {
        let ctid = this.endpoint_id + "-preset";
        let presetConfig = {
            cmdPathTemplate: "/cgi-bin/aw_ptz?cmd=%%23R%02d&res=1",
            cmdResponseRE: "s(\\d\\d)",
            controlData: {
                _id: ctid,
                ctid: ctid,
                endpoint_id: this.endpoint_id,
                usertype: "awhe130-preset",
                name: "preset",
                control_type: Control_1.Control.CONTROL_TYPE_INT,
                poll: 0,
                ephemeral: false,
                config: {
                    liveViewPath: "/cgi-bin/mjpeg?resolution=640x360&quality=1",
                },
                value: 1
            },
            writeonly: true
        };
        this.commands[ctid] = new HTTPCommand_1.HTTPCommand(presetConfig);
        ctid = this.endpoint_id + "-power";
        let powerConfig = {
            cmdPathTemplate: "/cgi-bin/aw_ptz?cmd=%%23O%d&res=1",
            cmdResponseRE: "p(\\d)",
            controlData: {
                _id: ctid,
                ctid: ctid,
                endpoint_id: this.endpoint_id,
                usertype: Control_1.Control.USERTYPE_SWITCH,
                name: "Power",
                control_type: Control_1.Control.CONTROL_TYPE_BOOLEAN,
                poll: 0,
                ephemeral: false,
                config: {},
                value: 1
            }
        };
        this.commands[ctid] = new HTTPCommand_1.HTTPCommand(powerConfig);
    }
}
let communicator = new AWHE130Communicator();
module.exports = communicator;
//# sourceMappingURL=AWHE130Communicator.js.map