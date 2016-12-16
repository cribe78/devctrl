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
var core_1 = require("@angular/core");
var data_service_1 = require("./data.service");
var menu_service_1 = require("./menu.service");
var router_1 = require("@angular/router");
var AppComponent = (function () {
    function AppComponent(route, dataService, menuService) {
        this.route = route;
        this.dataService = dataService;
        this.menuService = menuService;
        this.menu = menuService;
    }
    ;
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.backgroundImg = function () {
        //TODO: implement this with the new router
        /**
        if (this.route.name && this.route.params.name) {
            let img = "url(/images/backgrounds/" + this.route.current.name + "/" + this.route.params.name + ".jpg)";
            return img;
        }
         **/
        return "url(/images/backgrounds/default.jpg";
    };
    AppComponent.prototype.cardClasses = function () {
        if (this.route.data && this.route.data['cardClasses']) {
            return this.route.data['cardClasses'];
        }
        return {};
    };
    AppComponent.prototype.updateConfig = function () {
        this.dataService.updateConfig();
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'devctrl-app',
        template: "\n<div *ngIf=\"! menu.narrowMode()\"\n     [hidden]=\"menu.isSidenavOpen()\"\n     class=\"dc-sidenav md-sidenav-left md-whiteframe-z2\"\n     layout=\"column\">\n    <md-toolbar layout=\"row\"  layout-align=\"start center\" class=\"md-accent\">\n        <button md-button (click)=\"menu.toggleSidenav('left')\" class=\"dc-sidenav-close md-icon-button\">\n            <md-icon aria-label=\"Menu\"  md-font-set=\"material-icons\" >menu</md-icon>\n        </button>\n        <span flex class=\"text-display-1 md-accent md-hue-1\">DevCtrl BETA</span>\n    </md-toolbar>\n    <div flex role=\"navigation\" class=\"md-accent md-hue-1\">\n        <devctrl-menu></devctrl-menu>\n    </div>\n</div>\n<md-sidenav *ngIf=\"menu.narrowMode()\"\n            class=\"md-sidenav-left md-whiteframe-z2 \"\n            layout=\"column\"\n            md-component-id=\"left\">\n    <md-toolbar layout=\"row\"  layout-align=\"start center\" class=\"md-accent\">\n        <button md-button (click)=\"menu.toggleSidenav('left')\" class=\"dc-sidenav-close md-icon-button\">\n            <md-icon aria-label=\"Menu\"  md-font-set=\"material-icons\" >menu</md-icon>\n        </button>\n        <span flex class=\"text-display-1 md-accent md-hue-1\">DWI DevCtrl</span>\n    </md-toolbar>\n    <div flex role=\"navigation\" class=\"md-accent md-hue-1\">\n        <devctrl-menu></devctrl-menu>\n    </div>\n</md-sidenav>\n<div layout=\"column\" flex>\n    <devctrl-toolbar></devctrl-toolbar>\n    <div *ngIf=\"menu.narrowMode()\"\n                layout=\"column\"\n                flex\n                layout-margin\n                id=\"content\"\n                class=\"devctrl-main-content\">\n        <router-outlet></router-outlet>\n    </div>\n    <div *ngIf=\"! menu.narrowMode()\"\n                layout=\"column\"\n                layout-align=\"start center\"\n                flex\n                layout-margin\n                id=\"content\"\n                [style.background-img]=\"backgroundImg()\">\n        <section class=\"md-whiteframe-z1 devctrl-main-card\" [ngClass]=\"cardClasses()\">\n                <router-outlet></router-outlet> \n\n        </section>\n    </div>\n</div>"
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        data_service_1.DataService,
        menu_service_1.MenuService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map