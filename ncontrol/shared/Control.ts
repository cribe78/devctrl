/**
 *
 * The Control is the basic unit of the DevCtrl application.  A Control represents and individual setting or value
 * on a device (Endpoint).  The frontend provides an interface for users to view and change the values of controls.
 */

import {DCSerializableData, DCSerializable} from "./DCSerializable";
import {Endpoint} from "./Endpoint";

export interface ControlData extends DCSerializableData{
    endpoint_id: string;
    ctid: string;
    usertype: string;
    control_type: string;
    poll: number;
    config: any;
    value: any;
    ephemeral?: boolean;
}


export class Control extends DCSerializable {
    endpoint_id: string;
    endpoint: Endpoint;
    ctid: string;
    usertype: string;
    control_type: string;
    poll: number;
    config: any;
    value: any;
    ephemeral: boolean = false;

    static tableStr = "controls";
    table: string;

    // usertype and control_type values
    static CONTROL_TYPE_BOOLEAN = "boolean";
    static CONTROL_TYPE_STRING = "string";
    static CONTROL_TYPE_RANGE = "range";
    static CONTROL_TYPE_INT = "int";

    static USERTYPE_BUTTON = "button";
    static USERTYPE_BUTTON_SET = "button-set";
    static USERTYPE_F32_MULTIBUTTON = "f32-multibutton";
    static USERTYPE_SLIDER_2D = "slider2d";
    static USERTYPE_SWITCH = "switch";
    static USERTYPE_SLIDER = "slider";
    static USERTYPE_READONLY = "readonly";
    static USERTYPE_LEVEL = "level";
    static USERTYPE_SELECT = "select";
    static USERTYPE_SELECT_READONLY = "select-readonly";

    constructor(_id: string, data?: ControlData) {
        super(_id);
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

        this.foreignKeys = [
            {
                type: Endpoint,
                fkObjProp: "endpoint",
                fkIdProp: "endpoint_id",
                fkTable: Endpoint.tableStr
            }
        ];

        this.optionalProperties = ['ephemeral'];

        if (data) {
            this.loadData(data);
        }
    }

    fkSelectName() {
        return this.endpoint.name + ": " + this.name;
    }

    getDataObject() : ControlData {
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
        }
    }
}


