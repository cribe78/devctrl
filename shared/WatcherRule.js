"use strict";
const DCSerializable_1 = require("./DCSerializable");
const Control_1 = require("./Control");
class WatcherRule extends DCSerializable_1.DCSerializable {
    constructor(_id, data) {
        super(_id);
        this.watch_value = '';
        this.enabled = false;
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
                type: Control_1.Control,
                fkObjProp: "watched_control",
                fkIdProp: "watched_control_id",
                fkTable: Control_1.Control.tableStr
            },
            {
                type: Control_1.Control,
                fkObjProp: "action_control",
                fkIdProp: "action_control_id",
                fkTable: Control_1.Control.tableStr
            }
        ];
        if (data) {
            this.loadData(data);
        }
    }
    get action_control() {
        return this._action_control;
    }
    set action_control(val) {
        this._action_control = val;
        this.action_control_id = val._id;
    }
    get watched_control() {
        return this._watched_control;
    }
    set watched_control(val) {
        this._watched_control = val;
        this.watched_control_id = val._id;
    }
    getDataObject() {
        return DCSerializable_1.DCSerializable.defaultDataObject(this);
    }
    generateControlUpdate(update, guid, checkStatus = true) {
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
            if (!(parseFloat(update.value) > parseFloat(this.watch_value))) {
                return `value test gt failed, ${update.value} <= ${this.watch_value}`;
            }
        }
        else if (this.value_test == WatcherRule.VALUE_TEST_LESS_THAN) {
            if (!(parseFloat(update.value) < parseFloat(this.watch_value))) {
                return `value test lt failed, ${update.value} >= ${this.watch_value}`;
            }
        }
        else if (this.value_test == WatcherRule.VALUE_TEST_ANY) { }
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
        let outputUpdateData = {
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
WatcherRule.tableStr = "watcher_rules";
WatcherRule.VALUE_TEST_EQUALS = "=";
WatcherRule.VALUE_TEST_LESS_THAN = "<";
WatcherRule.VALUE_TEST_GREATER_THAN = ">";
WatcherRule.VALUE_TEST_ANY = "any";
exports.WatcherRule = WatcherRule;
//# sourceMappingURL=WatcherRule.js.map