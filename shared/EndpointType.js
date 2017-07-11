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
var EndpointType = (function (_super) {
    __extends(EndpointType, _super);
    function EndpointType(_id, data) {
        var _this = _super.call(this, _id) || this;
        _this.table = EndpointType.tableStr;
        _this.requiredProperties = _this.requiredProperties.concat([
            'communicatorClass'
        ]);
        if (data) {
            _this.loadData(data);
        }
        return _this;
    }
    EndpointType.prototype.getDataObject = function () {
        return {
            _id: this._id,
            name: this.name,
            communicatorClass: this.communicatorClass
        };
    };
    return EndpointType;
}(DCSerializable_1.DCSerializable));
EndpointType.tableStr = "endpoint_types";
exports.EndpointType = EndpointType;
//# sourceMappingURL=EndpointType.js.map