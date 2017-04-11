import {TCPCommunicator, TCPCommEncoding} from "../TCPCommunicator";
import {ITCPCommandConfig} from "../TCPCommand";
import {EviD31Command} from "./EviD31Command";
import {Control} from "../../shared/Control";
import {SynchronousTCPCommunicator} from "../SynchronousTCPCommunicator";

//TODO: This communicator seems to have issues with order of commands and responses.  Query responses sometimes
// come back out of order.

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
    }


}

let communicator = new EviD31Communicator();
module.exports = communicator;