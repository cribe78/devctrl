"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TCPCommunicator_1 = require("../TCPCommunicator");
var ExtronDXPCommand_1 = require("./ExtronDXPCommand");
var outputs = {};
var inputs = {};
for (var i = 1; i <= 8; i++) {
    outputs[i] = "Output " + i;
    inputs[i] = "Input " + i;
}
var ExtronDXPCommunicator = (function (_super) {
    __extends(ExtronDXPCommunicator, _super);
    function ExtronDXPCommunicator() {
        _super.apply(this, arguments);
        this.inputLineTerminator = '\r\n';
        this.outputLineTerminator = '\r\n';
        this.endpointPassword = "DWCONTROL";
    }
    ExtronDXPCommunicator.prototype.buildCommandList = function () {
        // Video/Audio Tie Commands
        for (var i in outputs) {
            // Video Output command
            var config = {
                cmdStr: "Out" + i + "Vid",
                endpoint_id: this.endpoint_id,
                control_type: "string",
                usertype: "select",
                templateConfig: {
                    options: inputs
                },
                dxpCmdType: "tie-video",
                channelNum: i
            };
            this.commands[config.cmdStr] = new ExtronDXPCommand_1.ExtronDXPCommand(config);
            // Modify and create audio command
            config.cmdStr = "Out" + i + "Aud";
            config.dxpCmdType = "tie-audio";
            this.commands[config.cmdStr] = new ExtronDXPCommand_1.ExtronDXPCommand(config);
        }
        //Video/Audio Mute Commands
        for (var i in outputs) {
            var config = {
                cmdStr: "Vmt" + i,
                endpoint_id: this.endpoint_id,
                control_type: "boolean",
                usertype: "switch",
                templateConfig: {},
                dxpCmdType: "mute-video",
                channelNum: i
            };
            this.commands[config.cmdStr] = new ExtronDXPCommand_1.ExtronDXPCommand(config);
            // Modify and create audio command
            config.cmdStr = "Amt" + i;
            config.dxpCmdType = "mute-audio";
            this.commands[config.cmdStr] = new ExtronDXPCommand_1.ExtronDXPCommand(config);
        }
        //Device Status Command
        var statusConfig = {
            cmdStr: "status",
            endpoint_id: this.endpoint_id,
            control_type: "string",
            usertype: "readonly",
            templateConfig: {},
            dxpCmdType: "status",
            poll: 1
        };
        this.commands["status"] = new ExtronDXPCommand_1.ExtronDXPCommand(statusConfig);
    };
    ExtronDXPCommunicator.prototype.doDeviceLogon = function () {
        var _this = this;
        this.socket.write("\r");
        this.expectedResponses.push([
            "Password:",
            function () {
                _this.socket.write(_this.endpointPassword + "\r");
                _this.expectedResponses.push([
                    "Login Administrator",
                    function () {
                        _this.connected = true;
                        _this.config.statusUpdateCallback("online");
                    }
                ]);
            }
        ]);
    };
    ExtronDXPCommunicator.prototype.matchLineToCommand = function (line) {
        var matches = line.match(ExtronDXPCommand_1.ExtronDXPCommand.tieResponseRE);
        if (matches) {
            var cmdStr = "Out" + matches[1] + matches[2];
            if (this.commands[cmdStr]) {
                return this.commands[cmdStr];
            }
            return false;
        }
        matches = line.match(ExtronDXPCommand_1.ExtronDXPCommand.muteResponseRE);
        if (matches) {
            var cmdStr = matches[1] + matches[2];
            if (this.commands[cmdStr]) {
                return this.commands[cmdStr];
            }
        }
        matches = line.match(ExtronDXPCommand_1.ExtronDXPCommand.statusResponseRE);
        if (matches) {
            return this.commands["status"];
        }
        return false;
    };
    return ExtronDXPCommunicator;
}(TCPCommunicator_1.TCPCommunicator));
var communicator = new ExtronDXPCommunicator();
module.exports = communicator;
//# sourceMappingURL=ExtronDXPCommunicator.js.map