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
const data_service_1 = require("./data.service");
const menu_service_1 = require("./menu.service");
const core_1 = require("@angular/core");
// This component depends on a working md-select, which has not been released yet
let ToolbarComponent = class ToolbarComponent {
    //static $inject = [ '$state', 'MenuService', 'DataService'];
    constructor($state, menuService, dataService) {
        this.dataService = dataService;
        this.menu = menuService;
        this.menuService = menuService;
        this.$state = $state;
        this.session = this.dataService['userSession'];
        console.log("Toolbar Component created");
    }
    showAdminLogin() {
        // Show Admin login option if not currently admin authorized
        return !this.dataService.isAdminAuthorized();
    }
    ;
    adminLogin() {
        this.dataService.doAdminLogon();
    }
    ;
    pageTitle() {
        return this.$state.current.title || this.$state.params.name;
    }
    ;
    editClient($event) {
        //this.dataService.editRecord($event, self.user.client_id, "clients");
        //TODO implement editting of session name
    }
    ;
    revokeAdmin() {
        this.dataService.revokeAdminAuth();
    }
    ;
    updateConfig() {
        this.dataService.updateConfig();
    }
    ;
};
ToolbarComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'devctrl-toolbar',
        template: `
<md-toolbar layout="row" layout-align="start center">
    <div flex layout="row"
         layout-align="center center"
         class="devctrl-main-toolbar devctrl-ctrl-select">
        <button md-button (click)="toggleSidenav('left')"
                   ng-hide="menu.hideSidenavButton()"
                   class="dc-toolbar-sidenav-button md-icon-button">
            <md-icon aria-label="Menu"  md-font-set="material-icons" >menu</md-icon>
        </button>
        <select *ngIf="menu.toolbarSelect.enabled"
                    aria-label="Select Page"
                   placeholder="{{$ctrl.pageTitle()}}"
                   ng-model="$ctrl.menu.toolbarSelect.selected"
                   ng-change="$ctrl.menu.toolbarSelectUpdate()">
            <md-option class="text-headline"s
                        ng-value="option.value"
                       ng-repeat="option in $ctrl.menu.toolbarSelect.options">
                {{option.name}}
            </md-option>
        </select> -->
        <span flex class="title text-headline">{{pageTitle()}}</span>
        <div layout="column">
            <div>{{session.client_name}}</div>
            <span *devctrlAdminOnly>{{session.username}}</span>
        </div>

        <button md-icon-button [md-menu-trigger-for]="adminmenu">
            <md-icon  md-font-set="material-icons">more_vert</md-icon>
        </button>
        <md-menu #adminmenu="mdMenu">
            <button md-menu-item (click)="adminLogin()">
                    Admin Login
            </button>
            <button md-menu-item *devctrlAdminOnly (click)="revokeAdmin()">
                    Admin Logout
            </button>
            <button md-menu-item *devCtrlAdminOnly (click)="editClient($event)">
                    Edit Client
            </button>
        </md-menu>
    </div>
</md-toolbar>
`
    }),
    __param(0, core_1.Inject('$state')),
    __param(2, core_1.Inject('DataService')),
    __metadata("design:paramtypes", [Object, menu_service_1.MenuService,
        data_service_1.DataService])
], ToolbarComponent);
exports.ToolbarComponent = ToolbarComponent;
let templateOoriginal = `
<md-toolbar layout="row" layout-align="start center">
    <div flex layout="row"
         layout-align="center center"
         class="devctrl-main-toolbar devctrl-ctrl-select">
        <md-button ng-click="$ctrl.menu.toggleSidenav('left')"
                   ng-hide="$ctrl.menu.hideSidenavButton()"
                   class="dc-toolbar-sidenav-button md-icon-button">
            <md-icon aria-label="Menu"  md-font-set="material-icons" >menu</md-icon>
        </md-button>
        <md-select ng-if="$ctrl.menu.toolbarSelect.enabled"
                    aria-label="Select Page"
                   placeholder="{{$ctrl.pageTitle()}}"
                   ng-model="$ctrl.menu.toolbarSelect.selected"
                   ng-change="$ctrl.menu.toolbarSelectUpdate()">
            <md-option class="text-headline"
                        ng-value="option.value"
                       ng-repeat="option in $ctrl.menu.toolbarSelect.options">
                {{option.name}}
            </md-option>
        </md-select>
        <span flex class="title text-headline">{{$ctrl.pageTitle()}}</span>
        <div layout="column">
            <div>{{$ctrl.session.client_name}}</div>
            <span ng-if="$ctrl.adminLoggedIn()">{{$ctrl.session.username}}</span>
        </div>


        <md-menu>
            <md-button  class="md-icon-button" ng-click="$mdOpenMenu($event)">
                <md-icon  md-font-set="material-icons">more_vert</md-icon>
            </md-button>
            <md-menu-content>
                <md-menu-item ng-if="$ctrl.showAdminLogin()">
                    <md-button ng-click="$ctrl.adminLogin()">
                        Admin Login
                    </md-button>
                </md-menu-item>
                <md-menu-item ng-if="$ctrl.adminLoggedIn()">
                    <md-switch ng-model="$ctrl.config.editEnabled"
                               ng-change="$ctrl.updateConfig()">
                        Edit
                    </md-switch>
                </md-menu-item>
                <md-menu-item ng-if="$ctrl.adminLoggedIn()">
                    <md-button ng-click="$ctrl.revokeAdmin()">
                        Admin Logout
                    </md-button>
                </md-menu-item>
                <md-menu-item ng-if="$ctrl.adminLoggedIn()">
                    <md-button ng-click="$ctrl.editClient($event)">
                        Edit Client
                    </md-button>
                </md-menu-item>
            </md-menu-content>
        </md-menu>
    </div>
</md-toolbar>
`;
//# sourceMappingURL=toolbar.component.js.map