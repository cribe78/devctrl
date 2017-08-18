import {DCSerializableData, DCSerializable, IDCFieldDefinition, DCFieldType} from "./DCSerializable";
import {Control} from "./Control";
import {Panel} from "./Panel";
import {Endpoint} from "./Endpoint";

export interface PanelControlData extends DCSerializableData {
    control_id: string;
    panel_id: string;
    idx: number;
}

export class PanelControl extends DCSerializable {
    control_id: string;
    _control: Control;
    panel_id: string;
    _panel: Panel;
    idx: number;

    static tableStr = "panel_controls";
    tableLabel = "Panel Controls";
    table: string;

    foreignKeys = [
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

    ownFields : IDCFieldDefinition[] = [
        {
            name: "control_id",
            type: DCFieldType.fk,
            label: "Control",
            tooltip: "The Control to be included"
        },
        {
            name: "panel_id",
            type: DCFieldType.fk,
            label: "Panel",
            tooltip: "The Panel which will include the Control"
        },
        {
            name: "idx",
            type: DCFieldType.int,
            label: "Order",
            optional: true,
            tooltip: "The position of the Control within this Panel"
        }
    ];

    constructor(_id: string, data?: PanelControlData) {
        super(_id);
        this.table = PanelControl.tableStr;

        this.fieldDefinitions = this.fieldDefinitions.concat(this.ownFields);

        // Set a custom value for the name tooltip
        if (this.fieldDefinitions[0].name == "name") {
            this.fieldDefinitions[0].tooltip = "Name of the Control in this context";
        }


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
}