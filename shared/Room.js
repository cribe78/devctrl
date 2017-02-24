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
        var _this = _super.call(this, _id) || this;
        _this.table = Room.tableStr;
        _this.referenced = {
            'panels': {}
        };
        if (data) {
            _this.loadData(data);
        }
        return _this;
    }
    Room.prototype.getDataObject = function () {
        return {
            _id: this._id,
            name: this.name
        };
    };
    return Room;
}(DCSerializable_1.DCSerializable));
Room.tableStr = "rooms";
exports.Room = Room;
//# sourceMappingURL=Room.js.map