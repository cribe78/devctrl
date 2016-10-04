import {DCSerializableData, DCSerializable} from "./DCSerializable";
import {Control} from "./Control";
import {Panel} from "./Panel";

export interface PanelControlData extends DCSerializableData {
    control_id: string;
    panel_id: string;
    name: string;
}

export class PanelControl extends DCSerializable {
    control_id: string;
    _control: Control;
    panel_id: string;
    _panel: Panel;
    name: string;

    static tableStr = "panel_controls";
    table: string;

    static foreignKeys = [
        {
            type: Control,
            fkObjProp: "control",
            fkIdProp: "control_id",
            fkTable: Control.tableStr
        },
        {
            type: Panel,
            fkObjProp: "panel",
            fkIdProp: "panel_id",
            fkTable: Panel.tableStr
        }
    ];

    constructor(_id: string, data?: PanelControlData) {
        super(_id);
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

    get control(): Control {
        return this._control;
    }

    set control(control: Control) {
        this._control = control;
        this.control_id = control._id;
    }

    get panel() : Panel {
        return this._panel;
    }

    set panel(panel: Panel) {
        this._panel = panel;
        this.panel_id = panel._id;
    }

    getDataObject() : PanelControlData {
        return (<PanelControlData>DCSerializable.defaultDataObject(this));
    }
}