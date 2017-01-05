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
var data_service_1 = require("../data.service");
var menu_service_1 = require("./menu.service");
var core_1 = require("@angular/core");
var layout_service_1 = require("./layout.service");
// This component depends on a working md-select, which has not been released yet
var ToolbarComponent = (function () {
    function ToolbarComponent(menuService, dataService, ls) {
        this.dataService = dataService;
        this.ls = ls;
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
        template: "\n<div fxLayout=\"column\"\n     fxLayout.gt-sm=\"row\">\n    <md-toolbar fxFlex fxFlex.gt-sm=\"270px\" class=\"md-accent devctrl-title-toolbar\">\n        <div fxLayout=\"row\"\n             fxLayoutAlign=\"space-between center\"\n             fxFill>\n            <button md-icon-button fxFlex=\"none\" (click)=\"menu.toggleSidenav()\" class=\"dc-sidenav-close md-icon-button\">\n                <md-icon aria-label=\"Menu\">menu</md-icon>\n            </button>\n            <span fxFlex class=\"text-display-1 md-accent\">DevCtrl</span>\n            <button *ngIf=\"ls.mobile\" fxFlex=\"none\" md-icon-button [md-menu-trigger-for]=\"adminmenu\">\n                <md-icon>more_vert</md-icon>\n            </button>\n        </div>\n    </md-toolbar>\n    <md-toolbar fxFlex color=\"primary\">\n        <div class=\"devctrl-main-toolbar devctrl-ctrl-select\"\n             fxLayout=\"row\"\n             fxLayoutAlign=\"space-between center\"\n             fxFill>\n            <select *ngIf=\"menu.toolbarSelect.enabled && ls.desktop\"\n                    fxFlex=\"140px\"\n                        aria-label=\"Select Page\"\n                        name=\"toolbarSelect\"\n                       [(ngModel)]=\"menu.toolbarSelect.selected\"\n                       (change)=\"menu.toolbarSelectUpdate($event)\">\n                <option class=\"text-headline\"\n                            [value]=\"option.id\"\n                           *ngFor=\"let option of menu.toolbarSelect.options\">\n                    {{option.name}}\n                </option>\n            </select>\n            <span class=\"text-headline\" \n                    fxFlex \n                    fxAlign=\"center\"\n                    fxLayout=\"row\"\n                    fxLayoutAlign=\"space-around center\">\n                <div>{{menu.pageTitle}}</div>\n            </span>\n            <div fxFlex=\"none\" fxLayout=\"column\">\n                <div fxFlex=\"50%\" class=\"text-subhead\">{{session.client_name}}</div>\n                <span fxFlex=\"50%\" *devctrlAdminOnly class=\"text-subhead\">{{session.username}}</span>\n            </div>\n    \n            <button *ngIf=\"ls.desktop\" fxFlex=\"none\" md-icon-button [md-menu-trigger-for]=\"adminmenu\">\n                <md-icon>more_vert</md-icon>\n            </button>\n            <md-menu fxFlex=\"none\" #adminmenu=\"mdMenu\">\n                <button md-menu-item (click)=\"adminLogin()\">\n                        Admin Login\n                </button>\n                <button md-menu-item *devctrlAdminOnly (click)=\"revokeAdmin()\">\n                        Admin Logout\n                </button>\n                <button md-menu-item *devCtrlAdminOnly (click)=\"editClient($event)\">\n                        Edit Client\n                </button>\n            </md-menu>\n        </div>\n    </md-toolbar>\n</div>\n"
    }),
    __metadata("design:paramtypes", [menu_service_1.MenuService,
        data_service_1.DataService,
        layout_service_1.LayoutService])
], ToolbarComponent);
exports.ToolbarComponent = ToolbarComponent;
//# sourceMappingURL=toolbar.component.js.map