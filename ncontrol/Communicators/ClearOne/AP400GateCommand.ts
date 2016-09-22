import {ClearOneCommand, IClearOneCommandConfig} from "./ClearOneCommand";
import {ControlTemplate, ControlTemplateData} from "../../../shared/ControlTemplate";

export class AP400GateCommand extends ClearOneCommand {


    getControlTemplates() : ControlTemplate[] {
        let templates : ControlTemplate[] = [];
        let micChannels = [1,2,3,4];

        this.ctidList = [];

        for (let m of micChannels) {
            let ctid = this.endpoint_id + "." + this.cmdStr + m;
            let templateData : ControlTemplateData = {
                _id: ctid,
                ctid: ctid,
                endpoint_id: this.endpoint_id,
                name: this.cmdStr + " " + m,
                usertype: this.usertype,
                control_type: this.control_type,
                poll: 0,
                config: {}
            };

            templates.push(new ControlTemplate(ctid, templateData));
            this.ctidList.push(ctid);
        }

        return templates;
    }
}