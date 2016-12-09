"use strict";
const DCSerializable_1 = require("./DCSerializable");
class OptionSet extends DCSerializable_1.DCSerializable {
    constructor(_id, data) {
        super(_id);
        this.table = OptionSet.tableStr;
        this.requiredProperties = this.requiredProperties.concat([
            'options'
        ]);
        if (data) {
            this.loadData(data);
        }
    }
    getDataObject() {
        return DCSerializable_1.DCSerializable.defaultDataObject(this);
    }
}
OptionSet.tableStr = "option_sets";
exports.OptionSet = OptionSet;
//# sourceMappingURL=OptionSet.js.map