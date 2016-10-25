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
        _super.call(this, _id);
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
    WatcherRule.tableStr = "watcher_rules";
    return WatcherRule;
}(DCSerializable_1.DCSerializable));
exports.WatcherRule = WatcherRule;
//# sourceMappingURL=WatcherRule.js.map