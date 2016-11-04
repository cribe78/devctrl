import {TCPCommand} from "../TCPCommand";
export class IA200Command extends TCPCommand {

    expandTemplate(template: string, value: any) : string {
        // The IA 200 wants ints as 4 digit ascii strings with leading zeros
        let strVal = value.toString();
        let iaVal = "0000" + strVal;
        iaVal = iaVal.substr(-4);

        if (iaVal.search("-") != -1) {
            iaVal = "-" + iaVal.replace("-","");
        }

        // Substitute value placeholder
        let re = /\{value}/g;
        let res = template.replace(re, iaVal);

        return res;
    }
}