"use strict";
var Room_1 = require("../../shared/Room");
var RoomsController = (function () {
    function RoomsController(dataService) {
        this.dataService = dataService;
    }
    RoomsController.prototype.$onInit = function () {
        this.list = this.dataService.getTable(Room_1.Room.tableStr);
    };
    RoomsController.prototype.imageUrl = function (room) {
        return "/images/" + room.name + ".png";
    };
    RoomsController.$inject = ['DataService'];
    return RoomsController;
}());
exports.RoomsController = RoomsController;
//# sourceMappingURL=rooms.controller.js.map