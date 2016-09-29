import {TCPCommand} from "../TCPCommand";
import {Control} from "../../../shared/Control";
import {ControlUpdateData} from "../../../shared/ControlUpdate";

export class ExtronSWUSBCommand extends TCPCommand {

    deviceQueryString() {
        return "I";
    }

    deviceUpdateString(control: Control, update: ControlUpdateData) {
        return `${ update.value }!`;
    }

    matchesDeviceString(str: string) : boolean {
        return str.substring(0,3) == "Chn";
    }

    parseControlValue(control: Control, line: string) : any {
        let ret = 0;
        let chStr = line.substring(0,3);
        if (chStr == "Chn" && line.length >= 4) {
            let retStr = line.substring(3,4);
            ret = parseInt(retStr);
        }

        return ret;
    }
}