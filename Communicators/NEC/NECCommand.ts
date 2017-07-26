import {TCPCommand} from "../TCPCommand";
import {Control} from "../../app/shared/Control";
import {ControlUpdateData} from "../../app/shared/ControlUpdate";
export class NECCommand extends TCPCommand {
    /**
     * This implementation is specific to this protocol and is special cased for individual commands
     * @param value
     */

    parseValue(value) : any {
        if (this.cmdStr == "Power") {
            // 04 means power on, anything else is off
            return value == "04";
        }

        if (this.control_type == Control.CONTROL_TYPE_STRING) {
            // Byte values correspond to ASCII characters, NULL terminated
            let str = value.replace(/0+$/,'');
            return str;
        }


        return value;
    }

    updateString(control: Control, update: ControlUpdateData) {
        if (this.cmdStr == "Power" && update.value == true) {
            return "02 00 00 00 00 02";
        }
        else if (this.cmdStr == "Power" && update.value == false) {
            return "02 01 00 00 00 03";
        }
        else if (this.cmdStr == "Video Mute" && update.value == true) {
            return "02 10 00 00 00 12";
        }
        else if (this.cmdStr == "Video Mute" && update.value == false) {
            return "02 11 00 00 00 13";
        }

        if (this.cmdUpdateTemplate) {
            return this.expandTemplate(this.cmdUpdateTemplate, update.value);
        }

        return "";
    }
}