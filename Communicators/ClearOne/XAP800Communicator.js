"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TCPCommunicator_1 = require("../TCPCommunicator");
var debug = console.log;
var micChannels = {
    "1 M": "Input 1",
    "2 M": "Input 2",
    "3 M": "Input 3",
    "4 M": "Input 4",
    "5 M": "Input 5",
    "6 M": "Input 6",
    "7 M": "Input 7",
    "8 M": "Input 8"
};
var lineChannels = {
    "9 L": "Input 9",
    "10 L": "Input 10",
    "11 L": "Input 11",
    "12 L": "Input 12"
};
var outputChannels = {
    "1 O": "Output 1",
    "2 O": "Output 2",
    "3 O": "Output 3",
    "4 O": "Output 4",
    "5 O": "Output 5",
    "6 O": "Output 6",
    "7 O": "Output 7",
    "8 O": "Output 8",
    "9 O": "Output 9",
    "10 O": "Output 10",
    "11 O": "Output 11",
    "12 O": "Output 12",
};
var XAP800Communicator = (function (_super) {
    __extends(XAP800Communicator, _super);
    function XAP800Communicator() {
        var _this = _super.call(this) || this;
        _this.device = "#30";
        return _this;
    }
    XAP800Communicator.prototype.buildCommandList = function () {
        var mtrxConfig = {
            endpoint_id: this.config.endpoint._id,
            cmdStr: "MTRX",
            control_type: "int",
            usertype: "clearone-mtrx",
            device: this.device
        };
        for (var inCh in micChannels) {
            for (var outCh in outputChannels) {
                mtrxConfig['templateConfig'] = { inputType: "mic" };
                mtrxConfig['channel'] = inCh + " " + outCh;
                mtrxConfig['channelName'] = micChannels[inCh] + "-" + outputChannels[outCh];
            }
        }
        for (var inCh in lineChannels) {
            for (var outCh in outputChannels) {
                mtrxConfig['templateConfig'] = { inputType: "line" };
                mtrxConfig['channel'] = inCh + " " + outCh;
                mtrxConfig['channelName'] = micChannels[inCh] + "-" + outputChannels[outCh];
            }
        }
    };
    XAP800Communicator.prototype.generateCommandSet = function (config, ioList, ctor) {
        for (var ioStr in ioList) {
        }
    };
    return XAP800Communicator;
}(TCPCommunicator_1.TCPCommunicator));
var communicator = new XAP800Communicator();
module.exports = communicator;
//# sourceMappingURL=XAP800Communicator.js.map