import {DCSerializableData, DCSerializable, DCFieldType} from "./DCSerializable";
import {Control} from "./Control";
import {ControlUpdate, ControlUpdateData} from "./ControlUpdate";
/**
 * A ActionTrigger defines and action in response to a change in a control value
 */

export interface ActionTriggerData extends DCSerializableData {
    trigger_control_id: string,
    trigger_value: any,
    value_test: string,
    action_control_id: string,
    action_control_value: any,
    enabled: boolean
}

export interface WatcherActionValue {
    value?: string;
    map?: {
        [index: string] : any;
    }
}

export class ActionTrigger extends DCSerializable {
    trigger_control_id: string;
    _trigger_control: Control;
    trigger_value: any = 'any';
    value_test: string = ActionTrigger.VALUE_TEST_ANY;
    action_control_id: string;
    _action_control: Control;
    action_control_value: WatcherActionValue = {};
    enabled: boolean = false;

    static tableStr = "watcher_rules";
    tableLabel = "Action Triggers";
    static VALUE_TEST_EQUALS = "=";
    static VALUE_TEST_LESS_THAN = "<";
    static VALUE_TEST_GREATER_THAN = ">";
    static VALUE_TEST_ANY = "any";

    foreignKeys = [
        {
            type: Control,
            fkObjProp: "trigger_control",
            fkIdProp: "trigger_control_id",
            fkTable: Control.tableStr
        },
        {
            type: Control,
            fkObjProp: "action_control",
            fkIdProp: "action_control_id",
            fkTable: Control.tableStr
        }
    ];


    constructor(_id: string, data?: ActionTriggerData) {
        super(_id);
        this.table = ActionTrigger.tableStr;


        this.fieldDefinitions = this.fieldDefinitions.concat([
            {
                name: "trigger_control_id",
                type: DCFieldType.fk,
                label: "Trigger Control",
                tooltip: "The Control which will trigger an action"
            },
            {
                name: "action_control_id",
                type: DCFieldType.fk,
                label: "Action Control",
                tooltip: "The Control which will be acted upon"
            },
            {
                name: "action_control_value",
                type: DCFieldType.watcherActionValue,
                label: "Action Value",
                tooltip: "The value the Action Control will be set to"
            },
            {
                name: "enabled",
                type: DCFieldType.bool,
                label: "Enabled?",
                tooltip: "Disabling a rule prevents its execution"
            },
            {
                name: "value_test",
                type: DCFieldType.selectStatic,
                label: "Value Test",
                options: [
                    { name: "any", value: "any"},
                    { name: "=", value: "="},
                    { name: "<", value: "<"},
                    { name: ">", value: ">"}
                ],
                tooltip: "Test the trigger value against a criteria before triggering an action"
            },
            {
                name: "trigger_value",
                type: DCFieldType.string,
                label: "Trigger Value",
                tooltip: "A value of the Trigger Control used in the value test"
            }
        ]);

        if (data) {
            this.loadData(data);
        }
    }

    get action_control() {
        return this._action_control;
    }

    set action_control(val: Control) {
        this._action_control = val;
        this.action_control_id = val._id;
    }

    get trigger_control() {
        return this._trigger_control;
    }

    set trigger_control(val: Control) {
        this._trigger_control = val;
        this.trigger_control_id = val._id;
    }

    /**
     * Just assign a name based on controls
     */
    get name() : string {
        if (this.trigger_control && this.action_control) {
            return this.trigger_control.fkSelectName() + " - " + this.action_control.fkSelectName();
        }
        return 'ActionTrigger ' + this._id;
    }

    set name(value) {
        // Haha! you can't do that!
    }

    getDataObject() : ActionTriggerData {
        return (<ActionTriggerData>DCSerializable.defaultDataObject(this));
    }

    generateControlUpdate(update : ControlUpdate, guid : string, checkStatus : boolean = true)
        : string | ControlUpdateData {
        if (checkStatus && update.status != 'observed') {
            return `statusCheck failed, status: ${update.status}`;
        }

        if (update.control_id != this.trigger_control_id) {
            return `control_id check failed`;
        }

        // Perform value test
        if (this.value_test == ActionTrigger.VALUE_TEST_EQUALS) {
            if (update.value != this.trigger_value) {
                return `value test equals failed, ${update.value} != ${this.trigger_value}`;
            }
        }
        else if (this.value_test == ActionTrigger.VALUE_TEST_GREATER_THAN) {
            if (! (parseFloat(update.value) > parseFloat(this.trigger_value))) {
                return `value test gt failed, ${update.value} <= ${this.trigger_value}`;
            }
        }
        else if (this.value_test == ActionTrigger.VALUE_TEST_LESS_THAN) {
            if (! (parseFloat(update.value) < parseFloat(this.trigger_value))) {
                return `value test lt failed, ${update.value} >= ${this.trigger_value}`;
            }
        }
        else if (this.value_test == ActionTrigger.VALUE_TEST_ANY) {}
        else {
            return `unknown value test type ${this.value_test}`;
        }

        // Determine resultant update value
        let outputValue;
        if (typeof this.action_control_value.value !== 'undefined') {
            outputValue = this.action_control_value.value;
        }
        else if (this.action_control_value.map) {
            outputValue = this.action_control_value.map[update.value];
        }

        if (typeof outputValue === 'undefined') {
            return `failed to determine output value from update value ${update.value}`;
        }

        let outputUpdateData : ControlUpdateData = {
            _id: guid,
            name: `watcher ${this._id} update`,
            control_id: this.action_control_id,
            value: outputValue,
            type: "watcher",
            status: "requested",
            source: "watcher",
            ephemeral: false
        };
        
        return outputUpdateData;
    }

    get valueDescription() {
        if (typeof this.action_control_value.value !== 'undefined') {
            return this.action_control_value.value;
        }
        else if (this.action_control_value.map) {
            let map = this.action_control_value.map;
            let valStr = Object.keys(map)
                .map( key => {
                    return `${this.trigger_control.selectValueName(key)} => ${this.action_control.selectValueName(map[key])}`
                })
                .join(", ");

            return valStr;
        }
        return 'unknown value';
    }
}
