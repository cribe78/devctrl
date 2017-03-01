import {TCPCommunicator, TCPCommEncoding} from "./TCPCommunicator";
import {ITCPCommandConfig} from "./TCPCommand";
import {EviD31Command} from "./Sony/EviD31Command";
import {Control} from "../shared/Control";

//TODO: Implement EviD31Communicator

class EviD31Communicator extends TCPCommunicator {

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
    }


}

let communicator = new EviD31Communicator();
module.exports = communicator;