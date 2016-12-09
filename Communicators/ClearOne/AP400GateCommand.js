"use strict";
const ClearOneCommand_1 = require("./ClearOneCommand");
const Control_1 = require("../../shared/Control");
class AP400GateCommand extends ClearOneCommand_1.ClearOneCommand {
    getControlTemplates() {
        let templates = [];
        let micChannels = [1, 2, 3, 4];
        this.ctidList = [];
        for (let m of micChannels) {
            let ctid = this.endpoint_id + "-" + this.cmdStr + m;
            let templateData = {
                _id: ctid,
                ctid: ctid,
                endpoint_id: this.endpoint_id,
                name: this.cmdStr + " " + m,
                usertype: this.usertype,
                control_type: this.control_type,
                poll: 0,
                config: {},
                value: 0
            };
            templates.push(new Control_1.Control(ctid, templateData));
            this.ctidList.push(ctid);
        }
        return templates;
    }
}
exports.AP400GateCommand = AP400GateCommand;
//# sourceMappingURL=AP400GateCommand.js.map