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
Object.defineProperty(exports, "__esModule", { value: true });
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
        template: "\n<md-nav-list>\n    <ng-template ngFor let-item [ngForOf]=\"menu.menuItems()\" [ngForTrackBy]=\"trackByName\">\n        <md-list-item (click)=\"menu.go(item.route)\">\n            <a md-line >{{item.name}}</a>\n            <button md-icon-button class=\"toggle-icon\" \n                    [class.toggled]=\"item.isOpened\" \n                    (click)=\"menu.toggleTopLevel($event, item)\">\n                <md-icon md-font-set=\"material-icons\" >expand_more</md-icon>\n            </button>\n        </md-list-item>\n        <a md-list-item [hidden]=\"! item.isOpened\"\n                        *ngFor=\"let subitem of item.children\" \n                        (click)=\"menu.go(subitem.route)\">\n            <span flex=\"5\"></span>\n            <p>{{subitem.name}}</p>\n        </a>\n        <md-divider></md-divider>\n    </ng-template>\n</md-nav-list>\n",
        styles: ["\nbutton.toggle-icon {\n    display: block;\n    margin-left: auto;\n    vertical-align: middle;\n    transform: rotate(180deg);\n    transition: transform 0.3s ease-in-out;\n}\n\nbutton.toggle-icon.toggled {\n    transform: rotate(0deg);\n}\n"]
    }),
    __metadata("design:paramtypes", [menu_service_1.MenuService, router_1.ActivatedRoute])
], MenuComponent);
exports.MenuComponent = MenuComponent;
//# sourceMappingURL=menu.component.js.map