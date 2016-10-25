import {EndpointCommunicator} from "./EndpointCommunicator";
import * as SerialPort from "serialport";
import {IndexedDataSet} from "../shared/DCDataModel";
import {Control, ControlData} from "../shared/Control";
import {ControlUpdateData} from "../shared/ControlUpdate";
import * as debugMod from "debug";

let debug = debugMod("comms");

export class DWPodiumButtonCommunicator extends EndpointCommunicator {

    port : SerialPort;
    ctid: string;
    value = [false, false, false, false];
    individualControls : Control[];

    constructor() {
        super();
    }

    connect() {
        this.port = new SerialPort(this.config.endpoint.address, { baudRate : 9600 });
        //this.port.open();
    }


    getControlTemplates() : IndexedDataSet<Control> {
        this.ctid = this.endpoint_id + "-state";
        let templateData : ControlData  = {
            _id: this.ctid,
            ctid: this.ctid,
            endpoint_id : this.endpoint_id,
            usertype: "button-set",
            name: "State",
            control_type: "object",
            poll: 0,
            ephemeral: false,
            config: {},
            value: this.value
        };

        let control = new Control(this.ctid, templateData);
        let ret = {};
        ret[this.ctid] = control;
        return <IndexedDataSet<Control>>ret;
    }


    handleControlUpdateRequest(request: ControlUpdateData) {

        if (this.port.isOpen) {
            let outChar = this.valueToChar(request.value);
            this.port.write(outChar);
            debug(`char ${outChar} sent to button controller`);

            let control = this.controls[request.control_id];
            this.config.controlUpdateCallback(control, request.value);
            control.value = request.value;
        }
        else {
            this.port.open();
        }
    }


    valueToChar(value) {
        // Update value is a list of boolean values.  Convert
        // them into a hex value with bits corresponding to the
        // booleans.  Add 65 to this value to put the resulting
        // hex value in the ASCII range
        let outVal = 65;
        for (let i = 0; i < this.value.length; i++) {
            if (value[i]) {
                outVal += (1 << i);
            }
        }

        let outChar = String.fromCharCode(outVal);

        return outChar;
    }

}

let communicator = new DWPodiumButtonCommunicator();
module.exports = communicator;