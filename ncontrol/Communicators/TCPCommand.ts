import {
    Control,
    ControlData
} from "../../shared/Shared";
import {ControlUpdate, ControlUpdateData} from "../../shared/ControlUpdate";

export interface ITCPCommandConfig {
    cmdStr: string;
    endpoint_id: string;
    control_type: string;
    usertype: string;
    templateConfig: ITCPTemplateConfig;
    poll?: number;
}

export interface ITCPTemplateConfig {
    min?: number;
    max?: number;
    options?: any;

}


export class TCPCommand {
    cmdStr: string;
    name: string;
    endpoint_id: string;
    usertype: string;
    control_type: string;
    templateConfig: ITCPTemplateConfig;
    ctidList: string[];
    poll: number = 0;

    constructor(config: ITCPCommandConfig) {
        this.cmdStr = config.cmdStr;
        this.name = config.cmdStr;
        this.endpoint_id = config.endpoint_id;
        this.usertype = config.usertype;
        this.control_type = config.control_type;
        this.templateConfig = config.templateConfig;

        if (config.poll) {
            this.poll = config.poll;
        }
    }


    deviceQueryString() {
        return `${ this.cmdStr }?`;
    }

    deviceUpdateString(control: Control, update: ControlUpdateData) {
        return `${ this.cmdStr } ${ update.value }`;
    }

    getControlTemplates() : Control[] {
        let ctid = this.endpoint_id + "-" + this.cmdStr;
        let templateData : ControlData = {
            _id: ctid,
            ctid: ctid,
            endpoint_id: this.endpoint_id,
            usertype: this.usertype,
            name: this.name,
            control_type: this.control_type,
            poll: this.poll,
            config: this.templateConfig,
            value: 0
        };
        let templates = [ new Control(ctid, templateData)];
        this.ctidList = [ctid];

        return templates;
    }

    matchesDeviceString(devStr: string) : boolean {
        return false;
    }

    parseControlValue(control: Control, line: string) : any {
        return line;
    }

}