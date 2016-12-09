"use strict";
const EndpointCommunicator_1 = require("./EndpointCommunicator");
const SerialPort = require("serialport");
const Control_1 = require("../shared/Control");
const debugMod = require("debug");
const Endpoint_1 = require("../shared/Endpoint");
let debug = debugMod("comms");
class DWPodiumButtonCommunicator extends EndpointCommunicator_1.EndpointCommunicator {
    constructor() {
        super();
        this.value = [false, false, false, false];
    }
    connect() {
        this.port = new SerialPort(this.config.endpoint.address, { baudRate: 9600 });
        this.config.statusUpdateCallback(Endpoint_1.EndpointStatus.Online);
        //this.port.open();
    }
    getControlTemplates() {
        this.ctid = this.endpoint_id + "-state";
        let templateData = {
            _id: this.ctid,
            ctid: this.ctid,
            endpoint_id: this.endpoint_id,
            usertype: "button-set",
            name: "State",
            control_type: "object",
            poll: 0,
            ephemeral: false,
            config: {},
            value: this.value
        };
        let control = new Control_1.Control(this.ctid, templateData);
        let ret = {};
        ret[this.ctid] = control;
        return ret;
    }
    handleControlUpdateRequest(request) {
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
exports.DWPodiumButtonCommunicator = DWPodiumButtonCommunicator;
let communicator = new DWPodiumButtonCommunicator();
module.exports = communicator;
//# sourceMappingURL=DWPodiumButtonCommunicator.js.map