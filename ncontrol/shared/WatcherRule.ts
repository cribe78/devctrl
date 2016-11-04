import {DCSerializableData, DCSerializable} from "./DCSerializable";
import {Control} from "./Control";
import {ControlUpdate, ControlUpdateData} from "./ControlUpdate";
/**
 * A WatcherRule defines and action in response to a change in a control value
 */

export interface WatcherRuleData extends DCSerializableData {
    watched_control_id: string,
    watch_value: any,
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

export class WatcherRule extends DCSerializable {
    watched_control_id: string;
    _watched_control: Control;
    watch_value: any;
    value_test: string;
    action_control_id: string;
    _action_control: Control;
    action_control_value: WatcherActionValue;
    enabled: boolean;

    static tableStr = "watcher_rules";
    static VALUE_TEST_EQUALS = "=";
    static VALUE_TEST_LESS_THAN = "<";
    static VALUE_TEST_GREATER_THAN = ">";
    static VALUE_TEST_ANY = "any";


    constructor(_id: string, data?: WatcherRuleData) {
        super(_id);
        this.table = WatcherRule.tableStr;
        this.requiredProperties = [
            'watched_control_id',
            'watch_value',
            'value_test',
            'action_control_id',
            'action_control_value',
            'enabled'
        ];

        this.foreignKeys = [
            {
                type: Control,
                fkObjProp: "watched_control",
                fkIdProp: "watched_control_id",
                fkTable: Control.tableStr
            },
            {
                type: Control,
                fkObjProp: "action_control",
                fkIdProp: "action_control_id",
                fkTable: Control.tableStr
            }
        ];

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

    get watched_control() {
        return this._watched_control;
    }

    set watched_control(val: Control) {
        this._watched_control = val;
        this.watched_control_id = val._id;
    }


    getDataObject() : WatcherRuleData {
        return (<WatcherRuleData>DCSerializable.defaultDataObject(this));
    }

    generateControlUpdate(update : ControlUpdate, guid : string, checkStatus : boolean = true)
        : string | ControlUpdateData {
        if (checkStatus && update.status != 'observed') {
            return `statusCheck failed, status: ${update.status}`;
        }

        if (update.control_id != this.watched_control_id) {
            return `control_id check failed`;
        }

        // Perform value test
        if (this.value_test == WatcherRule.VALUE_TEST_EQUALS) {
            if (update.value != this.watch_value) {
                return `value test equals failed, ${update.value} != ${this.watch_value}`;
            }
        }
        else if (this.value_test == WatcherRule.VALUE_TEST_GREATER_THAN) {
            if (! (parseFloat(update.value) > parseFloat(this.watch_value))) {
                return `value test gt failed, ${update.value} <= ${this.watch_value}`;
            }
        }
        else if (this.value_test == WatcherRule.VALUE_TEST_LESS_THAN) {
            if (! (parseFloat(update.value) < parseFloat(this.watch_value))) {
                return `value test lt failed, ${update.value} >= ${this.watch_value}`;
            }
        }
        else if (this.value_test == WatcherRule.VALUE_TEST_ANY) {}
        else {
            return `unknown value test type ${this.value_test}`;
        }

        // Determine resultant update value
        let outputValue;
        if (this.action_control_value.value) {
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
}
