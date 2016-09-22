"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DCSerializable_1 = require("./DCSerializable");
var EndpointType = (function (_super) {
    __extends(EndpointType, _super);
    function EndpointType(_id, data) {
        _super.call(this, _id);
        this.table = EndpointType.tableStr;
        this.requiredProperties = [
            'communicatorClass',
            'name'
        ];
        if (data) {
            this.loadData(data);
        }
    }
    EndpointType.prototype.getDataObject = function () {
        return {
            _id: this._id,
            name: this.name,
            communicatorClass: this.communicatorClass
        };
    };
    EndpointType.tableStr = "endpoint_types";
    return EndpointType;
}(DCSerializable_1.DCSerializable));
exports.EndpointType = EndpointType;
//# sourceMappingURL=EndpointType.js.map