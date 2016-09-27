/**
 *
 * The Control is the basic unit of the DevCtrl application.  A Control represents and individual setting or value
 * on a device (Endpoint).  The frontend provides an interface for users to view and change the values of controls.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DCSerializable_1 = require("./DCSerializable");
var Endpoint_1 = require("./Endpoint");
var Control = (function (_super) {
    __extends(Control, _super);
    function Control(_id, data) {
        _super.call(this, _id);
        this.table = Control.tableStr;
        this.requiredProperties = [
            'endpoint_id',
            'ctid',
            'name',
            'usertype',
            'control_type',
            'poll',
            'config',
            'value'
        ];
        if (data) {
            this.loadData(data);
        }
    }
    Control.prototype.getDataObject = function () {
        return {
            _id: this._id,
            endpoint_id: this.endpoint_id,
            ctid: this.ctid,
            name: this.name,
            usertype: this.usertype,
            control_type: this.control_type,
            poll: this.poll,
            config: this.config,
            value: this.value
        };
    };
    Control.tableStr = "controls";
    Control.foreignKeys = [
        {
            type: Endpoint_1.Endpoint,
            fkObjProp: "endpoint",
            fkIdProp: "endpoint_id",
            fkTable: Endpoint_1.Endpoint.tableStr
        }
    ];
    return Control;
}(DCSerializable_1.DCSerializable));
exports.Control = Control;
//# sourceMappingURL=Control.js.map