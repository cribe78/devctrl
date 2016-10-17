
import {ControlUpdate, ControlUpdateData} from "../shared/ControlUpdate";
import {Control, ControlData} from "../shared/Control";

export interface ITCPCommandConfig {
    cmdStr: string;
    cmdQueryStr?: string; // The query string to send to have this value reported
    cmdQueryResponseRE?: string | RegExp; // RE to match the response to a device poll
    cmdUpdateTemplate?: string; // Send this string to change a setting
    cmdUpdateResponseTemplate?: string; // What the device sends to report a change
    cmdReportRE?: string | RegExp;  // How the device reports a change to this command
    cmdReportREMatchIdx?: number; // cmdReport RegEx is processed with match. Value is at this location in matches[]
    endpoint_id: string;
    control_type: string;
    usertype: string;
    templateConfig: ITCPTemplateConfig;
    poll?: number;
    ephemeral?: boolean;
}

export interface ITCPTemplateConfig {
    min?: number;
    max?: number;
    options?: any;

}


export class TCPCommand {
    cmdStr: string;
    cmdQueryStr: string; // The query string to send to have this value reported
    cmdQueryResponseRE: RegExp = /^$a/; // RE to match the response to a device poll, default matches nothing
    cmdUpdateTemplate: string; // Send this string to change a setting
    cmdUpdateResponseTemplate: string; // What the device reports after an update
    cmdReportRE: RegExp = /^$a/; // How the device reports an external change to this command. default matches nothing
    cmdReportREMatchIdx: number;
    name: string;
    endpoint_id: string;
    usertype: string;
    control_type: string;
    templateConfig: ITCPTemplateConfig;
    ctidList: string[];
    poll: number = 0;
    ephemeral: boolean;


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
        this.ephemeral = !!config.ephemeral;

        this.cmdQueryStr = config.cmdQueryStr ? config.cmdQueryStr : '';
        this.cmdUpdateTemplate = config.cmdUpdateTemplate ? config.cmdUpdateTemplate : '';
        this.cmdUpdateResponseTemplate = config.cmdUpdateResponseTemplate ? config.cmdUpdateResponseTemplate : '';
        this.cmdReportREMatchIdx = config.cmdReportREMatchIdx ? config.cmdReportREMatchIdx : 1;
        
        if (config.cmdQueryResponseRE) {
            if (typeof config.cmdQueryResponseRE == "string") {
                this.cmdQueryResponseRE = new RegExp(<string>config.cmdQueryResponseRE);
            }
            else {
                this.cmdQueryResponseRE = <RegExp>config.cmdQueryResponseRE;
            }
        }

        if (config.cmdReportRE) {
            if (typeof config.cmdReportRE == "string") {
                this.cmdReportRE = new RegExp(<string>config.cmdReportRE);
            }
            else {
                this.cmdReportRE = <RegExp>config.cmdReportRE;
            }
        }
    }

    expandTemplate(template: string, value: any) : string {
        // Substitute value placeholder
        let re = /\{value}/g;
        let res = template.replace(re, value);

        return res;
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
            ephemeral: this.ephemeral,
            config: this.templateConfig,
            value: 0
        };
        let templates = [ new Control(ctid, templateData)];
        this.ctidList = [ctid];

        return templates;
    }


    matchesReport(devStr: string) : boolean {
        if (! this.cmdReportRE) {
            return devStr == this.cmdStr;
        }

        let matches = devStr.match(this.cmdReportRE);

        return !!matches;
    }


    parseReportValue(control: Control, line: string) : any {
        if (! this.cmdReportRE) {
            return line;
        }

        let matches = line.match(this.cmdReportRE);

        if (matches && matches.length > 1) {
            return matches[this.cmdReportREMatchIdx];
        }

        return '';
    }

    parseQueryResponse(control: Control, line: string) : any {
        let matches = line.match(this.cmdQueryResponseRE);

        if (matches) {
            return matches[1];
        }

        return '';
    }


    queryString() : string {
        if (this.cmdQueryStr) {
            return this.cmdQueryStr;
        }

        return `${this.cmdStr}?`;
    }

    queryResponseMatchString() : string | RegExp {
        return this.cmdQueryResponseRE;
    }

    updateString(control: Control, update: ControlUpdateData) {
        if (this.cmdUpdateTemplate) {
            return this.expandTemplate(this.cmdUpdateTemplate, update.value);
        }

        return `${ this.cmdStr } ${ update.value }`;
    }

    updateResponseMatchString(update: ControlUpdateData) : string {
        if (this.cmdUpdateResponseTemplate) {
            return this.expandTemplate(this.cmdUpdateResponseTemplate, update.value);
        }

        return update.value;
    }



}