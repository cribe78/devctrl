"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var static_1 = require("@angular/upgrade/static");
var ToolbarController = (function () {
    function ToolbarController(menuService, dataService) {
        this.dataService = dataService;
        this.menu = menuService;
        this.menuService = menuService;
        this.session = this.dataService['userSession'];
        console.log("Toolbar Component created");
    }
    ToolbarController.prototype.showAdminLogin = function () {
        // Show Admin login option if not currently admin authorized
        return !this.dataService.isAdminAuthorized();
    };
    ;
    ToolbarController.prototype.adminLogin = function () {
        this.dataService.doAdminLogon();
    };
    ;
    ToolbarController.prototype.editClient = function ($event) {
        //this.dataService.editRecord($event, self.user.client_id, "clients");
        //TODO implement editting of session name
    };
    ;
    ToolbarController.prototype.revokeAdmin = function () {
        this.dataService.revokeAdminAuth();
    };
    ;
    ToolbarController.prototype.updateConfig = function () {
        this.dataService.updateConfig();
    };
    ;
    return ToolbarController;
}());
ToolbarController.$inject = ['MenuService', 'DataService'];
exports.ToolbarComponent = {
    controller: ToolbarController,
    template: "\n<md-toolbar layout=\"row\" layout-align=\"start center\">\n    <div flex layout=\"row\"\n         layout-align=\"center center\"\n         class=\"devctrl-main-toolbar devctrl-ctrl-select\">\n        <md-button ng-click=\"$ctrl.menu.toggleSidenav('left')\"\n                   ng-hide=\"$ctrl.menu.hideSidenavButton()\"\n                   class=\"dc-toolbar-sidenav-button md-icon-button\">\n            <md-icon aria-label=\"Menu\"  md-font-set=\"material-icons\" >menu</md-icon>\n        </md-button>\n        <md-select ng-if=\"$ctrl.menu.toolbarSelect.enabled\"\n                    aria-label=\"Select Page\"\n                   placeholder=\"{{$ctrl.menu.pageTitle}}\"\n                   ng-model=\"$ctrl.menu.toolbarSelect.selected\"\n                   ng-change=\"$ctrl.menu.toolbarSelectUpdate()\">\n            <md-option class=\"text-headline\"\n                        ng-value=\"option.id\"\n                       ng-repeat=\"option in $ctrl.menu.toolbarSelect.options\">\n                {{option.name}}\n            </md-option>\n        </md-select>\n        <span flex class=\"title text-headline\">{{$ctrl.menu.pageTitle}}</span>\n        <div layout=\"column\">\n            <div>{{$ctrl.session.client_name}}</div>\n            <span ng-if=\"$ctrl.adminLoggedIn()\">{{$ctrl.session.username}}</span>\n        </div>\n\n\n        <md-menu>\n            <md-button  class=\"md-icon-button\" ng-click=\"$mdOpenMenu($event)\">\n                <md-icon  md-font-set=\"material-icons\">more_vert</md-icon>\n            </md-button>\n            <md-menu-content>\n                <md-menu-item ng-if=\"$ctrl.showAdminLogin()\">\n                    <md-button ng-click=\"$ctrl.adminLogin()\">\n                        Admin Login\n                    </md-button>\n                </md-menu-item>\n                <md-menu-item devctrl-admin-only>\n                    <md-switch ng-model=\"$ctrl.config.editEnabled\"\n                               ng-change=\"$ctrl.updateConfig()\">\n                        Edit\n                    </md-switch>\n                </md-menu-item>\n                <md-menu-item devctrl-admin-only>\n                    <md-button ng-click=\"$ctrl.revokeAdmin()\">\n                        Admin Logout\n                    </md-button>\n                </md-menu-item>\n                <md-menu-item devctrl-admin-only>\n                    <md-button ng-click=\"$ctrl.editClient($event)\">\n                        Edit Client\n                    </md-button>\n                </md-menu-item>\n            </md-menu-content>\n        </md-menu>\n    </div>\n</md-toolbar>\n"
};
var ToolbarComponentNg2 = (function (_super) {
    __extends(ToolbarComponentNg2, _super);
    function ToolbarComponentNg2(elementRef, injector) {
        return _super.call(this, 'devctrlToolbar', elementRef, injector) || this;
    }
    return ToolbarComponentNg2;
}(static_1.UpgradeComponent));
ToolbarComponentNg2 = __decorate([
    core_1.Directive({
        selector: 'devctrl-toolbar'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
], ToolbarComponentNg2);
exports.ToolbarComponentNg2 = ToolbarComponentNg2;
//# sourceMappingURL=toolbar.component.js.map