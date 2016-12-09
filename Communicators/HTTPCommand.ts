import {ControlData, Control} from "../shared/Control";
import {sprintf} from "sprintf-js";
let debug = console.log;

export interface IHTTPCommandConfig {
    cmdPathFunction? : (value: any)=>string;
    cmdPathTemplate? : string; // A function returning the path or a template to expand
    cmdResponseRE : string;  //
    controlData: ControlData;
    readonly?: boolean;
    writeonly?: boolean;
}


export class HTTPCommand {
    cmdPathFunction : (value: any)=>string;
    cmdPathTemplate : string; // A function returning the path or a template to expand
    cmdResponseRE : RegExp;  //
    controlData: ControlData;
    readonly: boolean;
    writeonly: boolean;

    constructor(config: IHTTPCommandConfig) {
        this.cmdPathFunction = config.cmdPathFunction;
        this.cmdPathTemplate = config.cmdPathTemplate;
        this.cmdResponseRE = new RegExp(config.cmdResponseRE);
        this.controlData = config.controlData;

        this.readonly = !! config.readonly;
        this.writeonly = !! config.writeonly;
    }

    commandPath(value : any) : string {
        let path = `/${value}`;   //  Fairly useless default value
        if (this.cmdPathFunction) {
            path = this.cmdPathFunction(value);
        }
        else if (typeof this.cmdPathTemplate !== 'undefined') {
            if (this.controlData.control_type == Control.CONTROL_TYPE_BOOLEAN) {
                value = value ? 1 : 0;
            }

            path = sprintf(this.cmdPathTemplate, value);
        }

        return path;
    }


    getControls() : Control[] {
        return [ new Control(this.controlData._id, this.controlData)];
    }

    matchResponse(resp : string) {
        let matches = resp.match(this.cmdResponseRE);
        if (matches) {
            return true;
        }
        return false;
    }

    parseValue(value) : any {
        if (this.controlData.control_type == Control.CONTROL_TYPE_RANGE) {
            return parseFloat(value);
        }
        else if (this.controlData.control_type == Control.CONTROL_TYPE_INT) {
            return parseInt(value);
        }
        else if (this.controlData.control_type == Control.CONTROL_TYPE_BOOLEAN) {
            // Add string representations of 0 and false to standard list of falsey values
            if (typeof value == "string") {
                if (value.toLowerCase() == "false") {
                    return false;
                }
                if (parseInt(value) == 0) {
                    return false;
                }
            }

            return !!value;
        }

        return value;
    }
}
