/**
 *
 * The Control is the basic unit of the DevCtrl application.  A Control represents and individual setting or value
 * on a device (Endpoint).  The frontend provides an interface for users to view and change the values of controls.
 */

import {DCSerializableData, DCSerializable} from "./DCSerializable";
import {Endpoint} from "./Endpoint";
import {OptionSet} from "./OptionSet";

export interface ControlData extends DCSerializableData{
    endpoint_id: string;
    ctid: string;
    usertype: string;
    control_type: string;
    poll: number;
    config: any;
    value: any;
    option_set_id?: string;
    ephemeral?: boolean;
}


export class Control extends DCSerializable {
    endpoint_id: string;
    private _endpoint: Endpoint;
    ctid: string;
    usertype: string;
    control_type: string;
    poll: number;
    config: any;
    value: any;
    ephemeral: boolean = false;
    option_set_id: string;
    private _option_set: OptionSet;

    foreignKeys = [
        {
            type: Endpoint,
            fkObjProp: "endpoint",
            fkIdProp: "endpoint_id",
            fkTable: Endpoint.tableStr
        },
        {
            type: OptionSet,
            fkObjProp: "option_set",
            fkIdProp: "option_set_id",
            fkTable: OptionSet.tableStr
        }
    ];

    static tableStr = "controls";

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
        this.referenced = {
            endpoints : {},
            panel_controls : {}
        };

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

    get endpoint() {
        return this._endpoint;
    }

    set endpoint(endpoint : Endpoint) {
        this._endpoint = endpoint;
        this.endpoint_id = endpoint._id;
    }

    get option_set() {
        return this._option_set;
    }

    set option_set(option_set : OptionSet) {
        this._option_set = option_set;
        this.option_set_id = option_set._id;
    }


    fkSelectName() {
        if (this._endpoint) {
            return this._endpoint.name + ": " + this.name;
        }
        return this.name;
    }

    getDataObject() : ControlData {
        return (<ControlData>DCSerializable.defaultDataObject(this));
    }
}


