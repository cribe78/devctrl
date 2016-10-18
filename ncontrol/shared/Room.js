"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DCSerializable_1 = require("./DCSerializable");
var Room = (function (_super) {
    __extends(Room, _super);
    function Room(_id, data) {
        _super.call(this, _id);
        this.table = Room.tableStr;
        if (data) {
            this.loadData(data);
        }
    }
    Room.prototype.getDataObject = function () {
        return {
            _id: this._id,
            name: this.name
        };
    };
    Room.tableStr = "rooms";
    return Room;
}(DCSerializable_1.DCSerializable));
exports.Room = Room;
//# sourceMappingURL=Room.js.map