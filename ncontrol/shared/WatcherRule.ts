import {DCSerializableData, DCSerializable} from "./DCSerializable";
import {Control} from "./Control";
/**
 * A WatcherRule defines and action in response to a change in a control value
 */

export interface WatcherRuleData extends DCSerializableData {
    watched_control_id: string,
    value_test: string,
    action_control_id: string,
    action_control_value: any,
    enabled: boolean
}

export class WatcherRule extends DCSerializable {
    watched_control_id: string;
    _watched_control: Control;
    value_test: string;
    action_control_id: string;
    _action_control: Control;
    action_control_value: any;
    enabled: boolean;

    static tableStr = "watcher_rules";


    constructor(_id: string, data?: WatcherRuleData) {
        super(_id);
        this.table = WatcherRule.tableStr;
        this.requiredProperties = [
            'watched_control_id',
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
}
