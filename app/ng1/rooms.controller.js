"use strict";
const Room_1 = require("../../shared/Room");
class RoomsController {
    constructor(dataService) {
        this.dataService = dataService;
    }
    $onInit() {
        this.list = this.dataService.getTable(Room_1.Room.tableStr);
    }
    hideToast() {
        this.dataService.hideToast();
    }
    imageUrl(room) {
        return `/images/${room.name}.png`;
    }
}
RoomsController.$inject = ['DataService'];
exports.RoomsController = RoomsController;
//# sourceMappingURL=rooms.controller.js.map