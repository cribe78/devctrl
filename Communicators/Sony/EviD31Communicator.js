"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EviD31Command_1 = require("./EviD31Command");
var Control_1 = require("../../shared/Control");
var SynchronousTCPCommunicator_1 = require("../SynchronousTCPCommunicator");
//TODO: This communicator seems to have issues with order of commands and responses.  Query responses sometimes
// come back out of order.
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
        var panTiltConfig = {
            cmdStr: "Pan/Tilt",
            cmdQueryStr: "81090612",
            cmdQueryResponseRE: /9050(\w{16})/,
            cmdUpdateTemplate: "810106020A0AXXXXYYYY",
            cmdUpdateResponseTemplate: "905\\d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_XY,
            usertype: Control_1.Control.USERTYPE_SLIDER_2D,
            templateConfig: {
                xMin: -880,
                xMax: 880,
                xName: "Pan",
                yMin: -300,
                yMax: 300,
                yName: "Tilt"
            },
            poll: 1
        };
        this.commands[panTiltConfig.cmdStr] = new EviD31Command_1.EviD31Command(panTiltConfig);
        var zoomConfig = {
            cmdStr: "Zoom",
            cmdQueryStr: "81090447",
            cmdQueryResponseRE: /\w050(\w{8})/,
            cmdUpdateTemplate: "81010447ZZZZ",
            cmdUpdateResponseTemplate: "905\\d",
            endpoint_id: this.config.endpoint._id,
            control_type: Control_1.Control.CONTROL_TYPE_RANGE,
            usertype: Control_1.Control.USERTYPE_SLIDER,
            templateConfig: {
                min: 0,
                max: 1023
            },
            poll: 1
        };
        this.commands[zoomConfig.cmdStr] = new EviD31Command_1.EviD31Command(zoomConfig);
    };
    return EviD31Communicator;
}(SynchronousTCPCommunicator_1.SynchronousTCPCommunicator));
var communicator = new EviD31Communicator();
module.exports = communicator;
//# sourceMappingURL=EviD31Communicator.js.map