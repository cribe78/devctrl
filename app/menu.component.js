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
const menu_service_1 = require("./menu.service");
const core_1 = require("@angular/core");
let MenuComponent = class MenuComponent {
    //static $inject = ['MenuService', '$state'];
    constructor(menuService, $state) {
        this.menuService = menuService;
        this.$state = $state;
        console.log("MenuComponent created");
    }
    go(state) {
        if (angular.isString(state)) {
            this.$state.go(state);
        }
        else {
            this.$state.go(state.name, state.params);
        }
    }
    trackByName(index, state) {
        return state.name;
    }
};
MenuComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'devctrl-menu',
        template: `
<md-nav-list>
    <template ngFor let-item [ngForOf]="menuService.menuItems()" [ngForTrackBy]="trackByName">
        <a md-list-item (click)="go(item)">
            <a md-button>{{item.title}}</a>
            <span class="toggle-icon" [class.toggled]="item.isOpened">
                <md-icon md-font-set="material-icons" >expand_more</md-icon>
            </span>
        </a>
        <a md-list-item [hidden]="! item.isOpened"
                        *ngFor="let subitem of item.substates" 
                        (click)="go(subitem)">
            <span flex="5"></span>
            <p>{{subitem.title}}</p>
        </a>
        <md-divider></md-divider>
    </template>
</md-nav-list>
`
    }),
    __param(1, core_1.Inject('$state')),
    __metadata("design:paramtypes", [menu_service_1.MenuService, Object])
], MenuComponent);
exports.MenuComponent = MenuComponent;
//# sourceMappingURL=menu.component.js.map