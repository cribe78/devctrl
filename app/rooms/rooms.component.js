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
var Room_1 = require("../../shared/Room");
var data_service_1 = require("../data.service");
var core_1 = require("@angular/core");
var menu_service_1 = require("../layout/menu.service");
var router_1 = require("@angular/router");
var layout_service_1 = require("../layout/layout.service");
var RoomsComponent = RoomsComponent_1 = (function () {
    function RoomsComponent(dataService, ls, route, menu) {
        this.dataService = dataService;
        this.ls = ls;
        this.route = route;
        this.menu = menu;
        console.log("rooms component created");
        this.list = this.dataService.sortedArray(Room_1.Room.tableStr, "name");
    }
    RoomsComponent.prototype.ngOnInit = function () {
        console.log("rooms component initialized");
        this.menu.currentTopLevel = menu_service_1.MenuService.TOPLEVEL_ROOMS;
        this.menu.pageTitle = "Locations";
        this.menu.toolbarSelectDisable();
    };
    RoomsComponent.prototype.cols = function () {
        if (this.ls.desktopWide) {
            return 4;
        }
        return 2;
    };
    RoomsComponent.prototype.imageUrl = function (room) {
        return "/images/" + room.name + ".png";
    };
    RoomsComponent.prototype.tileClass = function (i) {
        if (RoomsComponent_1.colorClasses[i]) {
            return RoomsComponent_1.colorClasses[i];
        }
        return 'gray';
    };
    return RoomsComponent;
}());
RoomsComponent.colorClasses = [
    'yellow', 'red', 'purple', 'green', 'pink', 'darkBlue'
];
RoomsComponent = RoomsComponent_1 = __decorate([
    core_1.Component({
        selector: 'devctrl-rooms',
        template: "\n<div  id=\"devctrl-content-canvas\">\n    <div class=\"devctrl-card\">\n        <md-grid-list [cols]=\"cols()\"\n                      rowHeight=\"1:1\"\n                      gutterSize=\"8px\">\n            <md-grid-tile *ngFor=\"let room of list; let i = index;\" \n                        [class]=\"tileClass(i)\" \n                        (click)=\"menu.go(['rooms', room.name])\">\n                <div class=\"devctrl-img\">\n                    <img [src]=\"imageUrl(room)\" />\n                </div>\n            </md-grid-tile>\n        </md-grid-list>\n    </div>\n</div>\n",
        //language=CSS
        styles: ["   \n        .devctrl-card {\n            flex: 1 1;\n        }\n        .devctrl-img {\n            flex: 1 1;\n        }\n        .devctrl-img img {\n            width: 100%;\n            min-width: 200px;\n        }\n        md-grid-tile.gray {\n            background: #f5f5f5; }\n        md-grid-tile.green {\n            background: #b9f6ca; }\n        md-grid-tile.yellow {\n            background: #ffff8d; }\n        md-grid-tile.blue {\n            background: #84ffff; }\n        md-grid-tile.darkBlue {\n            background: #80d8ff; }\n        md-grid-tile.deepBlue {\n            background: #448aff; }\n        md-grid-tile.purple {\n            background: #b388ff; }\n        md-grid-tile.lightPurple {\n            background: #8c9eff; }\n        md-grid-tile.red {\n            background: #ff8a80; }\n        md-grid-tile.pink {\n            background: #ff80ab; }\n"]
    }),
    __metadata("design:paramtypes", [data_service_1.DataService,
        layout_service_1.LayoutService,
        router_1.ActivatedRoute,
        menu_service_1.MenuService])
], RoomsComponent);
exports.RoomsComponent = RoomsComponent;
var RoomsComponent_1;
//# sourceMappingURL=rooms.component.js.map