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
var OptionSet_1 = require("./OptionSet");
var Control = (function (_super) {
    __extends(Control, _super);
    function Control(_id, data) {
        _super.call(this, _id);
        this.ephemeral = false;
        this.foreignKeys = [
            {
                type: Endpoint_1.Endpoint,
                fkObjProp: "endpoint",
                fkIdProp: "endpoint_id",
                fkTable: Endpoint_1.Endpoint.tableStr
            },
            {
                type: OptionSet_1.OptionSet,
                fkObjProp: "option_set",
                fkIdProp: "option_set_id",
                fkTable: OptionSet_1.OptionSet.tableStr
            }
        ];
        this.table = Control.tableStr;
        this.requiredProperties = this.requiredProperties.concat([
            'endpoint_id',
            'ctid',
            'usertype',
            'control_type',
            'poll',
            'config',
            'value'
        ]);
        this.optionalProperties = ['ephemeral', 'option_set_id'];
        if (data) {
            this.loadData(data);
        }
    }
    Object.defineProperty(Control.prototype, "endpoint", {
        get: function () {
            return this._endpoint;
        },
        set: function (endpoint) {
            this._endpoint = endpoint;
            this.endpoint_id = endpoint._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "option_set", {
        get: function () {
            return this._option_set;
        },
        set: function (option_set) {
            this._option_set = option_set;
            this.option_set_id = option_set._id;
        },
        enumerable: true,
        configurable: true
    });
    Control.prototype.fkSelectName = function () {
        if (this._endpoint) {
            return this._endpoint.name + ": " + this.name;
        }
        return this.name;
    };
    Control.prototype.getDataObject = function () {
        return DCSerializable_1.DCSerializable.defaultDataObject(this);
    };
    Control.tableStr = "controls";
    // usertype and control_type values
    Control.CONTROL_TYPE_BOOLEAN = "boolean";
    Control.CONTROL_TYPE_STRING = "string";
    Control.CONTROL_TYPE_RANGE = "range";
    Control.CONTROL_TYPE_INT = "int";
    Control.USERTYPE_BUTTON = "button";
    Control.USERTYPE_BUTTON_SET = "button-set";
    Control.USERTYPE_F32_MULTIBUTTON = "f32-multibutton";
    Control.USERTYPE_SLIDER_2D = "slider2d";
    Control.USERTYPE_SWITCH = "switch";
    Control.USERTYPE_SLIDER = "slider";
    Control.USERTYPE_READONLY = "readonly";
    Control.USERTYPE_LEVEL = "level";
    Control.USERTYPE_SELECT = "select";
    Control.USERTYPE_SELECT_READONLY = "select-readonly";
    return Control;
}(DCSerializable_1.DCSerializable));
exports.Control = Control;
//# sourceMappingURL=Control.js.map