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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var menu_service_1 = require("./menu.service");
var core_1 = require("@angular/core");
var MenuComponent = (function () {
    //static $inject = ['MenuService', '$state'];
    function MenuComponent(menuService, $state) {
        this.menuService = menuService;
        this.$state = $state;
        console.log("MenuComponent created");
    }
    MenuComponent.prototype.go = function (state) {
        if (angular.isString(state)) {
            this.$state.go(state);
        }
        else {
            this.$state.go(state.name, state.params);
        }
    };
    MenuComponent.prototype.trackByName = function (index, state) {
        return state.name;
    };
    return MenuComponent;
}());
MenuComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'devctrl-menu',
        template: "\n<md-nav-list>\n    <template ngFor let-item [ngForOf]=\"menuService.menuItems()\" [ngForTrackBy]=\"trackByName\">\n        <a md-list-item href=\"#\" (click)=\"go(item)\">\n            <a md-button>{{item.title}}</a>\n            <span class=\"toggle-icon\" [class.toggled]=\"item.isOpened\">\n                <md-icon md-font-set=\"material-icons\" >expand_more</md-icon>\n            </span>\n        </a>\n        <a md-list-item href=\"#\" \n                        [hidden]=\"! item.isOpened\"\n                        *ngFor=\"let subitem of item.substates\" \n                        (click)=\"go(subitem)\">\n            <span flex=\"5\"></span>\n            <p>{{subitem.title}}</p>\n        </a>\n        <md-divider></md-divider>\n    </template>\n</md-nav-list>\n"
    }),
    __param(1, core_1.Inject('$state')),
    __metadata("design:paramtypes", [menu_service_1.MenuService, Object])
], MenuComponent);
exports.MenuComponent = MenuComponent;
//# sourceMappingURL=menu.component.js.map