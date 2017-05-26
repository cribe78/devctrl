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
var IA200Command = (function (_super) {
    __extends(IA200Command, _super);
    function IA200Command() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IA200Command.prototype.expandTemplate = function (template, value) {
        // The IA 200 wants ints as 4 digit ascii strings with leading zeros
        var strVal = value.toString();
        var iaVal = "0000" + strVal;
        iaVal = iaVal.substr(-4);
        if (iaVal.search("-") != -1) {
            iaVal = "-" + iaVal.replace("-", "");
        }
        // Substitute value placeholder
        var re = /\{value}/g;
        var res = template.replace(re, iaVal);
        return res;
    };
    return IA200Command;
}(TCPCommand_1.TCPCommand));
exports.IA200Command = IA200Command;
//# sourceMappingURL=IA200Command.js.map