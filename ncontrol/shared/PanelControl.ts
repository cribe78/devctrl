import {DCSerializableData, DCSerializable} from "./DCSerializable";
import {Control} from "./Control";
import {Panel} from "./Panel";
import {Endpoint} from "./Endpoint";

export interface PanelControlData extends DCSerializableData {
    control_id: string;
    panel_id: string;
}

export class PanelControl extends DCSerializable {
    control_id: string;
    _control: Control;
    panel_id: string;
    _panel: Panel;

    static tableStr = "panel_controls";
    table: string;

    constructor(_id: string, data?: PanelControlData) {
        super(_id);
        this.table = PanelControl.tableStr;

        this.foreignKeys = [
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

        this.requiredProperties = this.requiredProperties.concat([
            'control_id',
            'panel_id'
        ]);

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

    get endpoint() : Endpoint {
        return this._control.endpoint;
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