"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DCSerializable_1 = require("./DCSerializable");
var Control_1 = require("./Control");
var WatcherRule = (function (_super) {
    __extends(WatcherRule, _super);
    function WatcherRule(_id, data) {
        var _this = _super.call(this, _id) || this;
        _this.watch_value = '';
        _this.enabled = false;
        _this.table = WatcherRule.tableStr;
        _this.requiredProperties = [
            'watched_control_id',
            'watch_value',
            'value_test',
            'action_control_id',
            'action_control_value',
            'enabled'
        ];
        _this.foreignKeys = [
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
            _this.loadData(data);
        }
        return _this;
    }
    Object.defineProperty(WatcherRule.prototype, "action_control", {
        get: function () {
            return this._action_control;
        },
        set: function (val) {
            this._action_control = val;
            this.action_control_id = val._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WatcherRule.prototype, "watched_control", {
        get: function () {
            return this._watched_control;
        },
        set: function (val) {
            this._watched_control = val;
            this.watched_control_id = val._id;
        },
        enumerable: true,
        configurable: true
    });
    WatcherRule.prototype.getDataObject = function () {
        return DCSerializable_1.DCSerializable.defaultDataObject(this);
    };
    WatcherRule.prototype.generateControlUpdate = function (update, guid, checkStatus) {
        if (checkStatus === void 0) { checkStatus = true; }
        if (checkStatus && update.status != 'observed') {
            return "statusCheck failed, status: " + update.status;
        }
        if (update.control_id != this.watched_control_id) {
            return "control_id check failed";
        }
        // Perform value test
        if (this.value_test == WatcherRule.VALUE_TEST_EQUALS) {
            if (update.value != this.watch_value) {
                return "value test equals failed, " + update.value + " != " + this.watch_value;
            }
        }
        else if (this.value_test == WatcherRule.VALUE_TEST_GREATER_THAN) {
            if (!(parseFloat(update.value) > parseFloat(this.watch_value))) {
                return "value test gt failed, " + update.value + " <= " + this.watch_value;
            }
        }
        else if (this.value_test == WatcherRule.VALUE_TEST_LESS_THAN) {
            if (!(parseFloat(update.value) < parseFloat(this.watch_value))) {
                return "value test lt failed, " + update.value + " >= " + this.watch_value;
            }
        }
        else if (this.value_test == WatcherRule.VALUE_TEST_ANY) { }
        else {
            return "unknown value test type " + this.value_test;
        }
        // Determine resultant update value
        var outputValue;
        if (this.action_control_value.value) {
            outputValue = this.action_control_value.value;
        }
        else if (this.action_control_value.map) {
            outputValue = this.action_control_value.map[update.value];
        }
        if (typeof outputValue === 'undefined') {
            return "failed to determine output value from update value " + update.value;
        }
        var outputUpdateData = {
            _id: guid,
            name: "watcher " + this._id + " update",
            control_id: this.action_control_id,
            value: outputValue,
            type: "watcher",
            status: "requested",
            source: "watcher",
            ephemeral: false
        };
        return outputUpdateData;
    };
    return WatcherRule;
}(DCSerializable_1.DCSerializable));
WatcherRule.tableStr = "watcher_rules";
WatcherRule.VALUE_TEST_EQUALS = "=";
WatcherRule.VALUE_TEST_LESS_THAN = "<";
WatcherRule.VALUE_TEST_GREATER_THAN = ">";
WatcherRule.VALUE_TEST_ANY = "any";
exports.WatcherRule = WatcherRule;
//# sourceMappingURL=WatcherRule.js.map