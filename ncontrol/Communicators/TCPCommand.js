"use strict";
var Shared_1 = require("../../shared/Shared");
var TCPCommand = (function () {
    function TCPCommand(config) {
        this.poll = 0;
        this.cmdStr = config.cmdStr;
        this.name = config.cmdStr;
        this.endpoint_id = config.endpoint_id;
        this.usertype = config.usertype;
        this.control_type = config.control_type;
        this.templateConfig = config.templateConfig;
        if (config.poll) {
            this.poll = config.poll;
        }
    }
    TCPCommand.prototype.deviceQueryString = function () {
        return this.cmdStr + "?";
    };
    TCPCommand.prototype.deviceUpdateString = function (control, update) {
        return this.cmdStr + " " + update.value;
    };
    TCPCommand.prototype.getControlTemplates = function () {
        var ctid = this.endpoint_id + "-" + this.cmdStr;
        var templateData = {
            _id: ctid,
            ctid: ctid,
            endpoint_id: this.endpoint_id,
            usertype: this.usertype,
            name: this.name,
            control_type: this.control_type,
            poll: this.poll,
            config: this.templateConfig,
            value: 0
        };
        var templates = [new Shared_1.Control(ctid, templateData)];
        this.ctidList = [ctid];
        return templates;
    };
    TCPCommand.prototype.matchesDeviceString = function (devStr) {
        return false;
    };
    TCPCommand.prototype.parseControlValue = function (control, line) {
        return line;
    };
    return TCPCommand;
}());
exports.TCPCommand = TCPCommand;
//# sourceMappingURL=TCPCommand.js.map