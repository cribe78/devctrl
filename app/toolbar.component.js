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
var data_service_1 = require("./data.service");
var menu_service_1 = require("./menu.service");
var core_1 = require("@angular/core");
// This component depends on a working md-select, which has not been released yet
var ToolbarComponent = (function () {
    //static $inject = [ '$state', 'MenuService', 'DataService'];
    function ToolbarComponent($state, menuService, dataService) {
        this.dataService = dataService;
        this.menu = menuService;
        this.menuService = menuService;
        this.$state = $state;
        this.session = this.dataService['userSession'];
        console.log("Toolbar Component created");
    }
    ToolbarComponent.prototype.showAdminLogin = function () {
        // Show Admin login option if not currently admin authorized
        return !this.dataService.isAdminAuthorized();
    };
    ;
    ToolbarComponent.prototype.adminLogin = function () {
        this.dataService.doAdminLogon();
    };
    ;
    ToolbarComponent.prototype.pageTitle = function () {
        return this.$state.current.title || this.$state.params.name;
    };
    ;
    ToolbarComponent.prototype.editClient = function ($event) {
        //this.dataService.editRecord($event, self.user.client_id, "clients");
        //TODO implement editting of session name
    };
    ;
    ToolbarComponent.prototype.revokeAdmin = function () {
        this.dataService.revokeAdminAuth();
    };
    ;
    ToolbarComponent.prototype.updateConfig = function () {
        this.dataService.updateConfig();
    };
    ;
    return ToolbarComponent;
}());
ToolbarComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'devctrl-toolbar',
        template: "\n<md-toolbar layout=\"row\" layout-align=\"start center\">\n    <div flex layout=\"row\"\n         layout-align=\"center center\"\n         class=\"devctrl-main-toolbar devctrl-ctrl-select\">\n        <button md-button (click)=\"toggleSidenav('left')\"\n                   ng-hide=\"menu.hideSidenavButton()\"\n                   class=\"dc-toolbar-sidenav-button md-icon-button\">\n            <md-icon aria-label=\"Menu\"  md-font-set=\"material-icons\" >menu</md-icon>\n        </button>\n        <select *ngIf=\"menu.toolbarSelect.enabled\"\n                    aria-label=\"Select Page\"\n                   placeholder=\"{{$ctrl.pageTitle()}}\"\n                   ng-model=\"$ctrl.menu.toolbarSelect.selected\"\n                   ng-change=\"$ctrl.menu.toolbarSelectUpdate()\">\n            <md-option class=\"text-headline\"s\n                        ng-value=\"option.value\"\n                       ng-repeat=\"option in $ctrl.menu.toolbarSelect.options\">\n                {{option.name}}\n            </md-option>\n        </select> -->\n        <span flex class=\"title text-headline\">{{pageTitle()}}</span>\n        <div layout=\"column\">\n            <div>{{session.client_name}}</div>\n            <span *devctrlAdminOnly>{{session.username}}</span>\n        </div>\n\n        <button md-icon-button [md-menu-trigger-for]=\"adminmenu\">\n            <md-icon  md-font-set=\"material-icons\">more_vert</md-icon>\n        </button>\n        <md-menu #adminmenu=\"mdMenu\">\n            <button md-menu-item (click)=\"adminLogin()\">\n                    Admin Login\n            </button>\n            <button md-menu-item *devctrlAdminOnly (click)=\"revokeAdmin()\">\n                    Admin Logout\n            </button>\n            <button md-menu-item *devCtrlAdminOnly (click)=\"editClient($event)\">\n                    Edit Client\n            </button>\n        </md-menu>\n    </div>\n</md-toolbar>\n"
    }),
    __param(0, core_1.Inject('$state')),
    __param(2, core_1.Inject('DataService')),
    __metadata("design:paramtypes", [Object, menu_service_1.MenuService,
        data_service_1.DataService])
], ToolbarComponent);
exports.ToolbarComponent = ToolbarComponent;
var templateOoriginal = "\n<md-toolbar layout=\"row\" layout-align=\"start center\">\n    <div flex layout=\"row\"\n         layout-align=\"center center\"\n         class=\"devctrl-main-toolbar devctrl-ctrl-select\">\n        <md-button ng-click=\"$ctrl.menu.toggleSidenav('left')\"\n                   ng-hide=\"$ctrl.menu.hideSidenavButton()\"\n                   class=\"dc-toolbar-sidenav-button md-icon-button\">\n            <md-icon aria-label=\"Menu\"  md-font-set=\"material-icons\" >menu</md-icon>\n        </md-button>\n        <md-select ng-if=\"$ctrl.menu.toolbarSelect.enabled\"\n                    aria-label=\"Select Page\"\n                   placeholder=\"{{$ctrl.pageTitle()}}\"\n                   ng-model=\"$ctrl.menu.toolbarSelect.selected\"\n                   ng-change=\"$ctrl.menu.toolbarSelectUpdate()\">\n            <md-option class=\"text-headline\"\n                        ng-value=\"option.value\"\n                       ng-repeat=\"option in $ctrl.menu.toolbarSelect.options\">\n                {{option.name}}\n            </md-option>\n        </md-select>\n        <span flex class=\"title text-headline\">{{$ctrl.pageTitle()}}</span>\n        <div layout=\"column\">\n            <div>{{$ctrl.session.client_name}}</div>\n            <span ng-if=\"$ctrl.adminLoggedIn()\">{{$ctrl.session.username}}</span>\n        </div>\n\n\n        <md-menu>\n            <md-button  class=\"md-icon-button\" ng-click=\"$mdOpenMenu($event)\">\n                <md-icon  md-font-set=\"material-icons\">more_vert</md-icon>\n            </md-button>\n            <md-menu-content>\n                <md-menu-item ng-if=\"$ctrl.showAdminLogin()\">\n                    <md-button ng-click=\"$ctrl.adminLogin()\">\n                        Admin Login\n                    </md-button>\n                </md-menu-item>\n                <md-menu-item ng-if=\"$ctrl.adminLoggedIn()\">\n                    <md-switch ng-model=\"$ctrl.config.editEnabled\"\n                               ng-change=\"$ctrl.updateConfig()\">\n                        Edit\n                    </md-switch>\n                </md-menu-item>\n                <md-menu-item ng-if=\"$ctrl.adminLoggedIn()\">\n                    <md-button ng-click=\"$ctrl.revokeAdmin()\">\n                        Admin Logout\n                    </md-button>\n                </md-menu-item>\n                <md-menu-item ng-if=\"$ctrl.adminLoggedIn()\">\n                    <md-button ng-click=\"$ctrl.editClient($event)\">\n                        Edit Client\n                    </md-button>\n                </md-menu-item>\n            </md-menu-content>\n        </md-menu>\n    </div>\n</md-toolbar>\n";
//# sourceMappingURL=toolbar.component.js.map