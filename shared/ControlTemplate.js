"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DCSerializable_1 = require("./DCSerializable");
var Endpoint_1 = require("./Endpoint");
var ControlTemplate = (function (_super) {
    __extends(ControlTemplate, _super);
    function ControlTemplate(_id, data) {
        _super.call(this, _id);
        this.table = ControlTemplate.tableStr;
        this.requiredProperties = [
            'endpoint_id',
            'ctid',
            'name',
            'usertype',
            'control_type',
            'poll',
            'config'
        ];
        if (data) {
            this.loadData(data);
        }
    }
    ControlTemplate.prototype.getDataObject = function () {
        return {
            _id: this._id,
            endpoint_id: this.endpoint_id,
            ctid: this.ctid,
            name: this.name,
            usertype: this.usertype,
            control_type: this.control_type,
            poll: this.poll,
            config: this.config
        };
    };
    ControlTemplate.tableStr = "control_templates";
    ControlTemplate.foreignKeys = [
        {
            type: Endpoint_1.Endpoint,
            fkObjProp: "endpoint",
            fkIdProp: "endpoint_id",
            fkTable: Endpoint_1.Endpoint.tableStr
        }
    ];
    return ControlTemplate;
}(DCSerializable_1.DCSerializable));
exports.ControlTemplate = ControlTemplate;
//# sourceMappingURL=ControlTemplate.js.map