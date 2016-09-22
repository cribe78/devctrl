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
var ControlTemplate_1 = require("./ControlTemplate");
var Control = (function (_super) {
    __extends(Control, _super);
    function Control(_id, data) {
        _super.call(this, _id);
        this.table = Control.tableStr;
        this.requiredProperties = ['control_template_id', 'name', 'usertype', 'value', 'config'];
        if (data) {
            this.loadData(data);
        }
    }
    Object.defineProperty(Control.prototype, "control_template", {
        get: function () {
            return this._control_template;
        },
        set: function (template) {
            this.control_template_id = template._id;
            this._control_template = template;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "usertype", {
        get: function () {
            if (this._usertype) {
                return this._usertype;
            }
            return this.control_template.usertype;
        },
        set: function (newType) {
            this._usertype = newType;
        },
        enumerable: true,
        configurable: true
    });
    Control.prototype.getDataObject = function () {
        return {
            _id: this._id,
            control_template_id: this.control_template_id,
            name: this.name,
            usertype: this._usertype,
            value: this.value,
            config: this.config
        };
    };
    Control.tableStr = "controls";
    Control.foreignKeys = [
        {
            type: ControlTemplate_1.ControlTemplate,
            fkObjProp: "control_template",
            fkIdProp: "control_template_id",
            fkTable: ControlTemplate_1.ControlTemplate.tableStr
        }
    ];
    return Control;
}(DCSerializable_1.DCSerializable));
exports.Control = Control;
//# sourceMappingURL=Control.js.map