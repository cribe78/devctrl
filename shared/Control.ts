/**
 *
 * The Control is the basic unit of the DevCtrl application.  A Control represents and individual setting or value
 * on a device (Endpoint).  The frontend provides an interface for users to view and change the values of controls.
 */

import {DCSerializableData, DCSerializable} from "./DCSerializable";
import {ControlTemplate} from "./ControlTemplate";

export interface ControlData extends DCSerializableData{
    control_template_id: string;
    name: string;
    usertype: string;
    value: any;
    config: any;
}


export class Control extends DCSerializable {
    control_template_id: string;
    private _control_template: ControlTemplate;
    private _usertype: string;
    value: any;
    name: string;
    config: any;

    static tableStr = "controls";
    table: string;

    static foreignKeys = [
        {
            type: ControlTemplate,
            fkObjProp: "control_template",
            fkIdProp: "control_template_id",
            fkTable: ControlTemplate.tableStr
        }
    ];

    constructor(_id: string, data?: ControlData) {
        super(_id);

        this.table = Control.tableStr;
        this.requiredProperties = ['control_template_id', 'name', 'usertype', 'value', 'config'];

        if (data) {
            this.loadData(data);
        }
    }

    get control_template() : ControlTemplate {
        return this._control_template;
    }

    set control_template(template: ControlTemplate) {
        this.control_template_id = template._id;
        this._control_template = template;
    }

    get usertype(): string {
        if (this._usertype) {
            return this._usertype;
        }

        return this.control_template.usertype;
    }

    set usertype(newType: string) {
        this._usertype = newType;
    }


    getDataObject() : ControlData {
        return {
            _id: this._id,
            control_template_id: this.control_template_id,
            name: this.name,
            usertype: this._usertype,
            value: this.value,
            config: this.config
        };
    }
}


