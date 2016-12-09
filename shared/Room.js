"use strict";
const DCSerializable_1 = require("./DCSerializable");
class Room extends DCSerializable_1.DCSerializable {
    constructor(_id, data) {
        super(_id);
        this.table = Room.tableStr;
        if (data) {
            this.loadData(data);
        }
    }
    getDataObject() {
        return {
            _id: this._id,
            name: this.name
        };
    }
}
Room.tableStr = "rooms";
exports.Room = Room;
//# sourceMappingURL=Room.js.map