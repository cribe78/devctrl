import {TCPCommunicator} from "../TCPCommunicator";
import {ITCPCommandConfig, TCPCommand} from "../TCPCommand";
import {Control} from "../../shared/Control";
import * as debugMod from "debug";
//let debug = debugMod("comms");
let debug = console.log;

class F32Communicator extends TCPCommunicator {
    buildCommandList() {
        // Commands, as defined in pw392_communication_protocol.pdf

        this.registerSwitchCommand("Power", "POWR");
        this.registerSelectCommand("Power State", "POST",
            {
                "0" : "Deep Sleep",
                "1" : "Off",
                "2" : "Powering Up",
                "3" : "On",
                "4" : "Powering Down",
                "5" : "Critical Powering Down",
                "6" : "Critical Off"
            },
            true
        );
        this.registerSelectCommand("Input", "IABS",
            {
                "0" : "VGA",
                "1" : "BNC",
                "2" : "DVI",
                "4" : "S-Video",
                "5" : "Composite",
                "6" : "Component",
                "8" : "HDMI"
            }
        );

        // IVGA, IDVI, etc. not implemented.  See IABS

        this.registerSelectCommand("Signal Status", "ISTS",
            {
                "0" : "Searching",
                "1" : "Locked to Source"
            },
            true
        );
        this.registerRangeCommand("Brightness", "BRIG");
        this.registerRangeCommand("Contrast", "CNTR");

        // CSAT (Color) not implemented
        // VHUE (Hue Video) not implemented

        this.registerRangeCommand("Sharpness", "SHRP", 0, 20);

        // PRST (Picture Reset) not implemented
        // AUTO (Auto) not implemented

        this.registerSwitchCommand("Picture Mute", "PMUT");
        this.registerSwitchCommand("Freeze Image", "FRZE");
        this.registerSelectCommand("Scaling", "SABS",
            {
                "0" : "1:1",
                "1" : "Fill All",
                "2" : "Fill Aspect Ratio",
                "3" : "Fill 16:9",
                "4" : "Fill 4:3",
                "9" : "Fill LB to 16:9"
            }
        );

        // S1T1 ... SANL scaling commands not implemented

        this.registerSelectCommand("Gamma", "GABS",
            {
                "0" : "Film 1",
                "1" : "Film 2",
                "2" : "Video 1",
                "3" : "Video 2",
                "7" : "Computer 1",
                "8" : "Computer 2"
            }
        );
        this.registerSelectCommand("Test Image", "TEST",
            {
                "0" : "Off",
                "1" : "1",
                "2" : "2",
                "3" : "3",
                "4" : "4",
            }
        );
        this.registerSelectCommand("Lamp Mode", "LMOD",
            {
                "0" : "Lamp 1",
                "1" : "Lamp 2",
                "2" : "Dual Lamps",
                "3" : "Auto-switch"
            }
        );

        this.registerMultibuttonCommand("Focus In", "FOIN");
        this.registerMultibuttonCommand("Focus Out", "FOUT", "reverse");

        let name = "OK";
        let cmd = "NVOK";
        this.commands[name] = new TCPCommand({
            cmdStr: name,
            cmdUpdateTemplate: ":" + cmd,
            cmdUpdateResponseTemplate: "%%001 " + cmd + " 000001",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: Control.USERTYPE_BUTTON,
            templateConfig : {},
            poll: 0,
            writeonly : true
        });


        this.registerSwitchCommand("Shutter", "SHUT");
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
        if (line.indexOf("(Not Available)") !== -1) {
            // This is the continuation of an error which should be handled with
            // the previous line
            return '';
        }

        // Lines have extra carriage returns that screw up debug printing
        return line.replace(/\r/g,'');
    }


    registerMultibuttonCommand(name: string, cmd: string, direction = "default") {
        this.commands[name] = new TCPCommand({
            cmdStr: name,
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_INT,
            usertype: Control.USERTYPE_F32_MULTIBUTTON,
            templateConfig : { direction: direction },
            poll: 0,
            writeonly: true
        });
    }

    registerRangeCommand(name: string, cmd: string, min = 0, max = 100) {
        this.commands[name] = new TCPCommand(
            {
                cmdStr: name,
                cmdQueryStr: ":" + cmd + "?",
                cmdQueryResponseRE: "%001 " + cmd + " (\\d{6})",
                cmdUpdateTemplate: ":" + cmd + " %06d",
                cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
                endpoint_id : this.config.endpoint._id,
                control_type: Control.CONTROL_TYPE_RANGE,
                usertype: Control.USERTYPE_SLIDER,
                templateConfig : { min: min, max: max },
                poll: 1
            }
        );
    }

    registerSelectCommand(name: string, cmd: string, options: any, readonly = false) {
        let usertype = readonly ? Control.USERTYPE_SELECT_READONLY : Control.USERTYPE_SELECT;

        this.commands[name] = new TCPCommand({
            cmdStr: name,
            cmdQueryStr: ":" + cmd + "?",
            cmdQueryResponseRE: "%001 " + cmd + " \\d{5}(\\d)",
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: usertype,
            templateConfig : {
                options: options
            },
            readonly: readonly,
            poll: 1
        });
    }

    registerSwitchCommand(name: string, cmd: string) {
        this.commands[name] = new TCPCommand({
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
        });
    }
}

let communicator = new F32Communicator();
module.exports = communicator;