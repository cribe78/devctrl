"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TCPCommunicator_1 = require("../TCPCommunicator");
var TCPCommand_1 = require("../TCPCommand");
var Control_1 = require("../../shared/Control");
//let debug = debugMod("comms");
var debug = console.log;
var F32Communicator = (function (_super) {
    __extends(F32Communicator, _super);
    function F32Communicator() {
        return _super.apply(this, arguments) || this;
    }
    F32Communicator.prototype.buildCommandList = function () {
        // Commands, as defined in pw392_communication_protocol.pdf
        // Power
        this.registerSwitchCommand("Power", "POWR");
        this.registerSelectCommand("Power State", "POST", {
            "0": "Deep Sleep",
            "1": "Off",
            "2": "Powering Up",
            "3": "On",
            "4": "Powering Down",
            "5": "Critical Powering Down",
            "6": "Critical Off"
        }, true);
        // Source Selection
        this.registerSelectCommand("Input", "IABS", {
            "0": "VGA",
            "1": "BNC",
            "2": "DVI",
            "4": "S-Video",
            "5": "Composite",
            "6": "Component",
            "8": "HDMI"
        });
        // IVGA, IDVI, etc. not implemented.  See IABS
        this.registerSelectCommand("Signal Status", "ISTS", {
            "0": "Searching",
            "1": "Locked to Source"
        }, true);
        // Picture
        this.registerRangeCommand("Brightness", "BRIG");
        this.registerRangeCommand("Contrast", "CNTR");
        // CSAT (Color) not implemented on F32
        // VHUE (Hue Video) not implemented on F32
        this.registerRangeCommand("Sharpness", "SHRP", 0, 20);
        // PRST (Picture Reset) not implemented
        // AUTO (Auto) not implemented
        this.registerSwitchCommand("Picture Mute", "PMUT");
        this.registerSwitchCommand("Freeze Image", "FRZE");
        this.registerSelectCommand("Scaling", "SABS", {
            "0": "1:1",
            "1": "Fill All",
            "2": "Fill Aspect Ratio",
            "3": "Fill 16:9",
            "4": "Fill 4:3",
            "9": "Fill LB to 16:9"
        });
        // S1T1 ... SANL scaling commands not implemented
        this.registerSelectCommand("Gamma", "GABS", {
            "0": "Film 1",
            "1": "Film 2",
            "2": "Video 1",
            "3": "Video 2",
            "7": "Computer 1",
            "8": "Computer 2"
        });
        var bccrOptions = {
            0: "Off",
            1: "Computer Balanced",
            2: "Video Balanced",
            3: "Computer Native",
            4: "Video Native"
        };
        this.registerSelectCommand("Brilliant Color Control", "BCCR", bccrOptions);
        // BCMO not implemented
        // BCPR not implemented
        this.registerRangeCommand("Brilliant Color Boost", "WPEK", 0, 10);
        this.registerRangeCommand("Color Mgmt X Coord", "CMXV", 200, 500);
        //TODO CMYV
        this.registerRangeCommand("Color Mgmt Temp", "CMTV", 3200, 9300);
        // DS** not implemented
        // MS** implemented, maybe later
        this.registerSelectCommand("Color Mgmt Test Pattern", "CMTP", {
            0: "Off",
            1: "Red",
            2: "Green",
            3: "Blue",
            4: "White"
        });
        this.registerSelectCommand("PW Test Patterns", "CMTG", {
            0: "Off",
            1: "Red",
            2: "Green",
            3: "Blue",
            4: "White",
            5: "Cyan",
            6: "Magenta",
            7: "Yellow",
            8: "Black"
        });
        // Picture->RealColor->Display Customization
        this.registerRangeCommand("Red Offset", "BRED", -500, 500);
        this.registerRangeCommand("Green Offset", "BGRE", -500, 500);
        this.registerRangeCommand("Blue Offset", "BBLU", -500, 500);
        this.registerRangeCommand("Red Gain", "CRED", 50, 150);
        this.registerRangeCommand("Green Gain", "CRED", 50, 150);
        this.registerRangeCommand("Blue Gain", "CRED", 50, 150);
        // Picture->Advanced
        // VPOS not implemented
        // HPOS not implemented
        // PHSE not implemented
        // ...
        // Picture Enhancement
        // DLTI maybe later
        // DCTI ?
        //Installation
        var osdcOptions = {
            0: "OSD Off",
            1: "OSD Show Warnings Only",
            2: "OSD On"
        };
        this.registerSelectCommand("OSD Enable", "OSDC", osdcOptions);
        this.registerSelectCommand("Test Image", "TEST", {
            "0": "Off",
            "1": "1",
            "2": "2",
            "3": "3",
            "4": "4",
            5: "5",
            6: "6",
            7: "7"
        });
        // Installation->Lamp
        this.registerSwitchCommand("Eco Mode", "ECOM");
        this.registerRangeCommand("Lamp 1 Power", "LPW1", 0, 8);
        this.registerRangeCommand("Lamp 2 Power", "LPW2", 0, 8);
        this.registerSelectCommand("Lamp Mode", "LMOD", {
            "0": "Lamp 1",
            "1": "Lamp 2",
            "2": "Dual Lamps",
            "3": "Auto-switch"
        });
        // LDLY maybe later
        // Lens Control
        this.registerMultibuttonCommand("Focus In", "FOIN");
        this.registerMultibuttonCommand("Focus Out", "FOUT", "reverse");
        this.registerMultibuttonCommand("Zoom In", "ZOIN");
        this.registerMultibuttonCommand("Zoom Out", "ZOUT", "reverse");
        this.registerMultibuttonCommand("Iris Open", "IROP");
        this.registerMultibuttonCommand("Iris Close", "IRCL");
        this.registerMultibuttonCommand("Lens Shift Down", "LSDW", "reverse");
        this.registerMultibuttonCommand("Lens Shift Up", "LSUP");
        this.registerMultibuttonCommand("Lens Shift Left", "LSLF", "reverse");
        this.registerMultibuttonCommand("Lens Shift Right", "LSRH");
        this.registerSwitchCommand("Shutter", "SHUT");
        // Lamp Status
        var lstOptions = {
            0: "Broken",
            1: "Warming Up",
            2: "Lamp On",
            3: "Lamp Off",
            4: "Cooling down",
            5: "Lamp missing"
        };
        this.registerSelectCommand("Lamp 1 Remaining Time", "LRM1", {}, true); // ok
        this.registerSelectCommand("Lamp 1 Runtime", "LTR1", {}, true);
        this.registerSelectCommand("Lamp Channel 1 Total Time", "LHO1", {}, true);
        this.registerSelectCommand("Lamp 1 Status", "LST1", lstOptions, true);
        this.registerSelectCommand("Lamp 2 Remaining Time", "LRM2", {}, true);
        this.registerSelectCommand("Lamp 2 Runtime", "LTR2", {}, true);
        this.registerSelectCommand("Lamp Channel 2 Total Time", "LHO2", {}, true);
        this.registerSelectCommand("Lamp 2 Status", "LST2", lstOptions, true);
        this.registerSelectCommand("Unit Total Time", "UTOT", {}, true);
        // Menu navigation
        this.registerButtonCommand("Menu", "MENU");
        this.registerButtonCommand("Up", "NVUP");
        this.registerButtonCommand("Down", "NVDW");
        this.registerButtonCommand("Left", "NVLF");
        this.registerButtonCommand("Right", "NVRH");
        this.registerButtonCommand("OK", "NVOK");
        // Miscellaneous
        this.registerExtStringCommand("OSD Message", "MESS");
        this.registerExtStringCommand("Projector ID", "NAME");
        // Thermal
        //
        // Status
        this.registerExtStringCommand("Platform Name", "PLAT");
        this.registerExtStringCommand("Serial Number", "SERI");
        this.registerExtStringCommand("Model Name", "MODL");
        this.registerExtStringCommand("Part Number", "PART");
        this.registerExtStringCommand("Software Version", "SVER");
        this.registerExtStringCommand("SVN SW  Revision", "SWSN");
    };
    F32Communicator.prototype.matchLineToError = function (line) {
        var matches = line.match(/(\w{4}) !0000(\d)/);
        if (matches) {
            if (matches[2] == "1") {
                debug("Error: Access Denied for command " + matches[1]);
                return true;
            }
            else if (matches[2] == "2") {
                debug("Error: Command not available: " + matches[1]);
                return true;
            }
            else if (matches[2] == "3") {
                debug("Error: Command not implemented: " + matches[1]);
                //throw new Error("command not implemented");
                return true;
            }
            else if (matches[2] == "4") {
                debug("Error: value out of range: " + matches[1]);
                return true;
            }
        }
    };
    F32Communicator.prototype.preprocessLine = function (line) {
        if (line.indexOf("(Not Available)") !== -1) {
            // This is the continuation of an error which should be handled with
            // the previous line
            return '';
        }
        // Lines have extra carriage returns that screw up debug printing
        return line.replace(/\r/g, '');
    };
    F32Communicator.prototype.registerButtonCommand = function (name, cmd) {
        this.commands[name] = new TCPCommand_1.TCPCommand({
            cmdStr: name,
            cmdUpdateTemplate: ":" + cmd,
            cmdUpdateResponseTemplate: "%%001 " + cmd + " 00000(\d)",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            usertype: Control_1.Control.USERTYPE_BUTTON,
            templateConfig: {},
            poll: 0,
            writeonly: true
        });
    };
    F32Communicator.prototype.registerExtStringCommand = function (name, cmd) {
        this.commands[name] = new TCPCommand_1.TCPCommand({
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " e00001 (.*)",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            usertype: Control_1.Control.USERTYPE_SELECT_READONLY,
            templateConfig: {},
            poll: 1,
            readonly: true
        });
    };
    F32Communicator.prototype.registerMultibuttonCommand = function (name, cmd, direction) {
        if (direction === void 0) { direction = "default"; }
        this.commands[name] = new TCPCommand_1.TCPCommand({
            cmdStr: name,
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_INT,
            usertype: Control_1.Control.USERTYPE_F32_MULTIBUTTON,
            templateConfig: { direction: direction },
            poll: 0,
            writeonly: true
        });
    };
    F32Communicator.prototype.registerRangeCommand = function (name, cmd, min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 100; }
        this.commands[name] = new TCPCommand_1.TCPCommand({
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " (\\d{6})",
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_RANGE,
            usertype: Control_1.Control.USERTYPE_SLIDER,
            templateConfig: { min: min, max: max },
            poll: 1
        });
    };
    F32Communicator.prototype.registerSelectCommand = function (name, cmd, options, readonly) {
        if (readonly === void 0) { readonly = false; }
        var usertype = readonly ? Control_1.Control.USERTYPE_SELECT_READONLY : Control_1.Control.USERTYPE_SELECT;
        this.commands[name] = new TCPCommand_1.TCPCommand({
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " 0{0,5}(\\d*)",
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            usertype: usertype,
            templateConfig: {
                options: options
            },
            readonly: readonly,
            poll: 1
        });
    };
    F32Communicator.prototype.registerSwitchCommand = function (name, cmd) {
        this.commands[name] = new TCPCommand_1.TCPCommand({
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " (\\d{6})",
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_BOOLEAN,
            usertype: Control_1.Control.USERTYPE_SWITCH,
            templateConfig: {},
            poll: 1
        });
    };
    return F32Communicator;
}(TCPCommunicator_1.TCPCommunicator));
var communicator = new F32Communicator();
module.exports = communicator;
//# sourceMappingURL=F32Communicator.js.map