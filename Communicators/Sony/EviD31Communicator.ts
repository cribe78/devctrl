import {TCPCommunicator, TCPCommEncoding} from "../TCPCommunicator";
import {ITCPCommandConfig} from "../TCPCommand";
import {EviD31Command} from "./EviD31Command";
import {Control} from "../../app/shared/Control";
import {SynchronousTCPCommunicator} from "../SynchronousTCPCommunicator";

class EviD31Communicator extends SynchronousTCPCommunicator {

    constructor() {
        super();
        this.inputLineTerminator = "ff";
        this.outputLineTerminator = "ff";
        this.commsMode = "hex";
    }

    buildCommandList() {
        let irisConfig : ITCPCommandConfig = {
            cmdStr: "Iris",
            cmdQueryStr: "8109044B",
            cmdQueryResponseRE: /\w050(\w{8})/,
            cmdUpdateTemplate: "8101044BZZZZ",
            cmdUpdateResponseTemplate: "905\\d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_RANGE,
            usertype: Control.USERTYPE_SLIDER,
            templateConfig: {
                min: 0,
                max: 17
            },
            poll: 1
        };


        this.commands[irisConfig.cmdStr] = new EviD31Command(irisConfig);

        let panTiltConfig : ITCPCommandConfig = {
            cmdStr: "Pan/Tilt",
            cmdQueryStr: "81090612",
            cmdQueryResponseRE: /9050(\w{16})/,
            cmdUpdateTemplate: "810106020A0AXXXXYYYY",
            cmdUpdateResponseTemplate: "905\\d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_XY,
            usertype: Control.USERTYPE_SLIDER_2D,
            templateConfig : {
                xMin: -880,
                xMax: 880,
                xName: "Pan",
                yMin: -300,
                yMax: 300,
                yName: "Tilt"
            },
            poll: 1
        };

        this.commands[panTiltConfig.cmdStr] = new EviD31Command(panTiltConfig);


        let zoomConfig : ITCPCommandConfig = {
            cmdStr: "Zoom",
            cmdQueryStr: "81090447",
            cmdQueryResponseRE: /\w050(\w{8})/,
            cmdUpdateTemplate: "81010447ZZZZ",
            cmdUpdateResponseTemplate: "905\\d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_RANGE,
            usertype: Control.USERTYPE_SLIDER,
            templateConfig: {
                min: 0,
                max: 1023
            },
            poll: 1
        };
        this.commands[zoomConfig.cmdStr] = new EviD31Command(zoomConfig);

        let focusModeConfig : ITCPCommandConfig = {
            cmdStr: "Focus Mode",
            cmdQueryStr: "81090438",
            cmdQueryResponseRE: /\w050(\w{2})/,
            cmdUpdateTemplate: "81010438ZZ",
            cmdUpdateResponseTemplate: "905\\d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: Control.USERTYPE_SELECT,
            templateConfig: {
                options: {
                    "02" : "Auto",
                    "03" : "Manual",
                }
            },
            poll: 1
        };
        this.commands[focusModeConfig.cmdStr] = new EviD31Command(focusModeConfig);


        let focusConfig : ITCPCommandConfig = {
            cmdStr: "Focus",
            cmdQueryStr: "81090448",
            cmdQueryResponseRE: /\w050(\w{8})/,
            cmdUpdateTemplate: "81010448ZZZZ",
            cmdUpdateResponseTemplate: "905\\d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_RANGE,
            usertype: Control.USERTYPE_SLIDER,
            templateConfig: {
                min: 4096,
                max: 40959
            },
            poll: 1
        };
        this.commands[focusConfig.cmdStr] = new EviD31Command(focusConfig);

        let gainConfig : ITCPCommandConfig = {
            cmdStr: "Gain",
            cmdQueryStr: "8109044C",
            cmdQueryResponseRE: /\w050(\w{8})/,
            cmdUpdateTemplate: "8101044CZZZZ",
            cmdUpdateResponseTemplate: "905\\d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_RANGE,
            usertype: Control.USERTYPE_SLIDER,
            templateConfig: {
                min: 1,
                max: 7
            },
            poll: 1
        };
        this.commands[gainConfig.cmdStr] = new EviD31Command(gainConfig);

        let autoExposureConfig : ITCPCommandConfig = {
            cmdStr: "Auto Exposure Mode",
            cmdQueryStr: "81090439",
            cmdQueryResponseRE: /\w050(\w{2})/,
            cmdUpdateTemplate: "81010439ZZ",
            cmdUpdateResponseTemplate: "905\\d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control.CONTROL_TYPE_STRING,
            usertype: Control.USERTYPE_SELECT,
            templateConfig: {
                options: {
                    "00" : "Full Auto",
                    "03" : "Manual",
                    "0A" : "Shutter priority",
                    "0B" : "Iris Priority"
                 }
            },
            poll: 1
        };
        this.commands[autoExposureConfig.cmdStr] = new EviD31Command(autoExposureConfig);

    }


}

let communicator = new EviD31Communicator();
module.exports = communicator;