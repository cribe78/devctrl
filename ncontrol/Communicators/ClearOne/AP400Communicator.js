"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TCPCommunicator_1 = require("../TCPCommunicator");
var AP400Controls_1 = require("./AP400Controls");
var debugMod = require("debug");
var debug = debugMod("comms");
var AP400Communicator = (function (_super) {
    __extends(AP400Communicator, _super);
    function AP400Communicator() {
        _super.call(this);
        this.device = "#30";
    }
    AP400Communicator.prototype.connect = function () {
        debug("connecting to AP 400");
        _super.prototype.connect.call(this);
    };
    AP400Communicator.prototype.preprocessLine = function (line) {
        // Strip a leading prompt
        var start = "AP 400> ";
        if (line.substring(0, start.length) == start) {
            return line.slice(start.length);
        }
        return line;
    };
    AP400Communicator.prototype.getControlTemplates = function () {
        this.buildCommandList();
        for (var cmd in this.commands) {
            var templateList = this.commands[cmd].getControlTemplates();
            for (var _i = 0, templateList_1 = templateList; _i < templateList_1.length; _i++) {
                var tpl = templateList_1[_i];
                this.controls[tpl._id] = tpl;
                this.controlsByCtid[tpl.ctid] = tpl;
                this.commandsByTemplate[tpl.ctid] = this.commands[cmd];
            }
        }
        return this.controlsByCtid;
    };
    AP400Communicator.prototype.buildCommandList = function () {
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
                templateConfig: cmdDef.templateConfig || {}
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