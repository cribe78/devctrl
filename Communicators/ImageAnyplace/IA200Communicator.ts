import {ITCPCommandConfig, TCPCommand} from "../TCPCommand";
import keys = require("core-js/fn/array/keys");
import {Control} from "../../app/shared/Control";
import {SynchronousTCPCommunicator} from "../SynchronousTCPCommunicator";
import {EndpointCommunicator} from "../EndpointCommunicator";

class IA200Communicator extends SynchronousTCPCommunicator {
    inputLineTerminator = '';
    outputLineTerminator = '\n';

    buildCommandList() {
        // Picture Settings
        this.commands["Brightness"] = new TCPCommand(
            this.rangeControlConfig("Brightness", "AAA", 0, 100));
        this.commands["Contrast"] = new TCPCommand(
            this.rangeControlConfig("Contrast", "AAB", 0, 100));
        this.commands["Sharpness"] = new TCPCommand(
            this.rangeControlConfig("Sharpness", "AAC", 0, 100));
        this.commands["Detail Enhancement"] = new TCPCommand(
            this.rangeControlConfig("Detail Enhancement", "AAD", 0, 100));
        // Input/Output Gamma skipped
        this.commands["Color"] = new TCPCommand(
            this.rangeControlConfig("Color", "AAI", 0, 100));
        this.commands["Hue"] = new TCPCommand(
            this.rangeControlConfig("Hue", "AAJ", 0, 360));

        // Aspect Ratio
        this.commands["Aspect Ratio"] = new TCPCommand(
            this.selectCommandConfig("Aspect Ratio", "AB",
                {
                    A: "Standard",
                    B: "Full Screen",
                    C: "Crop",
                    D: "Anamorphic",
                    E: "Flexview",
                    F: "TheatreScope",
                    G: "Squeeze"
                }
            )
        );

        // Picture Position
        this.commands["Vertical Position"] = new TCPCommand(
            this.rangeControlConfig("Vertical Position", "ACA", -1, 400));
        this.commands["Horizontal Position"] = new TCPCommand(
            this.rangeControlConfig("Horizontal Position", "ACB", -1280, 1280));

        // Sync
        this.commands["Clock"] = new TCPCommand(
            this.rangeControlConfig("Clock", "AEA", 0, 200));
        this.commands["Phase"] = new TCPCommand(
            this.rangeControlConfig("Phase", "AEB", 0, 31));

        // Video Inputs
        this.commands["Video Input"] = new TCPCommand(
            this.selectCommandConfig("Video Input", "BA",
                {
                    A : "Component",
                    B : "RGB",
                    C : "DVI",
                    D : "S-Video",
                    E : "Composite",
                    F : "SDI",
                    G : "HDMI"
                }
            )
        );

        // Info
        this.commands["Input Resolution"] = new TCPCommand(
            this.infoControlConfig("Input Resolution", "EA")
        );
        this.commands["Input H frequency"] = new TCPCommand(
            this.infoControlConfig("Input H frequency", "EB")
        );
        this.commands["Input V frequency"] = new TCPCommand(
            this.infoControlConfig("Input V frequency", "EC")
        );
        this.commands["Output Mode"] = new TCPCommand(
            this.infoControlConfig("Output Mode", "ED")
        );
        this.commands["Output Resolution"] = new TCPCommand(
            this.infoControlConfig("Output Resolution", "EE")
        );
        this.commands["Output H frequency"] = new TCPCommand(
            this.infoControlConfig("Output H frequency", "EF")
        );
        this.commands["Output F frequency"] = new TCPCommand(
            this.infoControlConfig("Output F frequency", "EG")
        );
        this.commands["Sync Mode"] = new TCPCommand(
            this.infoControlConfig("Sync Mode", "EH")
        );
        this.commands["Firmware Revision"] = new TCPCommand(
            this.infoControlConfig("Firmware Revision", "EI")
        );
        this.commands["Serial Number"] = new TCPCommand(
            this.infoControlConfig("Serial Number", "EJ")
        );
        this.commands["IP Address"] = new TCPCommand(
            this.infoControlConfig("IP Address", "EK")
        );
        this.commands["FPGA revision"] = new TCPCommand(
            this.infoControlConfig("FPGA revision", "EL")
        );
        this.commands["Standby Micro Rev. #"] = new TCPCommand(
            this.infoControlConfig("Standby Micro Rev. #", "EM")
        );

        // Keystone
        this.commands["Keystone TL-H"] = new TCPCommand(
            this.rangeControlConfig("Keystone TL-H", "FAA", 0, 650));
        this.commands["Keystone TL-V"] = new TCPCommand(
            this.rangeControlConfig("Keystone TL-V", "FAB", 0, 650));
        this.commands["Keystone BL-H"] = new TCPCommand(
            this.rangeControlConfig("Keystone BL-H", "FAC", 0, 650));
        this.commands["Keystone BL-V"] = new TCPCommand(
            this.rangeControlConfig("Keystone BL-V", "FAD", -650, 0));
        this.commands["Keystone TR-H"] = new TCPCommand(
            this.rangeControlConfig("Keystone TR-H", "FAE", -650, 0));
        this.commands["Keystone TR-V"] = new TCPCommand(
            this.rangeControlConfig("Keystone TR-V", "FAF", 0, 650));
        this.commands["Keystone BR-H"] = new TCPCommand(
            this.rangeControlConfig("Keystone BR-H", "FAG", -650, 0));
        this.commands["Keystone BR-V"] = new TCPCommand(
            this.rangeControlConfig("Keystone BR-V", "FAH", -650, 0));

        // Advanced/Edge Blending
        this.commands["Bottom Edge Blending"] = new TCPCommand(
            this.boolControlConfig("Bottom Edge Blending", "FFA"));
        this.commands["Left Edge Blending"] = new TCPCommand(
            this.boolControlConfig("Left Edge Blending", "FFB"));
        this.commands["Right Edge Blending"] = new TCPCommand(
            this.boolControlConfig("Right Edge Blending", "FFC"));
        this.commands["Top Edge Blending"] = new TCPCommand(
            this.boolControlConfig("Top Edge Blending", "FFD"));
        this.commands["Bottom Edge Size"] = new TCPCommand(
            this.rangeControlConfig("Bottom Edge Size", "FFE", 0, 511));
        this.commands["Left Edge Size"] = new TCPCommand(
            this.rangeControlConfig("Left Edge Size", "FFF", 0, 511));
        this.commands["Right Edge Size"] = new TCPCommand(
            this.rangeControlConfig("Right Edge Size", "FFG", 0, 511));
        this.commands["Top Edge Size"] = new TCPCommand(
            this.rangeControlConfig("Top Edge Size", "FFH", 0, 511));
        this.commands["Red Brightness"] = new TCPCommand(
            this.rangeControlConfig("Red Brightness", "FFJ", 0, 100));
        this.commands["Green Brightness"] = new TCPCommand(
            this.rangeControlConfig("Green Brightness", "FFL", 0, 100));
        this.commands["Blue Brightness"] = new TCPCommand(
            this.rangeControlConfig("Blue Brightness", "FFM", 0, 100));
        this.commands["Contrast Red"] = new TCPCommand(
            this.rangeControlConfig("Contrast Red", "FFN", 0, 100));
        this.commands["Contrast Green"] = new TCPCommand(
            this.rangeControlConfig("Contrast Green", "FFO", 0, 100));
        this.commands["Contrast Blue"] = new TCPCommand(
            this.rangeControlConfig("Contrast Blue", "FFP", 0, 100));
    }


