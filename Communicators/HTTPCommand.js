"use strict";
var Control_1 = require("../shared/Control");
var sprintf_js_1 = require("sprintf-js");
var debug = console.log;
var HTTPCommand = (function () {
    function HTTPCommand(config) {
        this.cmdPathFunction = config.cmdPathFunction;
        this.cmdPathTemplate = config.cmdPathTemplate;
        this.cmdResponseRE = new RegExp(config.cmdResponseRE);
        this.controlData = config.controlData;
        this.readonly = !!config.readonly;
        this.writeonly = !!config.writeonly;
    }
    HTTPCommand.prototype.commandPath = function (value) {
        var path = "/" + value; //  Fairly useless default value
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
    };
    HTTPCommand.prototype.getControls = function () {
        return [new Control_1.Control(this.controlData._id, this.controlData)];
    };
    HTTPCommand.prototype.matchResponse = function (resp) {
        var matches = resp.match(this.cmdResponseRE);
        if (matches.length) {
            return true;
        }
        return false;
    };
    HTTPCommand.prototype.parseValue = function (value) {
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
    };
    return HTTPCommand;
}());
exports.HTTPCommand = HTTPCommand;
//# sourceMappingURL=HTTPCommand.js.map