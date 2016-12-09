"use strict";
const DCSerializable_1 = require("./DCSerializable");
class EndpointType extends DCSerializable_1.DCSerializable {
    constructor(_id, data) {
        super(_id);
        this.table = EndpointType.tableStr;
        this.requiredProperties = this.requiredProperties.concat([
            'communicatorClass'
        ]);
        if (data) {
            this.loadData(data);
        }
    }
    getDataObject() {
        return {
            _id: this._id,
            name: this.name,
            communicatorClass: this.communicatorClass
        };
    }
}
EndpointType.tableStr = "endpoint_types";
exports.EndpointType = EndpointType;
//# sourceMappingURL=EndpointType.js.map