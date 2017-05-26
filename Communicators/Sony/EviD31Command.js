"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var TCPCommand_1 = require("../TCPCommand");
var Control_1 = require("../../shared/Control");
var EviD31Command = (function (_super) {
    __extends(EviD31Command, _super);
    function EviD31Command() {
        return _super !== null && _super.apply(this, arguments) || this;
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
        else if (this.control_type == Control_1.Control.CONTROL_TYPE_XY) {
            var xyVal = value;
            res = template.replace("XXXX", this.hexNumber(value.x));
            res = res.replace("YYYY", this.hexNumber(value.y));
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
            // Value is a hex string, each octet starts with a hex 0,
            // ie, every other byte is 0
            var hexStr = value.charAt(1) + value.charAt(3) + value.charAt(5) + value.charAt(7);
            return parseInt(hexStr, 16);
        }
        else if (this.control_type == Control_1.Control.CONTROL_TYPE_BOOLEAN) {
            return this.parseBoolean(value);
        }
        else if (this.control_type == Control_1.Control.CONTROL_TYPE_XY) {
            var hexStrX = value.charAt(1) + value.charAt(3) + value.charAt(5) + value.charAt(7);
            var hexStrY = value.charAt(9) + value.charAt(11) + value.charAt(13) + value.charAt(15);
            var xVal = parseInt(hexStrX, 16);
            var yVal = parseInt(hexStrY, 16);
            if (xVal > 32768) {
                xVal = xVal - 65536;
            }
            if (yVal > 32768) {
                yVal = yVal - 65536;
            }
            var xy = new Control_1.ControlXYValue(xVal, yVal);
            if (xy.x)
                return xy;
        }
        return value;
    };
    return EviD31Command;
}(TCPCommand_1.TCPCommand));
exports.EviD31Command = EviD31Command;
//# sourceMappingURL=EviD31Command.js.map