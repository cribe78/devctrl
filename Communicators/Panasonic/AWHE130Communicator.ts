import {HTTPCommunicator} from "../HTTPCommunicator";
import {IndexedDataSet} from "../../shared/DCDataModel";
import {Control, ControlData, ControlXYValue} from "../../shared/Control";
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
            name: "preset select",
            cmdPathTemplate: "/cgi-bin/aw_ptz?cmd=%%23R%02d&res=1",
            cmdResponseRE: "s(\\d\\d)",
            cmdQueryPath: "/cgi-bin/aw_ptz?cmd=%23S&res=1",
            cmdQueryResponseParseFn: (data) => {
                return HTTPCommand.matchIntToRE(data, /s(\d\d)/);
            },
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
            }
        };
        this.commands[ctid] = new HTTPCommand(presetConfig);

        ctid = this.endpoint_id + "-preset-save";
        let presetSaveConfig : IHTTPCommandConfig = {
            name: "preset save",
            cmdPathTemplate: "/cgi-bin/aw_ptz?cmd=%%23M%02d&res=1",
            cmdQueryPath: "",
            cmdQueryResponseParseFn: (data) => {},
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
            name: "power",
            cmdPathTemplate: "/cgi-bin/aw_ptz?cmd=%%23O%d&res=1",
            cmdResponseRE: "p(\\d)",
            cmdQueryPath: "/cgi-bin/aw_ptz?cmd=%23O&res=1",
            cmdQueryResponseParseFn: data => { return HTTPCommand.matchBoolToRE(data, /p(\d)/)},
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

        ctid = this.endpoint_id + "-zoom";
        let zoomConfig : IHTTPCommandConfig = {
            name: "zoom",
            cmdPathTemplate: "/cgi-bin/aw_ptz?cmd=%%23AXZ%3X&res=1",
            cmdResponseRE: "axz(\\w\\w\\w)",
            cmdQueryPath:  "/cgi-bin/aw_ptz?cmd=%23GZ&res=1",
            cmdQueryResponseParseFn: data => {
                return HTTPCommand.matchHexIntToRE(data, /gz(\w\w\w)/);
            },
            controlData: {
                _id : ctid,
                ctid: ctid,
                endpoint_id : this.endpoint_id,
                usertype: Control.USERTYPE_SLIDER,
                name: "Zoom",
                control_type: Control.CONTROL_TYPE_RANGE,
                poll : 1,
                ephemeral : false,
                config : {
                    min: 1365,
                    max: 4095
                },
                value : 1365
            }
        };
        this.commands[ctid] = new HTTPCommand(zoomConfig);

        let parsePanTiltXY = data => {
            let matches = data.match(/aPC(\w\w\w\w)(\w\w\w\w)/);
            if (matches && matches.length == 3) {
                return new ControlXYValue(
                    parseInt(matches[1], 16),
                    parseInt(matches[2], 16)
                );
            }
        };

        ctid = this.endpoint_id + "-pan-tilt";
        let panTiltConfig : IHTTPCommandConfig = {
            name: "pan/tilt",
            cmdPathFunction: (value) => {
                let path = sprintf("/cgi-bin/aw_ptz?cmd=%%23APC%4X%4X&res=1", value.x, value.y);
                return path;
            },
            cmdResponseRE: "aPC(\\w\\w\\w\\w\\w\\w\\w\\w)",
            cmdResponseParser: parsePanTiltXY,
            cmdQueryPath: "/cgi-bin/aw_ptz?cmd=%23APC&res=1",
            cmdQueryResponseParseFn: parsePanTiltXY,
            controlData: {
                _id : ctid,
                ctid: ctid,
                endpoint_id : this.endpoint_id,
                usertype: Control.USERTYPE_SLIDER_2D,
                name: "Pan/Tilt",
                control_type: Control.CONTROL_TYPE_XY,
                poll : 1,
                ephemeral : false,
                config : {
                    xMultiplier: 30,
                    xMin: 384,
                    xMax: 1800,
                    xName: "Pan",
                    yMin: 242,
                    yMax: 1213,
                    yName: "Tilt",
                    yMultiplier: 30
                },
                value : { x : 32000, y : 32000 }
            }
        };
        this.commands[ctid] = new HTTPCommand(panTiltConfig);

    }




    getControlTemplates() : IndexedDataSet<Control> {
        // Build the control list from the defined commands
        // this populates controlsByCtid
        super.getControlTemplates();

        // Add aditional controls that have no associated commands
        let ctid = this.endpoint_id + "-view";
        let viewControlData : ControlData = {
            _id : ctid,
            ctid : ctid,
            endpoint_id : this.endpoint_id,
            usertype: Control.USERTYPE_IMAGE,
            name: "View",
            control_type: Control.CONTROL_TYPE_STRING,
            poll: 0,
            config: {
                path: "/cgi-bin/mjpeg?resolution=640x360&quality=1",
                proto: 'http'
            },
            value : ""
        };

        this.controlsByCtid[ctid] = new Control(ctid, viewControlData);

        let linkCtid = this.endpoint_id + "-hyperlink";
        this.controlsByCtid[linkCtid] = new Control(linkCtid,
            {
                _id : linkCtid,
                ctid: linkCtid,
                endpoint_id: this.endpoint_id,
                usertype: Control.USERTYPE_HYPERLINK,
                name: "Device Web Interface",
                control_type: Control.CONTROL_TYPE_STRING,
                poll: 0,
                config: {
                    relativeUrl: "/live/index.html",
                    proto: "http"
                },
                value: ""
            }
        );


        return this.controlsByCtid;
    }
}

let communicator = new AWHE130Communicator();
module.exports = communicator;