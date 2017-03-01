"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TCPCommand_1 = require("../TCPCommand");
var Control_1 = require("../../shared/Control");
var EviD31Command = (function (_super) {
    __extends(EviD31Command, _super);
    function EviD31Command() {
        return _super.apply(this, arguments) || this;
    }
    EviD31Command.prototype.expandTemplate = function (template, value) {
        // Use sprintf to expand the template
        var res = '';
        if (this.control_type == Control_1.Control.CONTROL_TYPE_RANGE ||
            this.control_type == Control_1.Control.CONTROL_TYPE_INT) {
            var hexNum = this.hexNumber(value);
            res = template.replace("ZZZZ", hexNum);
        }
        else if (this.control_type == Control_1.Control.CONTROL_TYPE_BOOLEAN) {
            //This protocol uses 02 for On and 03 for off
            value = value ? "02" : "03";
            res = template.replace("ZZ", value);
        }
        return res;
    };
    /**
     * Converts a number to a hex string of the format required by this devices
     */
    EviD31Command.prototype.hexNumber = function (num) {
        if (num < 0) {
            num += 65536;
        }
        var hexVal = num.toString(16);
        //0 pad the hexVal
        while (hexVal.length < 4) {
            hexVal = "0" + hexVal;
        }
        var bigHex = "0" + hexVal.charAt(0) + "0" + hexVal.charAt(1) + "0" + hexVal.charAt(2) + "0" + hexVal.charAt(3);
        return bigHex;
    };
    EviD31Command.prototype.parseValue = function (value) {
        if (this.control_type == Control_1.Control.CONTROL_TYPE_RANGE ||
            this.control_type == Control_1.Control.CONTROL_TYPE_INT) {
            // Value is a hex string, each octet starts with a hex 0
            var hexStr = value.charAt(1) + value.charAt(3) + value.charAt(5) + value.charAt(7);
            return parseInt(hexStr, 16);
        }
        else if (this.control_type == Control_1.Control.CONTROL_TYPE_BOOLEAN) {
            return this.parseBoolean(value);
        }
        return value;
    };
    return EviD31Command;
}(TCPCommand_1.TCPCommand));
exports.EviD31Command = EviD31Command;
//# sourceMappingURL=EviD31Command.js.map