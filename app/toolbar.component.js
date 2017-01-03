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
var data_service_1 = require("./data.service");
var menu_service_1 = require("./menu.service");
var core_1 = require("@angular/core");
// This component depends on a working md-select, which has not been released yet
var ToolbarComponent = (function () {
    function ToolbarComponent(menuService, dataService) {
        this.dataService = dataService;
        this.menu = menuService;
        this.menuService = menuService;
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
        template: "\n<md-toolbar class=\"layout-row layout-align-start-center\">\n    <div class=\"flex devctrl-main-toolbar devctrl-ctrl-select layout-row layout-align-center-center\">\n        <button md-button (click)=\"menu.toggleSidenav('left')\"\n                   ng-hide=\"menu.hideSidenavButton()\"\n                   class=\"dc-toolbar-sidenav-button md-icon-button\">\n            <md-icon aria-label=\"Menu\"  md-font-set=\"material-icons\" >menu</md-icon>\n        </button>\n        <select *ngIf=\"menu.toolbarSelect.enabled\"\n                    aria-label=\"Select Page\"\n                    name=\"toolbarSelect\"\n                   [(ngModel)]=\"menu.toolbarSelect.selected\"\n                   (change)=\"menu.toolbarSelectUpdate($event)\">\n            <option class=\"text-headline\"\n                        [value]=\"option.id\"\n                       *ngFor=\"let option of menu.toolbarSelect.options\">\n                {{option.name}}\n            </option>\n        </select>\n        <span class=\"flex title text-headline\">{{menu.pageTitle}}</span>\n        <div class=\"layout-column\">\n            <div>{{session.client_name}}</div>\n            <span *devctrlAdminOnly>{{session.username}}</span>\n        </div>\n\n        <button md-button [md-menu-trigger-for]=\"adminmenu\">\n            <md-icon>more_vert</md-icon>\n        </button>\n        <md-menu #adminmenu=\"mdMenu\">\n            <button md-menu-item (click)=\"adminLogin()\">\n                    Admin Login\n            </button>\n            <button md-menu-item *devctrlAdminOnly (click)=\"revokeAdmin()\">\n                    Admin Logout\n            </button>\n            <button md-menu-item *devCtrlAdminOnly (click)=\"editClient($event)\">\n                    Edit Client\n            </button>\n        </md-menu>\n    </div>\n</md-toolbar>\n"
    }),
    __metadata("design:paramtypes", [menu_service_1.MenuService,
        data_service_1.DataService])
], ToolbarComponent);
exports.ToolbarComponent = ToolbarComponent;
//# sourceMappingURL=toolbar.component.js.map