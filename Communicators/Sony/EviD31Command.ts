import {TCPCommand} from "../TCPCommand";
import {Control, ControlXYValue} from "../../app/shared/Control";
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
        else if (this.control_type == Control.CONTROL_TYPE_XY) {
            let xyVal = value as ControlXYValue;
            res = template.replace("XXXX", this.hexNumber(value.x));
            res = res.replace("YYYY", this.hexNumber(value.y));
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
            // Value is a hex string, each octet starts with a hex 0,
            // ie, every other byte is 0
            let hexStr = value.charAt(1) + value.charAt(3) + value.charAt(5) + value.charAt(7);
            return parseInt(hexStr, 16);
        }
        else if (this.control_type == Control.CONTROL_TYPE_BOOLEAN) {
            return this.parseBoolean(value);
        }
        else if (this.control_type == Control.CONTROL_TYPE_XY) {
            let hexStrX = value.charAt(1) + value.charAt(3) + value.charAt(5) + value.charAt(7);
            let hexStrY = value.charAt(9) + value.charAt(11) + value.charAt(13) + value.charAt(15);

            let xVal = parseInt(hexStrX, 16);
            let yVal = parseInt(hexStrY, 16);

            if (xVal > 32768) { xVal = xVal - 65536 }
            if (yVal > 32768) { yVal = yVal - 65536 }

            let xy = new ControlXYValue(xVal, yVal);

            if (xy.x )

            return xy;
        }

        return value;
    }
}