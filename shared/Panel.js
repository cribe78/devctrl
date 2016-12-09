"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DCSerializable_1 = require("./DCSerializable");
var Room_1 = require("./Room");
var Panel = (function (_super) {
    __extends(Panel, _super);
    function Panel(_id, data) {
        var _this = _super.call(this, _id) || this;
        _this.table = Panel.tableStr;
        _this.foreignKeys = [
            {
                type: Room_1.Room,
                fkObjProp: "room",
                fkIdProp: "room_id",
                fkTable: Room_1.Room.tableStr
            }
        ];
        _this.requiredProperties = _this.requiredProperties.concat([
            'room_id',
            'grouping',
            'type',
            'panel_index'
        ]);
        _this.defaultProperties = {
            panel_index: "1"
        };
        if (data) {
            _this.loadData(data);
        }
        return _this;
    }
    Object.defineProperty(Panel.prototype, "room", {
        get: function () {
            return this._room;
        },
        set: function (room) {
            this._room = room;
            this.room_id = room._id;
        },
        enumerable: true,
        configurable: true
    });
    Panel.prototype.getDataObject = function () {
        return DCSerializable_1.DCSerializable.defaultDataObject(this);
    };
    return Panel;
}(DCSerializable_1.DCSerializable));
Panel.tableStr = "panels";
exports.Panel = Panel;
//# sourceMappingURL=Panel.js.map