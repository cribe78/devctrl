"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DCSerializable_1 = require("./DCSerializable");
var OptionSet = (function (_super) {
    __extends(OptionSet, _super);
    function OptionSet(_id, data) {
        var _this = _super.call(this, _id) || this;
        _this.table = OptionSet.tableStr;
        _this.requiredProperties = _this.requiredProperties.concat([
            'options'
        ]);
        if (data) {
            _this.loadData(data);
        }
        return _this;
    }
    OptionSet.prototype.getDataObject = function () {
        return DCSerializable_1.DCSerializable.defaultDataObject(this);
    };
    return OptionSet;
}(DCSerializable_1.DCSerializable));
OptionSet.tableStr = "option_sets";
exports.OptionSet = OptionSet;
//# sourceMappingURL=OptionSet.js.map