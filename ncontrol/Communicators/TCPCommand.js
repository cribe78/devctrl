"use strict";
var Shared_1 = require("../../shared/Shared");
var TCPCommand = (function () {
    function TCPCommand(config) {
        this.cmdStr = config.cmdStr;
        this.name = config.cmdStr;
        this.endpoint_id = config.endpoint_id;
        this.usertype = config.usertype;
        this.control_type = config.control_type;
        this.templateConfig = config.templateConfig;
    }
    TCPCommand.prototype.deviceUpdateString = function (value) {
        return this.cmdStr + " " + value;
    };
    TCPCommand.prototype.deviceQueryString = function () {
        return this.cmdStr + "?";
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
            poll: 0,
            config: {}
        };
        var templates = [new Shared_1.ControlTemplate(ctid, templateData)];
        this.ctidList = [ctid];
        return templates;
    };
    TCPCommand.prototype.matchesDeviceString = function (devStr) {
        return false;
    };
    return TCPCommand;
}());
exports.TCPCommand = TCPCommand;
//# sourceMappingURL=TCPCommand.js.map