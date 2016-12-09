"use strict";
const Control_1 = require("../shared/Control");
const sprintf_js_1 = require("sprintf-js");
//let debug = debugMod("comms");
let debug = console.log;
class TCPCommand {
    constructor(config) {
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
        this.readonly = !!config.readonly;
        this.writeonly = !!config.writeonly;
    }
    expandTemplate(template, value) {
        // Use sprintf to expand the template
        let res = '';
        if (this.control_type == Control_1.Control.CONTROL_TYPE_BOOLEAN) {
            //sprintf does nothing useful with boolean values, use 1 and 0 instead
            value = value ? 1 : 0;
        }
        try {
            res = sprintf_js_1.sprintf(template, value);
        }
        catch (e) {
            debug("Error expanding template " + template);
            debug(e.message);
        }
        return res;
    }
    getControlTemplates() {
        let ctid = this.endpoint_id + "-" + this.cmdStr;
        let templateData = {
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
        let templates = [new Control_1.Control(ctid, templateData)];
        this.ctidList = [ctid];
        return templates;
    }
    matchesReport(devStr) {
        if (!this.cmdReportRE) {
            return devStr == this.cmdStr;
        }
        let matches = devStr.match(this.cmdReportRE);
        return !!matches;
    }
    // Override this function in a custom Command class if necessary
    parseBoolean(value) {
        // Add string representations of 0 and false to standard list of falsey values
        if (typeof value == "string") {
            if (value.toLowerCase() == "false") {
                return false;
            }
            if (parseInt(value) == 0) {
                return false;
            }
        }
        return !!value;
    }
    parseReportValue(control, line) {
        if (!this.cmdReportRE) {
            return line;
        }
        let matches = line.match(this.cmdReportRE);
        if (matches && matches.length > 1) {
            return this.parseValue(matches[this.cmdReportREMatchIdx]);
        }
        return '';
    }
    parseQueryResponse(control, line) {
        let matches = line.match(this.cmdQueryResponseRE);
        if (matches) {
            return this.parseValue(matches[1]);
        }
        return '';
    }
    parseValue(value) {
        if (this.control_type == Control_1.Control.CONTROL_TYPE_RANGE) {
            return parseFloat(value);
        }
        else if (this.control_type == Control_1.Control.CONTROL_TYPE_INT) {
            return parseInt(value);
        }
        else if (this.control_type == Control_1.Control.CONTROL_TYPE_BOOLEAN) {
            return this.parseBoolean(value);
        }
        return value;
    }
    queryString() {
        if (this.cmdQueryStr) {
            return this.cmdQueryStr;
        }
        return `${this.cmdStr}?`;
    }
    queryResponseMatchString() {
        return this.cmdQueryResponseRE;
    }
    updateString(control, update) {
        if (this.cmdUpdateTemplate) {
            return this.expandTemplate(this.cmdUpdateTemplate, update.value);
        }
        return `${this.cmdStr} ${update.value}`;
    }
    updateResponseMatchString(update) {
        if (this.cmdUpdateResponseTemplate) {
            return this.expandTemplate(this.cmdUpdateResponseTemplate, update.value);
        }
        return update.value;
    }
}
exports.TCPCommand = TCPCommand;
//# sourceMappingURL=TCPCommand.js.map