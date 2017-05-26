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
var sprintf_js_1 = require("sprintf-js");
var debug = console.log;
var MXA910Command = (function (_super) {
    __extends(MXA910Command, _super);
    function MXA910Command() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MXA910Command.prototype.expandTemplate = function (template, value) {
        if (this.control_type == Control_1.Control.CONTROL_TYPE_BOOLEAN) {
            value = value ? "ON" : "OFF";
            try {
                var res = sprintf_js_1.sprintf(template, value);
                return res;
            }
            catch (e) {
                debug("Error expanding template " + template);
                debug(e.message);
            }
        }
        return _super.prototype.expandTemplate.call(this, template, value);
    };
    MXA910Command.prototype.parseBoolean = function (value) {
        //console.log(`parse boolean value ${value}`);
        return (value.toLowerCase() != "off");
    };
    return MXA910Command;
}(TCPCommand_1.TCPCommand));
exports.MXA910Command = MXA910Command;
//# sourceMappingURL=MXA910Command.js.map