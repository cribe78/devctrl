"use strict";
(function (CommandType) {
    CommandType[CommandType["Query"] = 0] = "Query";
    CommandType[CommandType["Execute"] = 1] = "Execute";
    CommandType[CommandType["Set"] = 2] = "Set";
})(exports.CommandType || (exports.CommandType = {}));
var CommandType = exports.CommandType;
(function (CommandStatus) {
    CommandStatus[CommandStatus["Queued"] = 0] = "Queued";
    CommandStatus[CommandStatus["Executed"] = 1] = "Executed";
    CommandStatus[CommandStatus["Error"] = 2] = "Error";
})(exports.CommandStatus || (exports.CommandStatus = {}));
var CommandStatus = exports.CommandStatus;
var Command = (function () {
    function Command(data) {
        this.data = data;
    }
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=Command.js.map