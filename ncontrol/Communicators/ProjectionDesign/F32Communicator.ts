import {TCPCommunicator} from "../TCPCommunicator";
import {ITCPCommandConfig, TCPCommand} from "../TCPCommand";
import {Control} from "../../shared/Control";
import * as debugMod from "debug";
let debug = debugMod("comms");

class F32Communicator extends TCPCommunicator {
    buildCommandList() {
        let f32Mnemonics = {
            Power: "POWR",
            Brightness: "BRIG",
            Shutter: "SHUT"
        };

        // Commands, as defined in pw392_communication_protocol.pdf

        let name = "Power";
        let cmd = "POWR";
        let command : ITCPCommandConfig = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " (\\d{6})",
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_BOOLEAN,
            usertype: Control.USERTYPE_SWITCH,
            templateConfig : {},
            poll: 1
        };
        this.commands[name] = new TCPCommand(command);

        name = "Power State";
        cmd = "POST";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " \\d{5}(\\d)",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: Control.USERTYPE_SELECT_READONLY,
            templateConfig : {
                options : {
                    "0" : "Deep Sleep",
                    "1" : "Off",
                    "2" : "Powering Up",
                    "3" : "On",
                    "4" : "Powering Down",
                    "5" : "Critical Powering Down",
                    "6" : "Critical Off"
                }
            },
            poll: 1,
            readonly : true
        };
        this.commands[name] = new TCPCommand(command);

        name = "Input";
        cmd = "IABS";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " \\d{5}(\\d)",
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: Control.USERTYPE_SELECT,
            templateConfig : {
                options : {
                    "0" : "VGA",
                    "1" : "BNC",
                    "2" : "DVI",
                    "4" : "S-Video",
                    "5" : "Composite",
                    "6" : "Component",
                    "8" : "HDMI"
                }
            },
            poll: 1
        };
        this.commands[name] = new TCPCommand(command);

        // IVGA, IDVI, etc. not implemented.  See IABS


        name = "Signal Status";
        cmd = "ISTS";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " \\d{5}(\\d)",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: Control.USERTYPE_SELECT_READONLY,
            templateConfig : {
                options: {
                    "0" : "Searching",
                    "1" : "Locked to Source"
                }
            },
            poll: 1,
            readonly : true
        };
        this.commands[name] = new TCPCommand(command);

        name = "Brightness";
        cmd = "BRIG";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " (\\d{6})",
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_RANGE,
            usertype: Control.USERTYPE_SLIDER,
            templateConfig : { min: 0, max: 100 },
            poll: 1
        };
        this.commands[name] = new TCPCommand(command);

        name = "Contrast";
        cmd = "CNTR";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " (\\d{6})",
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_RANGE,
            usertype: Control.USERTYPE_SLIDER,
            templateConfig : { min: 0, max: 100 },
            poll: 1
        };
        this.commands[name] = new TCPCommand(command);

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
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_RANGE,
            usertype: Control.USERTYPE_SLIDER,
            templateConfig : { min: 0, max: 20 },
            poll: 1
        };
        this.commands[name] = new TCPCommand(command);

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
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_BOOLEAN,
            usertype: Control.USERTYPE_SWITCH,
            templateConfig : {},
            poll: 1
        };
        this.commands[name] = new TCPCommand(command);


        name = "Freeze Image";
        cmd = "FRZE";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " (\\d{6})",
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_BOOLEAN,
            usertype: Control.USERTYPE_SWITCH,
            templateConfig : {},
            poll: 1
        };
        this.commands[name] = new TCPCommand(command);

        name = "Scaling";
        cmd = "SABS";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " \\d{5}(\\d)",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: Control.USERTYPE_SELECT,
            templateConfig : {
                options: {
                    "0" : "1:1",
                    "1" : "Fill All",
                    "2" : "Fill Aspect Ratio",
                    "3" : "Fill 16:9",
                    "4" : "Fill 4:3",
                    "9" : "Fill LB to 16:9"
                }
            },
            poll: 1,
        };
        this.commands[name] = new TCPCommand(command);

        // S1T1 ... SANL scaling commands not implemented

        name = "Gamma";
        cmd = "GABS";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " \\d{5}(\\d)",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: Control.USERTYPE_SELECT,
            templateConfig : {
                options: {
                    "0" : "Film 1",
                    "1" : "Film 2",
                    "2" : "Video 1",
                    "3" : "Video 2",
                    "7" : "Computer 1",
                    "8" : "Computer 2"
                }
            },
            poll: 1,
        };
        this.commands[name] = new TCPCommand(command);

        name = "Test Image";
        cmd = "TEST";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " \\d{5}(\\d)",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: Control.USERTYPE_SELECT,
            templateConfig : {
                options: {
                    "0" : "Off",
                    "1" : "1",
                    "2" : "2",
                    "3" : "3",
                    "4" : "4",
                }
            },
            poll: 1,
        };
        this.commands[name] = new TCPCommand(command);

        name = "Lamp Mode";
        cmd = "LMOD";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " \\d{5}(\\d)",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: Control.USERTYPE_SELECT,
            templateConfig : {
                options: {
                    "0" : "Lamp 1",
                    "1" : "Lamp 2",
                    "2" : "Dual Lamps",
                    "3" : "Auto-switch"
                }
            },
            poll: 1,
        };
        this.commands[name] = new TCPCommand(command);

        name = "Focus In";
        cmd = "FOIN";
        command = {
            cmdStr: name,
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_INT,
            usertype: Control.USERTYPE_F32_MULTIBUTTON,
            templateConfig : {},
            poll: 0,
            writeonly: true
        };
        this.commands[name] = new TCPCommand(command);

        name = "Focus Out";
        cmd = "FOUT";
        command = {
            cmdStr: name,
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_INT,
            usertype: Control.USERTYPE_F32_MULTIBUTTON,
            templateConfig : { direction: "reverse" },
            poll: 0,
            writeonly: true
        };
        this.commands[name] = new TCPCommand(command);


        name = "Shutter";
        cmd = "SHUT";
        command = {
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " (\\d{6})",
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_BOOLEAN,
            usertype: Control.USERTYPE_SWITCH,
            templateConfig : {},
            poll: 1
        };
        this.commands[name] = new TCPCommand(command);
    }

    matchLineToError(line) {
        let matches = line.match(/(\w{4}) !0000(\d)/);

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
    }

    preprocessLine(line) {
        // Lines have extra carriage returns that screw up debug printing
        return line.replace(/\r/g,'');
    }
}

let communicator = new F32Communicator();
module.exports = communicator;