import {
    ControlTemplate,
    ControlTemplateData
} from "../../shared/Shared";

export interface ITCPCommandConfig {
    cmdStr: string;
    endpoint_id: string;
    control_type: string;
    usertype: string;
    templateConfig: ITCPTemplateConfig;
}

export interface ITCPTemplateConfig {
    min?: number;
    max?: number;

}


export class TCPCommand {
    cmdStr: string;
    name: string;
    endpoint_id: string;
    usertype: string;
    control_type: string;
    templateConfig: ITCPTemplateConfig;

    constructor(config: ITCPCommandConfig) {
        this.cmdStr = config.cmdStr;
        this.name = config.cmdStr;
        this.endpoint_id = config.endpoint_id;
        this.usertype = config.usertype;
        this.control_type = config.control_type;
        this.templateConfig = config.templateConfig;
    }

    deviceUpdateString(value: any) {
        return `${ this.cmdStr } ${ value }`;
    }

    deviceQueryString() {
        return `${ this.cmdStr }?`;
    }

    getControlTemplates() : ControlTemplate[] {
        let ctid = this.endpoint_id + "." + this.cmdStr;
        let templateData : ControlTemplateData = {
            _id: ctid,
            ctid: ctid,
            endpoint_id: this.endpoint_id,
            usertype: this.usertype,
            name: this.name,
            control_type: this.control_type,
            poll: 0,
            config: {}
        };
        let templates = [ new ControlTemplate(ctid, templateData)];

        return templates;
    }

    matchesDeviceString(devStr: string) : boolean {
        return false;
    }

}