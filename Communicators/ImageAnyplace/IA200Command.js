"use strict";
const TCPCommand_1 = require("../TCPCommand");
class IA200Command extends TCPCommand_1.TCPCommand {
    expandTemplate(template, value) {
        // The IA 200 wants ints as 4 digit ascii strings with leading zeros
        let strVal = value.toString();
        let iaVal = "0000" + strVal;
        iaVal = iaVal.substr(-4);
        if (iaVal.search("-") != -1) {
            iaVal = "-" + iaVal.replace("-", "");
        }
        // Substitute value placeholder
        let re = /\{value}/g;
        let res = template.replace(re, iaVal);
        return res;
    }
}
exports.IA200Command = IA200Command;
//# sourceMappingURL=IA200Command.js.map