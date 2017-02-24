"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TCPCommunicator_1 = require("../TCPCommunicator");
var ExtronDXPCommand_1 = require("./ExtronDXPCommand");
var Endpoint_1 = require("../../shared/Endpoint");
var outputs = {};
var inputs = {};
for (var i = 1; i <= 8; i++) {
    outputs[i] = "Output " + i;
    inputs[i] = "Input " + i;
}
var ExtronDXPCommunicator = (function (_super) {
    __extends(ExtronDXPCommunicator, _super);
    function ExtronDXPCommunicator() {
        var _this = _super.apply(this, arguments) || this;
        _this.inputLineTerminator = '\r\n';
        _this.outputLineTerminator = '\r\n';
        _this.endpointPassword = "DWCONTROL";
        return _this;
    }
    ExtronDXPCommunicator.prototype.buildCommandList = function () {
        // Video/Audio Tie Commands
        for (var i in outputs) {
            // Video Output command
            var vidoutConfig = {
                cmdStr: "Out" + i + "Vid",
                cmdQueryStr: i + "%",
                cmdQueryResponseRE: /(\d)/,
                cmdUpdateTemplate: '%d*' + i + '%%',
                cmdUpdateResponseTemplate: 'Out' + i + ' In%d Vid',
                cmdReportRE: 'Out' + i + ' In(\\d) Vid',
                endpoint_id: this.endpoint_id,
                control_type: "string",
                usertype: "select",
                templateConfig: {
                    options: inputs
                },
                dxpCmdType: "tie-video",
                channelNum: i
            };
            this.commands[vidoutConfig.cmdStr] = new ExtronDXPCommand_1.ExtronDXPCommand(vidoutConfig);
        }
        for (var i in outputs) {
            // Audio Output command
            var audoutConfig = {
                cmdStr: "Out" + i + "Aud",
                cmdQueryStr: i + "$",
                cmdQueryResponseRE: /(\d)/,
                cmdUpdateTemplate: '%d*' + i + '$',
                cmdUpdateResponseTemplate: 'Out' + i + ' In%d Aud',
                cmdReportRE: 'Out' + i + ' In(\d) Aud',
                endpoint_id: this.endpoint_id,
                control_type: "string",
                usertype: "select",
                templateConfig: {
                    options: inputs
                },
                dxpCmdType: "tie-audio",
                channelNum: i
            };
            this.commands[audoutConfig.cmdStr] = new ExtronDXPCommand_1.ExtronDXPCommand(audoutConfig);
        }
        for (var i in outputs) {
            //Video/Audio Mute Commands
            var vmuteConfig = {
                cmdStr: "Vmt" + i,
                cmdQueryStr: i + "B",
                cmdQueryResponseRE: '(0|1)',
                cmdUpdateTemplate: i + "*%dB",
                cmdUpdateResponseTemplate: "Vmt" + i + "*%d",
                cmdReportRE: 'Vmt' + i + '*(0|1)',
                endpoint_id: this.endpoint_id,
                control_type: "boolean",
                usertype: "switch",
                templateConfig: {},
                dxpCmdType: "mute-video",
                channelNum: i
            };
            this.commands[vmuteConfig.cmdStr] = new ExtronDXPCommand_1.ExtronDXPCommand(vmuteConfig);
        }
        for (var i in outputs) {
            var amuteConfig = {
                cmdStr: "Amt" + i,
                cmdQueryStr: i + "Z",
                cmdQueryResponseRE: '(0|1)',
                cmdUpdateTemplate: i + "*%dZ",
                cmdUpdateResponseTemplate: "Amt" + i + "*%d",
                cmdReportRE: new RegExp('Amt' + i + '*(0|1)'),
                endpoint_id: this.endpoint_id,
                control_type: "boolean",
                usertype: "switch",
                templateConfig: {},
                dxpCmdType: "mute-audio",
                channelNum: i
            };
            this.commands[amuteConfig.cmdStr] = new ExtronDXPCommand_1.ExtronDXPCommand(amuteConfig);
        }
        //Device Status Command
        var statusConfig = {
            cmdStr: "status",
            cmdQueryStr: "S",
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
                    "Login (Administrator|User)",
                    function () {
                        _this.connected = true;
                        _this.config.statusUpdateCallback(Endpoint_1.EndpointStatus.Online);
                        _this.online();
                    }
                ]);
            }
        ]);
    };
    /*
    * This implementation should be more efficient than the default implementation
    * which checks every command individually
     */
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