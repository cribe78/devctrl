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
    function AppComponent(route, router, dataService, menuService) {
        this.route = route;
        this.router = router;
        this.dataService = dataService;
        this.menuService = menuService;
        this.menu = menuService;
    }
    ;
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("init AppComponent, url is " + this.route.snapshot.url.join(''));
        this.route.url.subscribe(function (url) {
            var pathSegments = url.map(function (segment) {
                return segment.path;
            });
            var path = pathSegments.join('/');
            console.log("APpComponent: route is " + path + " or " + _this.router.url);
        });
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
        template: "\n<body fxLayout=\"row\">\n    <div *ngIf=\"! menu.narrowMode()\"\n         [hidden]=\"menu.isSidenavOpen()\"\n         class=\"dc-sidenav md-sidenav-left md-whiteframe-z2 layout-column\">\n        <md-toolbar class=\"md-accent layout-row layout-align-start-center\">\n            <button md-button (click)=\"menu.toggleSidenav('left')\" class=\"dc-sidenav-close md-icon-button\">\n                <md-icon aria-label=\"Menu\">menu</md-icon>\n            </button>\n            <span flex class=\"text-display-1 md-accent md-hue-1\">DevCtrl</span>\n        </md-toolbar>\n        <div flex role=\"navigation\" class=\"md-accent md-hue-1\">\n            <devctrl-menu></devctrl-menu>\n        </div>\n    </div>\n\n    <md-sidenav *ngIf=\"menu.narrowMode()\"\n                class=\"md-sidenav-left md-whiteframe-z2 layout-column\">\n        <md-toolbar layout=\"row\"  layout-align=\"start center\" class=\"md-accent\">\n            <button md-button (click)=\"menu.toggleSidenav('left')\" class=\"dc-sidenav-close md-icon-button\">\n                <md-icon aria-label=\"Menu\">menu</md-icon>\n            </button>\n            <span flex class=\"text-display-1 md-accent md-hue-1\">DevCtrl</span>\n        </md-toolbar>\n        <div flex role=\"navigation\" class=\"md-accent md-hue-1\">\n            <devctrl-menu></devctrl-menu>\n        </div>\n    </md-sidenav>\n    <div fxLayout=\"column\">\n        <devctrl-toolbar></devctrl-toolbar>\n        <div *ngIf=\"menu.narrowMode()\"\n                    flex\n                    id=\"content\"\n                    class=\"devctrl-main-content layout-column layout-margin\">\n            <router-outlet></router-outlet>\n        </div>\n        <div *ngIf=\"! menu.narrowMode()\"\n                class=\"layout-column layout-align-start-center layout-margin\"\n                fxLayout=\"column\"\n                fxLayoutAlign=\"start center\"\n                id=\"content\"\n                    [style.background-img]=\"backgroundImg()\">\n            <section class=\"md-whiteframe-z1 devctrl-main-card\" [ngClass]=\"cardClasses()\">\n                    <router-outlet></router-outlet> \n            </section>\n        </div>\n    </div>\n</body>\n"
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        data_service_1.DataService,
        menu_service_1.MenuService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map