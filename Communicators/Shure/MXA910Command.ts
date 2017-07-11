import {TCPCommand} from "../TCPCommand";
import {Control} from "../../shared/Control";
import {sprintf} from "sprintf-js";

let debug = console.log;
export class MXA910Command extends TCPCommand {
    expandTemplate(template: string, value: any) : string {
        if (this.control_type == Control.CONTROL_TYPE_BOOLEAN) {
            value = value ? "ON" : "OFF";
            try {
                let res = sprintf(template, value);
                return res;
            }
            catch(e) {
                debug("Error expanding template " + template);
                debug(e.message);
            }
        }

        return super.expandTemplate(template, value);
    }

    parseBoolean(value) : boolean {
        //console.log(`parse boolean value ${value}`);
        return (value.toLowerCase() != "off");
    }
 }