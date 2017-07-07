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
var SynchronousTCPCommunicator_1 = require("../SynchronousTCPCommunicator");
var TCPCommand_1 = require("../TCPCommand");
var Control_1 = require("../../shared/Control");
var ESeriesCommunicator = (function (_super) {
    __extends(ESeriesCommunicator, _super);
    function ESeriesCommunicator() {
        var _this = _super.call(this) || this;
        _this.inputLineTerminator = ")";
        _this.outputLineTerminator = ")";
        return _this;
    }
    ESeriesCommunicator.prototype.buildCommandList = function () {
        this.registerRangeCommand("HORZ Position", "HOR", 0, 100);
        this.registerRangeCommand("VERT Position", "VRT", 0, 100);
    };
    ESeriesCommunicator.prototype.registerRangeCommand = function (name, cmd, min, max) {
        this.commands[name] = new TCPCommand_1.TCPCommand({
            cmdStr: name,
            cmdQueryStr: "(" + cmd + "?",
            cmdQueryResponseRE: "(" + cmd + "\\!(\\d\\d)",
            cmdUpdateTemplate: "(#" + cmd + "%i",
            cmdUpdateResponseTemplate: "(" + cmd + "%i",
            endpoint_id: this.endpoint_id,
            control_type: Control_1.Control.CONTROL_TYPE_RANGE,
            usertype: Control_1.Control.USERTYPE_SLIDER,
            poll: 1,
            templateConfig: {
                min: min,
                max: max
            }
        });
    };
    return ESeriesCommunicator;
}(SynchronousTCPCommunicator_1.SynchronousTCPCommunicator));
var communicator = new ESeriesCommunicator();
module.exports = communicator;
//# sourceMappingURL=ESeriesCommunicator.js.map