"use strict";
const DCSerializable_1 = require("./DCSerializable");
const Control_1 = require("./Control");
const Panel_1 = require("./Panel");
class PanelControl extends DCSerializable_1.DCSerializable {
    constructor(_id, data) {
        super(_id);
        this.table = PanelControl.tableStr;
        this.foreignKeys = [
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
        this.requiredProperties = this.requiredProperties.concat([
            'control_id',
            'panel_id'
        ]);
        if (data) {
            this.loadData(data);
        }
    }
    get control() {
        return this._control;
    }
    set control(control) {
        this._control = control;
        this.control_id = control._id;
    }
    get endpoint() {
        return this._control.endpoint;
    }
    get panel() {
        return this._panel;
    }
    set panel(panel) {
        this._panel = panel;
        this.panel_id = panel._id;
    }
    getDataObject() {
        return DCSerializable_1.DCSerializable.defaultDataObject(this);
    }
}
PanelControl.tableStr = "panel_controls";
exports.PanelControl = PanelControl;
//# sourceMappingURL=PanelControl.js.map