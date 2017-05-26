"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var debugMod = require("debug");
var TCPCommand_1 = require("../TCPCommand");
var Control_1 = require("../../shared/Control");
var SynchronousTCPCommunicator_1 = require("../SynchronousTCPCommunicator");
var debug = debugMod("comms");
var IA200Communicator = (function (_super) {
    __extends(IA200Communicator, _super);
    function IA200Communicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inputLineTerminator = '';
        _this.outputLineTerminator = '\n';
        return _this;
    }
    IA200Communicator.prototype.buildCommandList = function () {
        // Picture Settings
        this.commands["Brightness"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Brightness", "AAA", 0, 100));
        this.commands["Contrast"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Contrast", "AAB", 0, 100));
        this.commands["Sharpness"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Sharpness", "AAC", 0, 100));
        this.commands["Detail Enhancement"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Detail Enhancement", "AAD", 0, 100));
        // Input/Output Gamma skipped
        this.commands["Color"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Color", "AAI", 0, 100));
        this.commands["Hue"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Hue", "AAJ", 0, 360));
        // Aspect Ratio
        this.commands["Aspect Ratio"] = new TCPCommand_1.TCPCommand(this.selectCommandConfig("Aspect Ratio", "AB", {
            A: "Standard",
            B: "Full Screen",
            C: "Crop",
            D: "Anamorphic",
            E: "Flexview",
            F: "TheatreScope",
            G: "Squeeze"
        }));
        // Picture Position
        this.commands["Vertical Position"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Vertical Position", "ACA", -1, 400));
        this.commands["Horizontal Position"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Horizontal Position", "ACB", -1280, 1280));
        // Sync
        this.commands["Clock"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Clock", "AEA", 0, 200));
        this.commands["Phase"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Phase", "AEB", 0, 31));
        // Video Inputs
        this.commands["Video Input"] = new TCPCommand_1.TCPCommand(this.selectCommandConfig("Video Input", "BA", {
            A: "Component",
            B: "RGB",
            C: "DVI",
            D: "S-Video",
            E: "Composite",
            F: "SDI",
            G: "HDMI"
        }));
        // Info
        this.commands["Input Resolution"] = new TCPCommand_1.TCPCommand(this.infoControlConfig("Input Resolution", "EA"));
        this.commands["Input H frequency"] = new TCPCommand_1.TCPCommand(this.infoControlConfig("Input H frequency", "EB"));
        this.commands["Input V frequency"] = new TCPCommand_1.TCPCommand(this.infoControlConfig("Input V frequency", "EC"));
        this.commands["Output Mode"] = new TCPCommand_1.TCPCommand(this.infoControlConfig("Output Mode", "ED"));
        this.commands["Output Resolution"] = new TCPCommand_1.TCPCommand(this.infoControlConfig("Output Resolution", "EE"));
        this.commands["Output H frequency"] = new TCPCommand_1.TCPCommand(this.infoControlConfig("Output H frequency", "EF"));
        this.commands["Output F frequency"] = new TCPCommand_1.TCPCommand(this.infoControlConfig("Output F frequency", "EG"));
        this.commands["Sync Mode"] = new TCPCommand_1.TCPCommand(this.infoControlConfig("Sync Mode", "EH"));
        this.commands["Firmware Revision"] = new TCPCommand_1.TCPCommand(this.infoControlConfig("Firmware Revision", "EI"));
        this.commands["Serial Number"] = new TCPCommand_1.TCPCommand(this.infoControlConfig("Serial Number", "EJ"));
        this.commands["IP Address"] = new TCPCommand_1.TCPCommand(this.infoControlConfig("IP Address", "EK"));
        this.commands["FPGA revision"] = new TCPCommand_1.TCPCommand(this.infoControlConfig("FPGA revision", "EL"));
        this.commands["Standby Micro Rev. #"] = new TCPCommand_1.TCPCommand(this.infoControlConfig("Standby Micro Rev. #", "EM"));
        // Keystone
        this.commands["Keystone TL-H"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Keystone TL-H", "FAA", 0, 650));
        this.commands["Keystone TL-V"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Keystone TL-V", "FAB", 0, 650));
        this.commands["Keystone BL-H"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Keystone BL-H", "FAC", 0, 650));
        this.commands["Keystone BL-V"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Keystone BL-V", "FAD", -650, 0));
        this.commands["Keystone TR-H"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Keystone TR-H", "FAE", -650, 0));
        this.commands["Keystone TR-V"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Keystone TR-V", "FAF", 0, 650));
        this.commands["Keystone BR-H"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Keystone BR-H", "FAG", -650, 0));
        this.commands["Keystone BR-V"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Keystone BR-V", "FAH", -650, 0));
        // Advanced/Edge Blending
        this.commands["Bottom Edge Blending"] = new TCPCommand_1.TCPCommand(this.boolControlConfig("Bottom Edge Blending", "FFA"));
        this.commands["Left Edge Blending"] = new TCPCommand_1.TCPCommand(this.boolControlConfig("Left Edge Blending", "FFB"));
        this.commands["Right Edge Blending"] = new TCPCommand_1.TCPCommand(this.boolControlConfig("Right Edge Blending", "FFC"));
        this.commands["Top Edge Blending"] = new TCPCommand_1.TCPCommand(this.boolControlConfig("Top Edge Blending", "FFD"));
        this.commands["Bottom Edge Size"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Bottom Edge Size", "FFE", 0, 511));
        this.commands["Left Edge Size"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Left Edge Size", "FFF", 0, 511));
        this.commands["Right Edge Size"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Right Edge Size", "FFG", 0, 511));
        this.commands["Top Edge Size"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Top Edge Size", "FFH", 0, 511));
        this.commands["Red Brightness"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Red Brightness", "FFJ", 0, 100));
        this.commands["Green Brightness"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Green Brightness", "FFL", 0, 100));
        this.commands["Blue Brightness"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Blue Brightness", "FFM", 0, 100));
        this.commands["Contrast Red"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Contrast Red", "FFN", 0, 100));
        this.commands["Contrast Green"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Contrast Green", "FFO", 0, 100));
        this.commands["Contrast Blue"] = new TCPCommand_1.TCPCommand(this.rangeControlConfig("Contrast Blue", "FFP", 0, 100));
    };
    IA200Communicator.prototype.boolControlConfig = function (cmdStr, cmdCode) {
        return {
            cmdStr: cmdStr,
            cmdQueryStr: "A00R" + cmdCode,
            cmdQueryResponseRE: /V0{0,3}([\d-]*)/,
            cmdUpdateTemplate: "A00W" + cmdCode + "%04d00000",
            cmdUpdateResponseTemplate: "K",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_BOOLEAN,
            usertype: Control_1.Control.USERTYPE_SWITCH,
            poll: 1,
            templateConfig: {},
            readonly: true
        };
    };
    IA200Communicator.prototype.infoControlConfig = function (cmdStr, cmdCode) {
        return {
            cmdStr: cmdStr,
            cmdQueryStr: "A00R" + cmdCode,
            cmdQueryResponseRE: /v(.*)/,
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            usertype: Control_1.Control.USERTYPE_SELECT_READONLY,
            poll: 1,
            templateConfig: {},
            readonly: true
        };
    };
    IA200Communicator.prototype.rangeControlConfig = function (cmdStr, cmdCode, min, max) {
        return {
            cmdStr: cmdStr,
            cmdQueryStr: "A00R" + cmdCode,
            cmdQueryResponseRE: /V0{0,3}([\d-]*)/,
            cmdUpdateTemplate: "A00W" + cmdCode + "%04d00000",
            cmdUpdateResponseTemplate: "K",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_RANGE,
            usertype: Control_1.Control.USERTYPE_SLIDER,
            templateConfig: {
                min: min,
                max: max
            },
            poll: 1
        };
    };
    IA200Communicator.prototype.selectCommandConfig = function (cmdStr, cmdCode, options, writeonly) {
        if (writeonly === void 0) { writeonly = true; }
        return {
            cmdStr: cmdStr,
            cmdUpdateTemplate: "A00W" + cmdCode + "%s000000000",
            cmdUpdateResponseTemplate: "K",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            usertype: Control_1.Control.USERTYPE_SELECT,
            templateConfig: {
                options: options
            },
            poll: 0,
            writeonly: writeonly
        };
    };
    // Match one of the IA200 response codes and return it
    IA200Communicator.prototype.matchResponseCode = function () {
        var data = this.inputBuffer;
        if (data.length == 0) {
            return '';
        }
        if (data.charAt(0) == "K") {
            // ACK
            return "K";
        }
        else if (data.charAt(0) == "V") {
            // 4 digit number
            return data.slice(0, 5);
        }
        else if (data.charAt(0) == "E") {
            // Error
            return "E";
        }
        else if (data.charAt(0) == "v") {
            // A string
            if (data.search("\r") == -1) {
                // An incomplete string, wait for more
                return "";
            }
            var str = data.slice(0, data.search("\r") + 1);
            return str;
        }
        debug("Error: unmatched IA200 start char:" + data);
        this.inputBuffer = this.inputBuffer.slice(1);
        return '';
    };
    // The IA200 doesn't delineate between responses. Handle all potential responses in
    // custom onData handler
    IA200Communicator.prototype.onData = function (data) {
        var strData = String(data);
        this.inputBuffer += strData;
        var resp;
        while ((resp = this.matchResponseCode())) {
            this.processLine(resp);
            this.inputBuffer = this.inputBuffer.slice(resp.length);
            this.runNextCommand();
        }
    };
    return IA200Communicator;
}(SynchronousTCPCommunicator_1.SynchronousTCPCommunicator));
var communicator = new IA200Communicator();
module.exports = communicator;
//# sourceMappingURL=IA200Communicator.js.map