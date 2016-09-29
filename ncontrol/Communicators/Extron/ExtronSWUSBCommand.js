"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TCPCommand_1 = require("../TCPCommand");
var ExtronSWUSBCommand = (function (_super) {
    __extends(ExtronSWUSBCommand, _super);
    function ExtronSWUSBCommand() {
        _super.apply(this, arguments);
    }
    ExtronSWUSBCommand.prototype.deviceQueryString = function () {
        return "I";
    };
    ExtronSWUSBCommand.prototype.deviceUpdateString = function (control, update) {
        return update.value + "!";
    };
    ExtronSWUSBCommand.prototype.matchesDeviceString = function (str) {
        return str.substring(0, 3) == "Chn";
    };
    ExtronSWUSBCommand.prototype.parseControlValue = function (control, line) {
        var ret = 0;
        var chStr = line.substring(0, 3);
        if (chStr == "Chn" && line.length >= 4) {
            var retStr = line.substring(3, 4);
            ret = parseInt(retStr);
        }
        return ret;
    };
    return ExtronSWUSBCommand;
}(TCPCommand_1.TCPCommand));
exports.ExtronSWUSBCommand = ExtronSWUSBCommand;
//# sourceMappingURL=ExtronSWUSBCommand.js.map