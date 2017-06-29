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
var Control_1 = require("../../shared/Control");
var CLQLCommand_1 = require("./CLQLCommand");
var Endpoint_1 = require("../../shared/Endpoint");
var TCPCommunicator_1 = require("../TCPCommunicator");
var sprintf_js_1 = require("sprintf-js");
var CLQLCommunicator = (function (_super) {
    __extends(CLQLCommunicator, _super);
    function CLQLCommunicator() {
        var _this = _super.call(this) || this;
        _this.alvPacket = "f043103e197f";
        _this.deviceType = "CL";
        _this.inputLineTerminator = "f7";
        _this.outputLineTerminator = "f7";
        _this.commsMode = "hex";
        return _this;
    }
    CLQLCommunicator.prototype.buildCommandList = function () {
        var inputCount = 72;
        var mixCount = 16;
        if (this.deviceType == "QL") {
            inputCount = 48;
            mixCount = 16;
        }
        // Input Controls
        for (var i = 0; i < inputCount; i++) {
            var chnStr = sprintf_js_1.sprintf("%04x", i);
            this.registerSetupCommand("InputOn." + i, "0035", "0000", chnStr, Control_1.Control.CONTROL_TYPE_BOOLEAN, Control_1.Control.USERTYPE_SWITCH);
            this.registerSetupCommand("InputFader." + i, "0037", "0000", chnStr, Control_1.Control.CONTROL_TYPE_RANGE, Control_1.Control.USERTYPE_CLQL_FADER, { min: 0, max: 1023 });
        }
        // Mix Controls
        for (var i = 0; i < mixCount; i++) {
            var chnStr = sprintf_js_1.sprintf("%04x", i);
            this.registerSetupCommand("MixOn." + i, "004b", "0000", chnStr, Control_1.Control.CONTROL_TYPE_BOOLEAN, Control_1.Control.USERTYPE_SWITCH);
            this.registerSetupCommand("MixFader." + i, "004d", "0000", chnStr, Control_1.Control.CONTROL_TYPE_RANGE, Control_1.Control.USERTYPE_CLQL_FADER, { min: 0, max: 1023 });
        }
        // Matrix Controls
        for (var i = 0; i < 8; i++) {
            var chnStr = sprintf_js_1.sprintf("%04x", i);
            this.registerSetupCommand("MatrixOn." + i, "0063", "0000", chnStr, Control_1.Control.CONTROL_TYPE_BOOLEAN, Control_1.Control.USERTYPE_SWITCH);
            this.registerSetupCommand("MatrixFader." + i, "0065", "0000", chnStr, Control_1.Control.CONTROL_TYPE_RANGE, Control_1.Control.USERTYPE_CLQL_FADER, { min: 0, max: 1023 });
        }
    };
    CLQLCommunicator.prototype.doDeviceLogon = function () {
        var _this = this;
        this.socket.on('data', function (data) {
            if (_this.connected)
                return;
            var strData = data.toString('hex');
            if (strData == _this.alvPacket + "f7") {
                console.log("connection string received, sending ACK");
                //this.writeToSocket("f043303e1932f7f043303e193100f7");
                _this.writeToSocket("f043303e1932f7"
                    + "f043303e193100f7"
                //+ "f043303e1901037000000000f7"
                //+ "f043303e1901037000010000f7"
                //+ "f043303e1901035800000000f7"
                //+ "f043303e1901035800010000f7"
                //+ "f043303e1901032a00000000f7"
                //+ "f043303e1901032a00010000f7"
                //+ "f043303e1901032a00020000f7"
                //+ "f043303e1901015c00010000f7"
                //+ "f043303e1901015c00010001f7"
                //+ "f043303e1901015c00010002f7"
                //+ "f043303e1901015c00010003f7"
                //+ "f043303e1901015c00010004f7"
                //+ "f043303e1901015c00010005f7"
                //+ "f043303e1901015d00000000f7"
                //+ "f043303e1901015d00000001f7"
                //+ "f043303e1901015d00000002f7"
                //+ "f043303e1901015d00000003f7"
                //+ "f043303e1901015d00000004f7"
                //+ "f043303e1901015d00000005f7"
                //+ "f043303e1901035e00000000f7"
                //+ "f043303e1901035e00000001f7"
                //+ "f043303e1901035e00000002f7"
                );
                _this.connected = true;
                _this.config.statusUpdateCallback(Endpoint_1.EndpointStatus.Online);
                _this.online();
            }
        });
    };
    CLQLCommunicator.prototype.preprocessLine = function (line) {
        if (line == this.alvPacket) {
            console.log("ALV received");
            return '';
        }
        return line;
    };
    CLQLCommunicator.prototype.registerSetupCommand = function (name, command, subCommand, channel, controlType, usertype, controlConfig) {
        if (controlType === void 0) { controlType = Control_1.Control.CONTROL_TYPE_INT; }
        if (usertype === void 0) { usertype = Control_1.Control.USERTYPE_READONLY; }
        if (controlConfig === void 0) { controlConfig = {}; }
        this.commands[name] = new CLQLCommand_1.CLQLCommand({
            cmdStr: name,
            endpoint_id: this.endpoint_id,
            control_type: controlType,
            usertype: usertype,
            templateConfig: controlConfig,
            poll: 1,
            commandGroup: CLQLCommand_1.CLQLCommand.CGROUP_SETUP,
            command: command,
            subCommand: subCommand,
            channel: channel
        });
    };
    return CLQLCommunicator;
}(TCPCommunicator_1.TCPCommunicator));
var communicator = new CLQLCommunicator();
module.exports = communicator;
//# sourceMappingURL=CLQLCommunicator.js.map