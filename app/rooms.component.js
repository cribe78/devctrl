"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Room_1 = require("../shared/Room");
var data_service_1 = require("./data.service");
var core_1 = require("@angular/core");
var menu_service_1 = require("./menu.service");
var router_1 = require("@angular/router");
var RoomsComponent = (function () {
    function RoomsComponent(dataService, route, menu) {
        this.dataService = dataService;
        this.route = route;
        this.menu = menu;
        console.log("rooms component created");
        this.list = this.dataService.sortedArray(Room_1.Room.tableStr, "name");
    }
    RoomsComponent.prototype.ngOnInit = function () {
        console.log("rooms component initialized");
    };
    RoomsComponent.prototype.imageUrl = function (room) {
        return "/images/" + room.name + ".png";
    };
    return RoomsComponent;
}());
RoomsComponent.$inject = ['DataService'];
RoomsComponent = __decorate([
    core_1.Component({
        selector: 'devctrl-rooms',
        template: "\n<md-grid-list [hidden]=\"menu.routeUrl[0] == 'reoms'\"\n              cols=\"1\"\n              md-cols-gt-lg=\"3\"\n              rowHeight=\"1:1\"\n              md-gutter=\"8px\">\n    <md-grid-tile *ngFor=\"let room of list\" \n                class=\"lightPurple\" \n                (click)=\"menu.go(['rooms', room.name])\">\n        <img height=280 width=280 [src]=\"imageUrl(room)\" />\n    </md-grid-tile>\n</md-grid-list>\n"
    }),
    __metadata("design:paramtypes", [data_service_1.DataService,
        router_1.ActivatedRoute,
        menu_service_1.MenuService])
], RoomsComponent);
exports.RoomsComponent = RoomsComponent;
//# sourceMappingURL=rooms.component.js.map