"use strict";
var Shared_1 = require("../shared/Shared");
var TCPCommand = (function () {
    function TCPCommand(config) {
        this.cmdQueryResponseRE = /^$a/; // RE to match the response to a device poll, default matches nothing
        this.cmdReportRE = /^$a/; // How the device reports an external change to this command. default matches nothing
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
        this.ephemeral = !!config.ephemeral;
        this.cmdQueryStr = config.cmdQueryStr ? config.cmdQueryStr : '';
        this.cmdUpdateTemplate = config.cmdUpdateTemplate ? config.cmdUpdateTemplate : '';
        this.cmdUpdateResponseTemplate = config.cmdUpdateResponseTemplate ? config.cmdUpdateResponseTemplate : '';
        this.cmdReportREMatchIdx = config.cmdReportREMatchIdx ? config.cmdReportREMatchIdx : 1;
        if (config.cmdQueryResponseRE) {
            if (typeof config.cmdQueryResponseRE == "string") {
                this.cmdQueryResponseRE = new RegExp(config.cmdQueryResponseRE);
            }
            else {
                this.cmdQueryResponseRE = config.cmdQueryResponseRE;
            }
        }
        if (config.cmdReportRE) {
            if (typeof config.cmdReportRE == "string") {
                this.cmdReportRE = new RegExp(config.cmdReportRE);
            }
            else {
                this.cmdReportRE = config.cmdReportRE;
            }
        }
    }
    TCPCommand.prototype.expandTemplate = function (template, value) {
        // Substitute value placeholder
        var re = /\{value}/g;
        var res = template.replace(re, value);
        return res;
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
            ephemeral: this.ephemeral,
            config: this.templateConfig,
            value: 0
        };
        var templates = [new Shared_1.Control(ctid, templateData)];
        this.ctidList = [ctid];
        return templates;
    };
    TCPCommand.prototype.matchesReport = function (devStr) {
        if (!this.cmdReportRE) {
            return devStr == this.cmdStr;
        }
        var matches = devStr.match(this.cmdReportRE);
        return !!matches;
    };
    TCPCommand.prototype.parseReportValue = function (control, line) {
        if (!this.cmdReportRE) {
            return line;
        }
        var matches = line.match(this.cmdReportRE);
        if (matches && matches.length > 1) {
            return matches[this.cmdReportREMatchIdx];
        }
        return '';
    };
    TCPCommand.prototype.parseQueryResponse = function (control, line) {
        var matches = line.match(this.cmdQueryResponseRE);
        if (matches) {
            return matches[1];
        }
        return '';
    };
    TCPCommand.prototype.queryString = function () {
        if (this.cmdQueryStr) {
            return this.cmdQueryStr;
        }
        return this.cmdStr + "?";
    };
    TCPCommand.prototype.queryResponseMatchString = function () {
        return this.cmdQueryResponseRE;
    };
    TCPCommand.prototype.updateString = function (control, update) {
        if (this.cmdUpdateTemplate) {
            return this.expandTemplate(this.cmdUpdateTemplate, update.value);
        }
        return this.cmdStr + " " + update.value;
    };
    TCPCommand.prototype.updateResponseMatchString = function (update) {
        if (this.cmdUpdateResponseTemplate) {
            return this.expandTemplate(this.cmdUpdateResponseTemplate, update.value);
        }
        return update.value;
    };
    return TCPCommand;
}());
exports.TCPCommand = TCPCommand;
//# sourceMappingURL=TCPCommand.js.map