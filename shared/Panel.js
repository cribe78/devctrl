"use strict";
const DCSerializable_1 = require("./DCSerializable");
const Room_1 = require("./Room");
class Panel extends DCSerializable_1.DCSerializable {
    constructor(_id, data) {
        super(_id);
        this.table = Panel.tableStr;
        this.foreignKeys = [
            {
                type: Room_1.Room,
                fkObjProp: "room",
                fkIdProp: "room_id",
                fkTable: Room_1.Room.tableStr
            }
        ];
        this.requiredProperties = this.requiredProperties.concat([
            'room_id',
            'grouping',
            'type',
            'panel_index'
        ]);
        this.defaultProperties = {
            panel_index: "1"
        };
        if (data) {
            this.loadData(data);
        }
    }
    get room() {
        return this._room;
    }
    set room(room) {
        this._room = room;
        this.room_id = room._id;
    }
    getDataObject() {
        return DCSerializable_1.DCSerializable.defaultDataObject(this);
    }
}
Panel.tableStr = "panels";
exports.Panel = Panel;
//# sourceMappingURL=Panel.js.map