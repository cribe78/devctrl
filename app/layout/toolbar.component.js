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
var data_service_1 = require("../data.service");
var menu_service_1 = require("./menu.service");
var core_1 = require("@angular/core");
var layout_service_1 = require("./layout.service");
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
        template: "\n<div class=\"outer-div\">\n    <md-toolbar color=\"accent\" class=\"devctrl-title-toolbar\">\n        <div class=\"devctrl-title-toolbar-inner\">\n            <button md-icon-button (click)=\"menu.toggleSidenav()\">\n                <md-icon aria-label=\"Menu\">menu</md-icon>\n            </button>\n            <span class=\"text-display-1 md-accent\">DevCtrl</span>\n            <button *ngIf=\"ls.mobile\" md-icon-button [md-menu-trigger-for]=\"adminmenu\">\n                <md-icon>more_vert</md-icon>\n            </button>\n        </div>\n    </md-toolbar>\n    <md-toolbar color=\"primary\" class=\"devctrl-main-toolbar\">\n        <div class=\"devctrl-main-toolbar devctrl-ctrl-select\">\n            <md-select *ngIf=\"menu.toolbarSelect.enabled && ls.desktop\"\n                        aria-label=\"Select Page\"\n                        name=\"toolbarSelect\"\n                       [(ngModel)]=\"menu.toolbarSelect.selected\"\n                       (onClose)=\"menu.toolbarSelectUpdate($event)\">\n                <md-option class=\"text-headline\"\n                            [value]=\"option.id\"\n                           *ngFor=\"let option of menu.toolbarSelect.options\">\n                    {{option.name}}\n                </md-option>\n            </md-select>\n            <span class=\"devctrl-pagetitle text-headline\" >\n                <div>{{menu.pageTitle}}</div>\n            </span>\n            <div class=\"devctrl-client-info\">\n                <div class=\"text-subhead\">{{session.client_name}}</div>\n                <span *devctrlAdminOnly class=\"text-subhead\">{{session.username}}</span>\n            </div>\n    \n            <button *ngIf=\"ls.desktop\" md-icon-button [md-menu-trigger-for]=\"adminmenu\">\n                <md-icon>more_vert</md-icon>\n            </button>\n            <md-menu #adminmenu=\"mdMenu\">\n                <button md-menu-item (click)=\"adminLogin()\">\n                        Admin Login\n                </button>\n                <button md-menu-item *devctrlAdminOnly (click)=\"revokeAdmin()\">\n                        Admin Logout \n                </button>\n                \n                <button md-menu-item *devctrlAdminOnly (click)=\"editClient($event)\">\n                        Edit Client\n                </button>\n            </md-menu>\n        </div>\n    </md-toolbar>\n</div>\n",
        //language=CSS
        styles: ["   \n.outer-div {\n    display: flex;\n    flex-direction: row;\n}\n\n\nmd-toolbar.devctrl-main-toolbar {\n    flex: 1 1;\n}\n\n\ndiv.devctrl-main-toolbar {\n    display: flex;\n    flex: 1 1;\n    flex-direction: row;\n    justify-content: space-between;\n    align-items: center;\n}\n\n.devctrl-client-info {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n}\n\n.devctrl-pagetitle {\n    flex: 1 1;\n    display: flex;\n    justify-content: center;\n}\n\n.devctrl-title-toolbar {\n    width: 270px;\n}\n\n.devctrl-title-toolbar-inner {    \n    display: flex;\n    justify-content: space-between;\n}\n\n.devctrl-main-toolbar md-select {\n    width: 200px;\n}\n\nmd-select /deep/ .mat-select-value {\n    color: rgba(255,255,255,.87);\n}\n\nmd-select /deep/ .mat-select-arrow {\n    color: rgba(255,255,255,.87);\n}\n\n@media screen and (max-width: 599px) {\n    .devctrl-title-toolbar {\n        width: 100%;\n    }\n    \n    .outer-div {\n        flex-direction: column;\n    }\n}\n\n.job-toolbar {\n    flex: 1 1;\n    display: flex;\n    justify-content: space-between;\n}\n\n.job-monitor-card {\n    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);\n    transition: box-shadow 280ms cubic-bezier(.4,0,.2,1);\n    will-change: box-shadow;\n    display: block;\n\n}\n\n.job-output {\n    display: flex;\n    flex-direction: column;\n    overflow: auto;\n    max-height: 800px;\n}\n\n"]
    }),
    __metadata("design:paramtypes", [menu_service_1.MenuService,
        data_service_1.DataService,
        layout_service_1.LayoutService])
], ToolbarComponent);
exports.ToolbarComponent = ToolbarComponent;
//# sourceMappingURL=toolbar.component.js.map