    boolControlConfig(cmdStr: string, cmdCode: string) : ITCPCommandConfig {
        return {
            cmdStr: cmdStr,
            cmdQueryStr: "A00R" + cmdCode,
            cmdQueryResponseRE: /V0{0,3}([\d-]*)/,
            cmdUpdateTemplate: "A00W" + cmdCode + "%04d00000",
            cmdUpdateResponseTemplate: "K",
            endpoint_id: this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_BOOLEAN,
            usertype: Control.USERTYPE_SWITCH,
            poll: 1,
            templateConfig: {},
            readonly : true
        }
    }

    infoControlConfig(cmdStr: string, cmdCode: string) : ITCPCommandConfig {
        return {
            cmdStr: cmdStr,
            cmdQueryStr: "A00R" + cmdCode,
            cmdQueryResponseRE: /v(.*)/,
            endpoint_id : this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: Control.USERTYPE_SELECT_READONLY,
            poll: 1,
            templateConfig: {},
            readonly : true
        }
    }

    rangeControlConfig(cmdStr: string, cmdCode: string, min: number, max: number) : ITCPCommandConfig {
        return {
            cmdStr: cmdStr,
            cmdQueryStr: "A00R" + cmdCode,
            cmdQueryResponseRE: /V0{0,3}([\d-]*)/,
            cmdUpdateTemplate: "A00W" + cmdCode + "%04d00000",
            cmdUpdateResponseTemplate: "K",
            endpoint_id: this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_RANGE,
            usertype: Control.USERTYPE_SLIDER,
            templateConfig: {
                min: min,
                max: max
            },
            poll: 1
        }
    }


    selectCommandConfig(cmdStr: string, cmdCode: string, options: any, writeonly = true) : ITCPCommandConfig {
        return {
            cmdStr: cmdStr,
            cmdUpdateTemplate: "A00W" + cmdCode + "%s000000000",
            cmdUpdateResponseTemplate: "K",
            endpoint_id: this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: Control.USERTYPE_SELECT,
            templateConfig: {
                options: options
            },
            poll: 0,
            writeonly: writeonly
        }
    }

    // Match one of the IA200 response codes and return it
    matchResponseCode() {
        let data = this.inputBuffer;

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

            let str = data.slice(0, data.search("\r") + 1);
            return str;
        }

        this.log("Error: unmatched IA200 start char:" + data, EndpointCommunicator.LOG_MATCHING);
        this.inputBuffer = this.inputBuffer.slice(1);

        return '';
    }

    // The IA200 doesn't delineate between responses. Handle all potential responses in
    // custom onData handler
    onData(data: any) {
        let strData = String(data);
        this.inputBuffer += strData;

        let resp;
        while ((resp = this.matchResponseCode())) {
            this.processLine(resp);
            this.inputBuffer = this.inputBuffer.slice(resp.length);
            this.runNextCommand();
        }
    }
}

let communicator = new IA200Communicator();
module.exports = communicator;