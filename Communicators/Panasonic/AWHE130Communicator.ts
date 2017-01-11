import {HTTPCommunicator} from "../HTTPCommunicator";
import {IndexedDataSet} from "../../shared/DCDataModel";
import {Control, ControlData} from "../../shared/Control";
import {ControlUpdateData} from "../../shared/ControlUpdate";
import * as http from "http";
import {sprintf} from "sprintf-js";
import {IHTTPCommandConfig, HTTPCommand} from "../HTTPCommand";

let debug = console.log;

class AWHE130Communicator extends HTTPCommunicator {
    // /cgi-bin/aw_ptz?cmd=#R14&res=1
    // response: s14
    // /cgi-bin/mjpeg?resolution=1920x1080&quality=1
    constructor() {
        super();
    }


    buildCommandList() {
        let ctid = this.endpoint_id + "-preset-map";
        let presetConfig : IHTTPCommandConfig = {
            cmdPathTemplate: "/cgi-bin/aw_ptz?cmd=%%23R%02d&res=1",
            cmdResponseRE: "s(\\d\\d)",
            controlData: {
                _id : ctid,
                ctid: ctid,
                endpoint_id : this.endpoint_id,
                usertype: "awhe130-preset-map",
                name: "preset select",
                control_type: Control.CONTROL_TYPE_INT,
                poll : 0,
                ephemeral : false,
                config: { "imageMap" : "default"},
                value : 1
            },
            writeonly: true
        };
        this.commands[ctid] = new HTTPCommand(presetConfig);

        ctid = this.endpoint_id + "-preset-save";
        let presetSaveConfig : IHTTPCommandConfig = {
            cmdPathTemplate: "/cgi-bin/aw_ptz?cmd=%%23M%02d&res=1",
            cmdResponseRE: "s(\\d\\d)",
            controlData: {
                _id : ctid,
                ctid: ctid,
                endpoint_id : this.endpoint_id,
                usertype: "awhe130-preset",
                name: "preset save",
                control_type: Control.CONTROL_TYPE_INT,
                poll : 0,
                ephemeral : false,
                config : {
                    liveViewPath: "/cgi-bin/mjpeg?resolution=640x360&quality=1",
                },
                value : 1
            },
            writeonly: true
        };
        this.commands[ctid] = new HTTPCommand(presetSaveConfig);

        ctid = this.endpoint_id + "-power";
        let powerConfig : IHTTPCommandConfig = {
            cmdPathTemplate: "/cgi-bin/aw_ptz?cmd=%%23O%d&res=1",
            cmdResponseRE: "p(\\d)",
            controlData: {
                _id : ctid,
                ctid: ctid,
                endpoint_id : this.endpoint_id,
                usertype: Control.USERTYPE_SWITCH,
                name: "Power",
                control_type: Control.CONTROL_TYPE_BOOLEAN,
                poll : 0,
                ephemeral : false,
                config : {},
                value : 1
            }
        };
        this.commands[ctid] = new HTTPCommand(powerConfig);
    }
}

let communicator = new AWHE130Communicator();
module.exports = communicator;