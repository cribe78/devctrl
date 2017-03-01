import {TCPCommand} from "../TCPCommand";
import {Control} from "../../shared/Control";
export class EviD31Command extends TCPCommand {
    expandTemplate(template: string, value: any) : string {
        // Use sprintf to expand the template
        let res = '';

        if (this.control_type == Control.CONTROL_TYPE_RANGE ||
            this.control_type == Control.CONTROL_TYPE_INT) {
            let hexNum = this.hexNumber(value);

            res = template.replace("ZZZZ", hexNum);
        }

        else if (this.control_type == Control.CONTROL_TYPE_BOOLEAN) {
            //This protocol uses 02 for On and 03 for off
            value = value ? "02" : "03";
            res = template.replace("ZZ", value);
        }


        return res;
    }

    /**
     * Converts a number to a hex string of the format required by this devices
     */
    hexNumber(num : number ) {
        if (num < 0) {
            num += 65536;
        }

        let hexVal = num.toString(16);
        //0 pad the hexVal
        while (hexVal.length < 4) {
            hexVal = "0" + hexVal;
        }

        let bigHex = "0" + hexVal.charAt(0) + "0" + hexVal.charAt(1) + "0" + hexVal.charAt(2) + "0" + hexVal.charAt(3);

        return bigHex;
    }


    parseValue(value) : any {
        if (this.control_type == Control.CONTROL_TYPE_RANGE ||
            this.control_type == Control.CONTROL_TYPE_INT) {
            // Value is a hex string, each octet starts with a hex 0
            let hexStr = value.charAt(1) + value.charAt(3) + value.charAt(5) + value.charAt(7);
            return parseInt(hexStr, 16);
        }
        else if (this.control_type == Control.CONTROL_TYPE_BOOLEAN) {
            return this.parseBoolean(value);
        }

        return value;
    }
}