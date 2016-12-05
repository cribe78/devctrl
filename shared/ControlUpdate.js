"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DCSerializable_1 = require("./DCSerializable");
var ControlUpdate = (function (_super) {
    __extends(ControlUpdate, _super);
    function ControlUpdate(_id, data) {
        _super.call(this, _id);
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
    ControlUpdate.prototype.getDataObject = function () {
        return DCSerializable_1.DCSerializable.defaultDataObject(this);
    };
    ControlUpdate.tableStr = "ControlUpdates";
    return ControlUpdate;
}(DCSerializable_1.DCSerializable));
exports.ControlUpdate = ControlUpdate;
//# sourceMappingURL=ControlUpdate.js.map