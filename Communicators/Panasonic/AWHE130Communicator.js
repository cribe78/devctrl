"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HTTPCommunicator_1 = require("../HTTPCommunicator");
var Control_1 = require("../../shared/Control");
var HTTPCommand_1 = require("../HTTPCommand");
var debug = console.log;
var AWHE130Communicator = (function (_super) {
    __extends(AWHE130Communicator, _super);
    // /cgi-bin/aw_ptz?cmd=#R14&res=1
    // response: s14
    // /cgi-bin/mjpeg?resolution=1920x1080&quality=1
    function AWHE130Communicator() {
        return _super.call(this) || this;
    }
    AWHE130Communicator.prototype.buildCommandList = function () {
        var ctid = this.endpoint_id + "-preset";
        var presetConfig = {
            cmdPathTemplate: "/cgi-bin/aw_ptz?cmd=%%23R%02d&res=1",
            cmdResponseRE: "s(\\d\\d)",
            controlData: {
                _id: ctid,
                ctid: ctid,
                endpoint_id: this.endpoint_id,
                usertype: "awhe130-preset-map",
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
        var powerConfig = {
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
    };
    return AWHE130Communicator;
}(HTTPCommunicator_1.HTTPCommunicator));
var communicator = new AWHE130Communicator();
module.exports = communicator;
//# sourceMappingURL=AWHE130Communicator.js.map