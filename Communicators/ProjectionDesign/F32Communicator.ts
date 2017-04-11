import {TCPCommunicator} from "../TCPCommunicator";
import {ITCPCommandConfig, TCPCommand} from "../TCPCommand";
import {Control} from "../../shared/Control";
import * as debugMod from "debug";
//let debug = debugMod("comms");
let debug = console.log;

class F32Communicator extends TCPCommunicator {
    buildCommandList() {
        // Commands, as defined in pw392_communication_protocol.pdf

        // Power
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

        // Source Selection
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



        let bccrOptions  = {
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
        this.registerSelectCommand("Color Mgmt Test Pattern", "CMTP",
            {
                0: "Off",
                1: "Red",
                2: "Green",
                3: "Blue",
                4: "White"
            }
        );
        this.registerSelectCommand("PW Test Patterns", "CMTG",
            {
                0: "Off",
                1: "Red",
                2: "Green",
                3: "Blue",
                4: "White",
                5: "Cyan",
                6: "Magenta",
                7: "Yellow",
                8: "Black"
            }
        );


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
        let osdcOptions = {
            0: "OSD Off",
            1: "OSD Show Warnings Only",
            2: "OSD On"
        };

        this.registerSelectCommand("OSD Enable", "OSDC", osdcOptions);
        this.registerSelectCommand("Test Image", "TEST",
            {
                "0" : "Off",
                "1" : "1",
                "2" : "2",
                "3" : "3",
                "4" : "4",
                5: "5",
                6: "6",
                7: "7"
            }
        );

        // Installation->Lamp
        this.registerSwitchCommand("Eco Mode", "ECOM");
        this.registerRangeCommand("Lamp 1 Power", "LPW1", 0, 8);
        this.registerRangeCommand("Lamp 2 Power", "LPW2", 0, 8);
        this.registerSelectCommand("Lamp Mode", "LMOD",
            {
                "0" : "Lamp 1",
                "1" : "Lamp 2",
                "2" : "Dual Lamps",
                "3" : "Auto-switch"
            }
        );
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
        let lstOptions = {
            0: "Broken",
            1: "Warming Up",
            2: "Lamp On",
            3: "Lamp Off",
            4: "Cooling down",
            5: "Lamp missing"
        };

        this.registerSelectCommand("Lamp 1 Remaining Time", "LRM1", {}, true);  // ok
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
                //throw new Error("command not implemented");
                return true;
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


    registerButtonCommand(name: string, cmd: string) {
        this.commands[name] = new TCPCommand(
            {
                cmdStr: name,
                cmdUpdateTemplate: ":" + cmd,
                cmdUpdateResponseTemplate: "%%001 " + cmd + " 00000(\d)",
                endpoint_id : this.config.endpoint._id,
                control_type: Control.CONTROL_TYPE_STRING,
                usertype: Control.USERTYPE_BUTTON,
                templateConfig : {},
                poll: 0,
                writeonly : true
            }
        );
    }

    registerExtStringCommand(name: string, cmd: string) {
        this.commands[name] = new TCPCommand(
            {
                cmdStr: name,
                cmdQueryStr: ":" + cmd + "?",
                cmdQueryResponseRE: "%001 " + cmd + " e00001 (.*)",
                endpoint_id : this.config.endpoint._id,
                control_type: Control.CONTROL_TYPE_STRING,
                usertype: Control.USERTYPE_SELECT_READONLY,
                templateConfig : {},
                poll: 1,
                readonly: true
            }
        );
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
            cmdQueryResponseRE: "%001 " + cmd + " 0{0,5}(\\d*)",
            cmdUpdateTemplate: ":" + cmd + " %06d",
            cmdUpdateResponseTemplate: "%%001 " + cmd + " %06d",
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