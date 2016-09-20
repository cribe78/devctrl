"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TCPCommunicator_1 = require("../TCPCommunicator");
var AP400Controls_1 = require("./AP400Controls");
var AP400Communicator = (function (_super) {
    __extends(AP400Communicator, _super);
    function AP400Communicator() {
        _super.call(this);
        this.device = "#30";
        this.buildTemplateList();
    }
    AP400Communicator.prototype.connect = function () {
        console.log("connecting to AP 400");
        _super.prototype.connect.call(this);
    };
    /**
     * Parse an output line from the device
     * @param line
     */
    AP400Communicator.prototype.parseLine = function (line) {
    };
    AP400Communicator.prototype.buildTemplateList = function () {
        // First build a command list
        for (var cmdIdx in AP400Controls_1.commands) {
            var cmdDef = AP400Controls_1.commands[cmdIdx];
            var cmdConfig = {
                endpoint_id: this.config.endpoint._id,
                cmdStr: cmdDef.cmdStr,
                control_type: cmdDef.control_type,
                usertype: cmdDef.usertype,
                channel: '',
                channelName: '',
                device: this.device,
                templateConfig: cmdDef.templateConfig
            };
            if (cmdDef.updateTerminator) {
                cmdConfig.updateTerminator = cmdDef.updateTerminator;
            }
            if (cmdDef.ioList) {
                for (var ioStr in cmdDef.ioList) {
                    cmdConfig.channel = ioStr;
                    cmdConfig.channelName = cmdDef.ioList[ioStr];
                    var cmd = new cmdDef.ctor(cmdConfig);
                    this.commands[cmd.cmdStr] = cmd;
                }
            }
            else {
                var cmd = new cmdDef.ctor(cmdConfig);
                this.commands[cmd.cmdStr] = cmd;
            }
        }
    };
    return AP400Communicator;
}(TCPCommunicator_1.TCPCommunicator));
var communicator = new AP400Communicator();
module.exports = communicator;
//# sourceMappingURL=AP400Communicator.js.map