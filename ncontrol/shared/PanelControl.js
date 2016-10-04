"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DCSerializable_1 = require("./DCSerializable");
var Control_1 = require("./Control");
var Panel_1 = require("./Panel");
var PanelControl = (function (_super) {
    __extends(PanelControl, _super);
    function PanelControl(_id, data) {
        _super.call(this, _id);
        this.table = PanelControl.tableStr;
        this.requiredProperties = [
            'control_id',
            'panel_id',
            'name'
        ];
        if (data) {
            this.loadData(data);
        }
    }
    Object.defineProperty(PanelControl.prototype, "control", {
        get: function () {
            return this._control;
        },
        set: function (control) {
            this._control = control;
            this.control_id = control._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanelControl.prototype, "panel", {
        get: function () {
            return this._panel;
        },
        set: function (panel) {
            this._panel = panel;
            this.panel_id = panel._id;
        },
        enumerable: true,
        configurable: true
    });
    PanelControl.prototype.getDataObject = function () {
        return DCSerializable_1.DCSerializable.defaultDataObject(this);
    };
    PanelControl.tableStr = "panel_controls";
    PanelControl.foreignKeys = [
        {
            type: Control_1.Control,
            fkObjProp: "control",
            fkIdProp: "control_id",
            fkTable: Control_1.Control.tableStr
        },
        {
            type: Panel_1.Panel,
            fkObjProp: "panel",
            fkIdProp: "panel_id",
            fkTable: Panel_1.Panel.tableStr
        }
    ];
    return PanelControl;
}(DCSerializable_1.DCSerializable));
exports.PanelControl = PanelControl;
//# sourceMappingURL=PanelControl.js.map