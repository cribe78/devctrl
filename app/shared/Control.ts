/**
 *
 * The Control is the basic unit of the DevCtrl application.  A Control represents and individual setting or value
 * on a device (Endpoint).  The frontend provides an interface for users to view and change the values of controls.
 */

import {DCSerializableData, DCSerializable, IDCFieldDefinition, DCFieldType} from "./DCSerializable";
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
    config: any = {};
    private _value: any;
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
    tableLabel = "Controls";

    // usertype and control_type values
    static CONTROL_TYPE_BOOLEAN = "boolean";
    static CONTROL_TYPE_ECHO = "echo"; // For echo controls, ncontrol just returns the value specified
    static CONTROL_TYPE_INT = "int";
    static CONTROL_TYPE_RANGE = "range";
    static CONTROL_TYPE_STRING = "string";
    static CONTROL_TYPE_XY = "xy";

    static USERTYPE_BUTTON = "button";
    static USERTYPE_BUTTON_SET = "button-set";
    static USERTYPE_CLQL_FADER = "clql-fader";
    static USERTYPE_HYPERLINK = "hyperlink";
    static USERTYPE_IMAGE = "image";
    static USERTYPE_F32_MULTIBUTTON = "f32-multibutton";
    static USERTYPE_SLIDER_2D = "slider2d";
    static USERTYPE_SWITCH = "switch";
    static USERTYPE_SWITCH_READONLY = "switch-readonly";
    static USERTYPE_SLIDER = "slider";
    static USERTYPE_READONLY = "readonly";
    static USERTYPE_LEVEL = "level";
    static USERTYPE_SELECT = "select";
    static USERTYPE_SELECT_READONLY = "select-readonly";

    ownFields : IDCFieldDefinition[] = [
        {
            name: "endpoint_id",
            type: DCFieldType.fk,
            label: "Endpoint",
            tooltip: "The Endpoint this control belongs to"
        },
        {
            name: "ctid",
            type: DCFieldType.string,
            label: "CTID",
            tooltip: "A unique identifier assigned by the NControl communicator"
        },
        {
            name: "usertype",
            type: DCFieldType.selectStatic,
            label: "UI Type",
            options: [
                { name: "button", value: Control.USERTYPE_BUTTON},
                { name: "button set", value: Control.USERTYPE_BUTTON_SET },
                { name: "Hyperlink", value: Control.USERTYPE_HYPERLINK },
                { name: "Image", value: Control.USERTYPE_IMAGE },
                { name: "F32 Multibutton", value: Control.USERTYPE_F32_MULTIBUTTON},
                { name: "Level Meter", value: Control.USERTYPE_LEVEL},
                { name: "Text (readonly)", value: Control.USERTYPE_READONLY },
                { name: "Select", value: Control.USERTYPE_SELECT},
                { name: "Select (readonly)", value: Control.USERTYPE_SELECT_READONLY},
                { name: "Slider", value: Control.USERTYPE_SLIDER},
                { name: "2D Slider", value: Control.USERTYPE_SLIDER_2D},
                { name: "Switch", value: Control.USERTYPE_SWITCH}
            ],
            tooltip: "Determines how this Control is displayed in the UI"
        },
        {
            name: "control_type",
            type: DCFieldType.selectStatic,
            label: "Control Type",
            options: [
                { name: "boolean", value: Control.CONTROL_TYPE_BOOLEAN},
                { name: "echo", value: Control.CONTROL_TYPE_ECHO},
                { name: "int", value: Control.CONTROL_TYPE_INT},
                { name: "range", value: Control.CONTROL_TYPE_RANGE},
                { name: "string", value: Control.CONTROL_TYPE_STRING},
                { name: "xy", value: Control.CONTROL_TYPE_XY}
            ],
            tooltip: "Defined and used by the NControl communicator",
            inputDisabled: true
        },
        {
            name: "poll",
            type: DCFieldType.bool,
            label: "Poll?",
            tooltip: "Should endpoint be periodically queried for value?"
        },
        {
            name: "config",
            type: DCFieldType.object,
            label: "Default Config",
            tooltip: "A collection of Control specific settings"
        },
        {
            name: "option_set_id",
            type: DCFieldType.fk,
            label: "Option Set",
            optional: true,
            tooltip: "The collection of options to use for a select Control"
        },
        {
            name: "value",
            type: DCFieldType.string,
            label: "Value",
            tooltip: "The current value of this Control"
        },
        {
            name: "ephemeral",
            type: DCFieldType.bool,
            label: "Ephemeral",
            optional: true,
            tooltip: "The Control value will not be stored in the database for ephemeral Controls"
        }
    ];


    constructor(_id: string, data?: ControlData) {
        super(_id);
        this.table = Control.tableStr;
        this.referenced = {
            endpoints : {},
            panel_controls : {}
        };

        this.fieldDefinitions = this.fieldDefinitions.concat(this.ownFields);

        if (data) {
            this.loadData(data);
            this.coerceValue();
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

    get value () {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this.coerceValue();
    }

    coerceValue() {
        if (this.control_type == Control.CONTROL_TYPE_STRING && typeof this._value == 'number') {
            this._value = "" + this._value;
        }
    }


    fkSelectName() {
        if (this._endpoint) {
            return this._endpoint.name + ": " + this.name;
        }
        return this.name;
    }


    selectOptions() {
        let options;
        if (this.option_set && this.option_set.options) {
            options = this.option_set.options;
        }
        else {
            options = !!this.config.options ? this.config.options : {};
        }

        return options;
    }

    selectOptionsArray() {
        let options = this.selectOptions();

        let optionsArray = Object.keys(options).map( value => {
            return { name: options[value], value: value };
        });

        return optionsArray;
    }

    selectValueName(val = null) {
        if (val == null) {
            val = this.value;
        }
        let opts = this.selectOptions();
        let value = '' + val;

        if (opts[value]) {
            return opts[value];
        }

        return value;
    }
}

export class ControlXYValue {

    constructor(public x : number = 0, public y : number = 0) {}

    toString() {
        return `(${this.x},${this.y})`;
    }
}
