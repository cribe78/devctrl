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
        _super.apply(this, arguments);
    }
    F32Communicator.prototype.buildCommandList = function () {
        var f32Mnemonics = {
            Power: "POWR",
            Brightness: "BRIG",
            Shutter: "SHUT"
        };
        // Commands, as defined in pw392_communication_protocol.pdf
        var name = "Power";
        var cmd = "POWR";
        var command = {
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
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        name = "Power State";
        cmd = "POST";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " \\d{5}(\\d)",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            usertype: Control_1.Control.USERTYPE_SELECT_READONLY,
            templateConfig: {
                options: {
                    "0": "Deep Sleep",
                    "1": "Off",
                    "2": "Powering Up",
                    "3": "On",
                    "4": "Powering Down",
                    "5": "Critical Powering Down",
                    "6": "Critical Off"
                }
            },
            poll: 1,
            readonly: true
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        name = "Input";
        cmd = "IABS";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " \\d{5}(\\d)",
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            usertype: Control_1.Control.USERTYPE_SELECT,
            templateConfig: {
                options: {
                    "0": "VGA",
                    "1": "BNC",
                    "2": "DVI",
                    "4": "S-Video",
                    "5": "Composite",
                    "6": "Component",
                    "8": "HDMI"
                }
            },
            poll: 1
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        // IVGA, IDVI, etc. not implemented.  See IABS
        name = "Signal Status";
        cmd = "ISTS";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " \\d{5}(\\d)",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            usertype: Control_1.Control.USERTYPE_SELECT_READONLY,
            templateConfig: {
                options: {
                    "0": "Searching",
                    "1": "Locked to Source"
                }
            },
            poll: 1,
            readonly: true
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        name = "Brightness";
        cmd = "BRIG";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " (\\d{6})",
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_RANGE,
            usertype: Control_1.Control.USERTYPE_SLIDER,
            templateConfig: { min: 0, max: 100 },
            poll: 1
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        name = "Contrast";
        cmd = "CNTR";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " (\\d{6})",
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_RANGE,
            usertype: Control_1.Control.USERTYPE_SLIDER,
            templateConfig: { min: 0, max: 100 },
            poll: 1
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        // CSAT (Color) not implemented
        // VHUE (Hue Video) not implemented
        name = "Sharpness";
        cmd = "SHRP";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " (\\d{6})",
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_RANGE,
            usertype: Control_1.Control.USERTYPE_SLIDER,
            templateConfig: { min: 0, max: 20 },
            poll: 1
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        // PRST (Picture Reset) not implemented
        // AUTO (Auto) not implemented
        name = "Picture Mute";
        cmd = "PMUT";
        command = {
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
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        name = "Freeze Image";
        cmd = "FRZE";
        command = {
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
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        name = "Scaling";
        cmd = "SABS";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " \\d{5}(\\d)",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            usertype: Control_1.Control.USERTYPE_SELECT,
            templateConfig: {
                options: {
                    "0": "1:1",
                    "1": "Fill All",
                    "2": "Fill Aspect Ratio",
                    "3": "Fill 16:9",
                    "4": "Fill 4:3",
                    "9": "Fill LB to 16:9"
                }
            },
            poll: 1,
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        // S1T1 ... SANL scaling commands not implemented
        name = "Gamma";
        cmd = "GABS";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " \\d{5}(\\d)",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            usertype: Control_1.Control.USERTYPE_SELECT,
            templateConfig: {
                options: {
                    "0": "Film 1",
                    "1": "Film 2",
                    "2": "Video 1",
                    "3": "Video 2",
                    "7": "Computer 1",
                    "8": "Computer 2"
                }
            },
            poll: 1,
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        name = "Test Image";
        cmd = "TEST";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " \\d{5}(\\d)",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            usertype: Control_1.Control.USERTYPE_SELECT,
            templateConfig: {
                options: {
                    "0": "Off",
                    "1": "1",
                    "2": "2",
                    "3": "3",
                    "4": "4",
                }
            },
            poll: 1,
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        name = "Lamp Mode";
        cmd = "LMOD";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " \\d{5}(\\d)",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            usertype: Control_1.Control.USERTYPE_SELECT,
            templateConfig: {
                options: {
                    "0": "Lamp 1",
                    "1": "Lamp 2",
                    "2": "Dual Lamps",
                    "3": "Auto-switch"
                }
            },
            poll: 1,
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        name = "Focus In";
        cmd = "FOIN";
        command = {
            cmdStr: name,
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_INT,
            usertype: Control_1.Control.USERTYPE_F32_MULTIBUTTON,
            templateConfig: {},
            poll: 0,
            writeonly: true
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        name = "Focus Out";
        cmd = "FOUT";
        command = {
            cmdStr: name,
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_INT,
            usertype: Control_1.Control.USERTYPE_F32_MULTIBUTTON,
            templateConfig: { direction: "reverse" },
            poll: 0,
            writeonly: true
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        name = "OK";
        cmd = "NVOK";
        command = {
            cmdStr: name,
            cmdUpdateTemplate: ":" + cmd,
            cmdUpdateResponseTemplate: "%%001 " + cmd + " 000001",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_STRING,
            usertype: Control_1.Control.USERTYPE_BUTTON,
            templateConfig: {},
            poll: 0,
            writeonly: true
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
        name = "Shutter";
        cmd = "SHUT";
        command = {
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
        };
        this.commands[name] = new TCPCommand_1.TCPCommand(command);
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
                throw new Error("command not implemented");
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
    return F32Communicator;
}(TCPCommunicator_1.TCPCommunicator));
var communicator = new F32Communicator();
module.exports = communicator;
//# sourceMappingURL=F32Communicator.js.map