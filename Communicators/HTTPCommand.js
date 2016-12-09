"use strict";
const Control_1 = require("../shared/Control");
const sprintf_js_1 = require("sprintf-js");
let debug = console.log;
class HTTPCommand {
    constructor(config) {
        this.cmdPathFunction = config.cmdPathFunction;
        this.cmdPathTemplate = config.cmdPathTemplate;
        this.cmdResponseRE = new RegExp(config.cmdResponseRE);
        this.controlData = config.controlData;
        this.readonly = !!config.readonly;
        this.writeonly = !!config.writeonly;
    }
    commandPath(value) {
        let path = `/${value}`; //  Fairly useless default value
        if (this.cmdPathFunction) {
            path = this.cmdPathFunction(value);
        }
        else if (typeof this.cmdPathTemplate !== 'undefined') {
            if (this.controlData.control_type == Control_1.Control.CONTROL_TYPE_BOOLEAN) {
                value = value ? 1 : 0;
            }
            path = sprintf_js_1.sprintf(this.cmdPathTemplate, value);
        }
        return path;
    }
    getControls() {
        return [new Control_1.Control(this.controlData._id, this.controlData)];
    }
    matchResponse(resp) {
        let matches = resp.match(this.cmdResponseRE);
        if (matches) {
            return true;
        }
        return false;
    }
    parseValue(value) {
        if (this.controlData.control_type == Control_1.Control.CONTROL_TYPE_RANGE) {
            return parseFloat(value);
        }
        else if (this.controlData.control_type == Control_1.Control.CONTROL_TYPE_INT) {
            return parseInt(value);
        }
        else if (this.controlData.control_type == Control_1.Control.CONTROL_TYPE_BOOLEAN) {
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
        return value;
    }
}
exports.HTTPCommand = HTTPCommand;
//# sourceMappingURL=HTTPCommand.js.map