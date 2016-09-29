"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var debugMod = require("debug");
var TCPCommunicator_1 = require("../TCPCommunicator");
var ExtronSWUSBCommand_1 = require("./ExtronSWUSBCommand");
var debug = debugMod("comms");
var ExtronSWUSBCommunicator = (function (_super) {
    __extends(ExtronSWUSBCommunicator, _super);
    function ExtronSWUSBCommunicator() {
        _super.apply(this, arguments);
        this.inputLineTerminator = '\r\n';
        this.outputLineTerminator = '';
    }
    ExtronSWUSBCommunicator.prototype.buildCommandList = function () {
        var config = {
            cmdStr: "Input",
            endpoint_id: this.config.endpoint._id,
            control_type: "string",
            usertype: "select",
            templateConfig: {
                options: {
                    1: "Input 1",
                    2: "Input 2",
                    3: "Input 3",
                    4: "Input 3"
                }
            },
            poll: 1
        };
        this.commands[config.cmdStr] = new ExtronSWUSBCommand_1.ExtronSWUSBCommand(config);
    };
    ExtronSWUSBCommunicator.prototype.connect = function () {
        debug("connecting to SWUSB-4");
        _super.prototype.connect.call(this);
    };
    return ExtronSWUSBCommunicator;
}(TCPCommunicator_1.TCPCommunicator));
var communicator = new ExtronSWUSBCommunicator();
module.exports = communicator;
//# sourceMappingURL=ExtronSWUSBCommunicator.js.map