"use strict";
const DCSerializable_1 = require("./DCSerializable");
class ControlUpdate extends DCSerializable_1.DCSerializable {
    constructor(_id, data) {
        super(_id);
        this.table = ControlUpdate.tableStr;
        this.requiredProperties = [
            'control_id',
            'value',
            'type',
            'status',
            'source'
        ];
        if (data) {
            this.loadData(data);
        }
    }
    getDataObject() {
        return DCSerializable_1.DCSerializable.defaultDataObject(this);
    }
}
ControlUpdate.tableStr = "ControlUpdates";
exports.ControlUpdate = ControlUpdate;
//# sourceMappingURL=ControlUpdate.js.map