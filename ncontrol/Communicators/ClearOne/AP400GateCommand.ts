import {ClearOneCommand, IClearOneCommandConfig} from "./ClearOneCommand";
import {Control, ControlData} from "../../../shared/Control";

export class AP400GateCommand extends ClearOneCommand {


    getControlTemplates() : Control[] {
        let templates : Control[] = [];
        let micChannels = [1,2,3,4];

        this.ctidList = [];

        for (let m of micChannels) {
            let ctid = this.endpoint_id + "-" + this.cmdStr + m;
            let templateData : ControlData = {
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

            templates.push(new Control(ctid, templateData));
            this.ctidList.push(ctid);
        }

        return templates;
    }
}