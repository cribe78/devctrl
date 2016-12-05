"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var debugMod = require("debug");
var TCPCommunicator_1 = require("../TCPCommunicator");
var TCPCommand_1 = require("../TCPCommand");
var debug = debugMod("comms");
var IA200Communicator = (function (_super) {
    __extends(IA200Communicator, _super);
    function IA200Communicator() {
        _super.apply(this, arguments);
        this.inputLineTerminator = '';
        this.outputLineTerminator = '\n';
    }
    IA200Communicator.prototype.buildCommandList = function () {
        var nineZeros = "000000000";
        var fiveZeros = "00000";
        var inputConfig = {
            cmdStr: "Video Input",
            cmdUpdateTemplate: "A00WBA%s" + nineZeros,
            cmdUpdateResponseTemplate: "K",
            endpoint_id: this.config.endpoint._id,
            control_type: "string",
            usertype: "select",
            templateConfig: {
                options: {
                    A: "Component",
                    B: "RGB",
                    C: "DVI",
                    D: "S-Video",
                    E: "Composite",
                    F: "SDI",
                    G: "HDMI"
                }
            },
            poll: 0,
            writeonly: true
        };
        this.commands[inputConfig.cmdStr] = new TCPCommand_1.TCPCommand(inputConfig);
        var keystoneConfig = {
            cmdStr: "Keystone TL-X",
            cmdQueryStr: "A00RFAA",
            cmdQueryResponseRE: /V0(\d\d\d)/,
            cmdUpdateTemplate: "A00WFAA%04d" + fiveZeros,
            cmdUpdateResponseTemplate: "K",
            endpoint_id: this.config.endpoint._id,
            control_type: "range",
            usertype: "slider",
            templateConfig: {
                min: 0,
                max: 800
            },
            poll: 1
        };
        this.commands[keystoneConfig.cmdStr] = new TCPCommand_1.TCPCommand(keystoneConfig);
        keystoneConfig.cmdStr = "Keystone TL-V";
        keystoneConfig.cmdQueryStr = "A00RFAB";
        keystoneConfig.cmdUpdateTemplate = "A00WFAB%04d" + fiveZeros;
        this.commands[keystoneConfig.cmdStr] = new TCPCommand_1.TCPCommand(keystoneConfig);
    };
    // Match one of the IA200 response codes and return it
    IA200Communicator.prototype.matchResponseCode = function () {
        var data = this.inputBuffer;
        if (data.length == 0) {
            return '';
        }
        if (data.charAt(0) == "K") {
            // ACK
            return "K";
        }
        else if (data.charAt(0) == "V") {
            // 4 digit number
            return data.slice(0, 5);
        }
        else if (data.charAt(0) == "E") {
            // Error
            return "E";
        }
        else if (data.charAt(0) == "v") {
            // A string
            if (data.search("\r") == -1) {
                // An incomplete string, wait for more
                return "";
            }
            var str = data.slice(0, data.search("\r") + 1);
            return str;
        }
        debug("Error: unmatched IA200 start char:" + data);
        this.inputBuffer = this.inputBuffer.slice(1);
        return '';
    };
    // The IA200 doesn't delineate between responses. Handle all potential responses in
    // custom onData handler
    IA200Communicator.prototype.onData = function (data) {
        var strData = String(data);
        this.inputBuffer += strData;
        var resp;
        while ((resp = this.matchResponseCode())) {
            this.processLine(resp);
            this.inputBuffer = this.inputBuffer.slice(resp.length);
        }
    };
    return IA200Communicator;
}(TCPCommunicator_1.TCPCommunicator));
var communicator = new IA200Communicator();
module.exports = communicator;
//# sourceMappingURL=IA200Communicator.js.map