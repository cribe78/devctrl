"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HTTPCommunicator_1 = require("../HTTPCommunicator");
var Control_1 = require("../../shared/Control");
var sprintf_js_1 = require("sprintf-js");
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
        var ctid = this.endpoint_id + "-preset-map";
        var presetConfig = {
            name: "preset select",
            cmdPathTemplate: "/cgi-bin/aw_ptz?cmd=%%23R%02d&res=1",
            cmdResponseRE: "s(\\d\\d)",
            cmdQueryPath: "/cgi-bin/aw_ptz?cmd=%23S&res=1",
            cmdQueryResponseParseFn: function (data) {
                return HTTPCommand_1.HTTPCommand.matchIntToRE(data, /s(\d\d)/);
            },
            controlData: {
                _id: ctid,
                ctid: ctid,
                endpoint_id: this.endpoint_id,
                usertype: "awhe130-preset-map",
                name: "preset select",
                control_type: Control_1.Control.CONTROL_TYPE_INT,
                poll: 0,
                ephemeral: false,
                config: { "imageMap": "default" },
                value: 1
            }
        };
        this.commands[ctid] = new HTTPCommand_1.HTTPCommand(presetConfig);
        ctid = this.endpoint_id + "-preset-save";
        var presetSaveConfig = {
            name: "preset save",
            cmdPathTemplate: "/cgi-bin/aw_ptz?cmd=%%23M%02d&res=1",
            cmdQueryPath: "",
            cmdQueryResponseParseFn: function (data) { },
            cmdResponseRE: "s(\\d\\d)",
            controlData: {
                _id: ctid,
                ctid: ctid,
                endpoint_id: this.endpoint_id,
                usertype: "awhe130-preset",
                name: "preset save",
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
        this.commands[ctid] = new HTTPCommand_1.HTTPCommand(presetSaveConfig);
        ctid = this.endpoint_id + "-power";
        var powerConfig = {
            name: "power",
            cmdPathTemplate: "/cgi-bin/aw_ptz?cmd=%%23O%d&res=1",
            cmdResponseRE: "p(\\d)",
            cmdQueryPath: "/cgi-bin/aw_ptz?cmd=%23O&res=1",
            cmdQueryResponseParseFn: function (data) { return HTTPCommand_1.HTTPCommand.matchBoolToRE(data, /p(\d)/); },
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
        ctid = this.endpoint_id + "-zoom";
        var zoomConfig = {
            name: "zoom",
            cmdPathTemplate: "/cgi-bin/aw_ptz?cmd=%%23AXZ%3X&res=1",
            cmdResponseRE: "axz(\\w\\w\\w)",
            cmdQueryPath: "/cgi-bin/aw_ptz?cmd=%23GZ&res=1",
            cmdQueryResponseParseFn: function (data) {
                return HTTPCommand_1.HTTPCommand.matchHexIntToRE(data, /gz(\w\w\w)/);
            },
            controlData: {
                _id: ctid,
                ctid: ctid,
                endpoint_id: this.endpoint_id,
                usertype: Control_1.Control.USERTYPE_SLIDER,
                name: "Zoom",
                control_type: Control_1.Control.CONTROL_TYPE_RANGE,
                poll: 1,
                ephemeral: false,
                config: {
                    min: 1365,
                    max: 4095
                },
                value: 1365
            }
        };
        this.commands[ctid] = new HTTPCommand_1.HTTPCommand(zoomConfig);
        var parsePanTiltXY = function (data) {
            var matches = data.match(/aPC(\w\w\w\w)(\w\w\w\w)/);
            if (matches && matches.length == 3) {
                return new Control_1.ControlXYValue(parseInt(matches[1], 16), parseInt(matches[2], 16));
            }
        };
        ctid = this.endpoint_id + "-pan-tilt";
        var panTiltConfig = {
            name: "pan/tilt",
            cmdPathFunction: function (value) {
                var path = sprintf_js_1.sprintf("/cgi-bin/aw_ptz?cmd=%%23APC%4X%4X&res=1", value.x, value.y);
                return path;
            },
            cmdResponseRE: "aPC(\\w\\w\\w\\w\\w\\w\\w\\w)",
            cmdResponseParser: parsePanTiltXY,
            cmdQueryPath: "/cgi-bin/aw_ptz?cmd=%23APC&res=1",
            cmdQueryResponseParseFn: parsePanTiltXY,
            controlData: {
                _id: ctid,
                ctid: ctid,
                endpoint_id: this.endpoint_id,
                usertype: Control_1.Control.USERTYPE_SLIDER_2D,
                name: "Pan/Tilt",
                control_type: Control_1.Control.CONTROL_TYPE_XY,
                poll: 1,
                ephemeral: false,
                config: {
                    xMultiplier: 30,
                    xMin: 384,
                    xMax: 1800,
                    xName: "Pan",
                    yMin: 242,
                    yMax: 1213,
                    yName: "Tilt",
                    yMultiplier: 30
                },
                value: { x: 32000, y: 32000 }
            }
        };
        this.commands[ctid] = new HTTPCommand_1.HTTPCommand(panTiltConfig);
    };
    AWHE130Communicator.prototype.getControlTemplates = function () {
        // Build the control list from the defined commands
        // this populates controlsByCtid
        _super.prototype.getControlTemplates.call(this);
        // Add aditional controls that have no associated commands
        var ctid = this.endpoint_id + "-view";
        var viewControlData = {
            _id: ctid,
            ctid: ctid,
            endpoint_id: this.endpoint_id,
            usertype: Control_1.Control.USERTYPE_IMAGE,
            name: "View",
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            poll: 0,
            config: {
                path: "/cgi-bin/mjpeg?resolution=640x360&quality=1",
                proto: 'http'
            },
            value: ""
        };
        this.controlsByCtid[ctid] = new Control_1.Control(ctid, viewControlData);
        var linkCtid = this.endpoint_id + "-hyperlink";
        this.controlsByCtid[linkCtid] = new Control_1.Control(linkCtid, {
            _id: linkCtid,
            ctid: linkCtid,
            endpoint_id: this.endpoint_id,
            usertype: Control_1.Control.USERTYPE_HYPERLINK,
            name: "Device Web Interface",
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            poll: 0,
            config: {
                relativeUrl: "/live/index.html",
                proto: "http"
            },
            value: ""
        });
        return this.controlsByCtid;
    };
    return AWHE130Communicator;
}(HTTPCommunicator_1.HTTPCommunicator));
var communicator = new AWHE130Communicator();
module.exports = communicator;
//# sourceMappingURL=AWHE130Communicator.js.map