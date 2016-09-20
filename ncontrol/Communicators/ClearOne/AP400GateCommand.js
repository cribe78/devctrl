"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ClearOneCommand_1 = require("./ClearOneCommand");
var ControlTemplate_1 = require("../../../shared/ControlTemplate");
var AP400GateCommand = (function (_super) {
    __extends(AP400GateCommand, _super);
    function AP400GateCommand() {
        _super.apply(this, arguments);
    }
    AP400GateCommand.prototype.getControlTemplates = function () {
        var templates = [];
        var micChannels = [1, 2, 3, 4];
        for (var _i = 0, micChannels_1 = micChannels; _i < micChannels_1.length; _i++) {
            var m = micChannels_1[_i];
            var ctid = this.endpoint_id + "." + this.cmdStr + m;
            var templateData = {
                _id: ctid,
                ctid: ctid,
                endpoint_id: this.endpoint_id,
                name: this.cmdStr + " " + m,
                usertype: this.usertype,
                control_type: this.control_type,
                poll: 0,
                config: {}
            };
            templates.push(new ControlTemplate_1.ControlTemplate(ctid, templateData));
        }
        return templates;
    };
    return AP400GateCommand;
}(ClearOneCommand_1.ClearOneCommand));
exports.AP400GateCommand = AP400GateCommand;
//# sourceMappingURL=AP400GateCommand.js.map