"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EndpointCommunicator_1 = require("./EndpointCommunicator");
var SerialPort = require("serialport");
var Control_1 = require("../shared/Control");
var debugMod = require("debug");
var Endpoint_1 = require("../shared/Endpoint");
var debug = debugMod("comms");
var DWPodiumButtonCommunicator = (function (_super) {
    __extends(DWPodiumButtonCommunicator, _super);
    function DWPodiumButtonCommunicator() {
        var _this = _super.call(this) || this;
        _this.value = [false, false, false, false];
        return _this;
    }
    DWPodiumButtonCommunicator.prototype.connect = function () {
        this.port = new SerialPort(this.config.endpoint.address, { baudRate: 9600 });
        this.config.statusUpdateCallback(Endpoint_1.EndpointStatus.Online);
        //this.port.open();
    };
    DWPodiumButtonCommunicator.prototype.getControlTemplates = function () {
        this.ctid = this.endpoint_id + "-state";
        var templateData = {
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
        var control = new Control_1.Control(this.ctid, templateData);
        var ret = {};
        ret[this.ctid] = control;
        return ret;
    };
    DWPodiumButtonCommunicator.prototype.handleControlUpdateRequest = function (request) {
        if (this.port.isOpen) {
            var outChar = this.valueToChar(request.value);
            this.port.write(outChar);
            debug("char " + outChar + " sent to button controller");
            var control = this.controls[request.control_id];
            this.config.controlUpdateCallback(control, request.value);
            control.value = request.value;
        }
        else {
            this.port.open();
        }
    };
    DWPodiumButtonCommunicator.prototype.valueToChar = function (value) {
        // Update value is a list of boolean values.  Convert
        // them into a hex value with bits corresponding to the
        // booleans.  Add 65 to this value to put the resulting
        // hex value in the ASCII range
        var outVal = 65;
        for (var i = 0; i < this.value.length; i++) {
            if (value[i]) {
                outVal += (1 << i);
            }
        }
        var outChar = String.fromCharCode(outVal);
        return outChar;
    };
    return DWPodiumButtonCommunicator;
}(EndpointCommunicator_1.EndpointCommunicator));
exports.DWPodiumButtonCommunicator = DWPodiumButtonCommunicator;
var communicator = new DWPodiumButtonCommunicator();
module.exports = communicator;
//# sourceMappingURL=DWPodiumButtonCommunicator.js.map