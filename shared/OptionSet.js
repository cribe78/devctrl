"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DCSerializable_1 = require("./DCSerializable");
var OptionSet = (function (_super) {
    __extends(OptionSet, _super);
    function OptionSet(_id, data) {
        _super.call(this, _id);
        this.table = OptionSet.tableStr;
        this.requiredProperties = this.requiredProperties.concat([
            'options'
        ]);
        if (data) {
            this.loadData(data);
        }
    }
    OptionSet.prototype.getDataObject = function () {
        return DCSerializable_1.DCSerializable.defaultDataObject(this);
    };
    OptionSet.tableStr = "option_sets";
    return OptionSet;
}(DCSerializable_1.DCSerializable));
exports.OptionSet = OptionSet;
//# sourceMappingURL=OptionSet.js.map