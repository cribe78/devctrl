"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TCPCommunicator_1 = require("./TCPCommunicator");
var EviD31Command_1 = require("./Sony/EviD31Command");
var Control_1 = require("../shared/Control");
//TODO: Implement EviD31Communicator
var EviD31Communicator = (function (_super) {
    __extends(EviD31Communicator, _super);
    function EviD31Communicator() {
        var _this = _super.call(this) || this;
        _this.inputLineTerminator = "ff";
        _this.outputLineTerminator = "ff";
        _this.commsMode = "hex";
        return _this;
    }
    EviD31Communicator.prototype.buildCommandList = function () {
        var irisConfig = {
            cmdStr: "Iris",
            cmdQueryStr: "8109044B",
            cmdQueryResponseRE: /\w050(\w{8})/,
            cmdUpdateTemplate: "8101044BZZZZ",
            cmdUpdateResponseTemplate: "905\\d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_RANGE,
            usertype: Control_1.Control.USERTYPE_SLIDER,
            templateConfig: {
                min: 0,
                max: 17
            },
            poll: 1
        };
        this.commands[irisConfig.cmdStr] = new EviD31Command_1.EviD31Command(irisConfig);
    };
    return EviD31Communicator;
}(TCPCommunicator_1.TCPCommunicator));
var communicator = new EviD31Communicator();
module.exports = communicator;
//# sourceMappingURL=EviD31Communicator.js.map