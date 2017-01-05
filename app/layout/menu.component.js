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
var menu_service_1 = require("./menu.service");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var MenuComponent = (function () {
    function MenuComponent(menu, route) {
        this.menu = menu;
        this.route = route;
        console.log("MenuComponent created");
    }
    MenuComponent.prototype.trackByName = function (index, state) {
        return state.name;
    };
    return MenuComponent;
}());
MenuComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'devctrl-menu',
        template: "\n<md-nav-list>\n    <template ngFor let-item [ngForOf]=\"menu.menuItems()\" [ngForTrackBy]=\"trackByName\">\n        <a md-list-item (click)=\"menu.go(item.route)\">\n            <p>{{item.name}}</p>\n            <span class=\"toggle-icon\" [class.toggled]=\"item.isOpened\">\n                <md-icon md-font-set=\"material-icons\" >expand_more</md-icon>\n            </span>\n        </a>\n        <a md-list-item [hidden]=\"! item.isOpened\"\n                        *ngFor=\"let subitem of item.children\" \n                        (click)=\"menu.go(subitem.route)\">\n            <span flex=\"5\"></span>\n            <p>{{subitem.name}}</p>\n        </a>\n        <md-divider></md-divider>\n    </template>\n</md-nav-list>\n"
    }),
    __metadata("design:paramtypes", [menu_service_1.MenuService, router_1.ActivatedRoute])
], MenuComponent);
exports.MenuComponent = MenuComponent;
//# sourceMappingURL=menu.component.js.map