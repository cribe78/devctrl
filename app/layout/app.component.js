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
var data_service_1 = require("../data.service");
var menu_service_1 = require("./menu.service");
var router_1 = require("@angular/router");
var layout_service_1 = require("./layout.service");
var AppComponent = (function () {
    function AppComponent(route, router, dataService, menuService, ls) {
        this.route = route;
        this.router = router;
        this.dataService = dataService;
        this.menuService = menuService;
        this.ls = ls;
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
    AppComponent.prototype.sidenavMode = function () {
        if (this.ls.mobile) {
            return 'over';
        }
        return 'side';
    };
    AppComponent.prototype.updateConfig = function () {
        this.dataService.updateConfig();
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'devctrl-app',
        template: "\n<body (window:resize)=\"ls.resized($event)\">\n    <devctrl-toolbar></devctrl-toolbar>    \n    <md-sidenav-container>\n        <md-sidenav class=\"dc-sidenav\"\n                    [opened]=\"menu.isSidenavOpen()\"\n                    [mode]=\"sidenavMode()\">\n            <devctrl-menu></devctrl-menu>\n        </md-sidenav>\n        <router-outlet></router-outlet>\n    </md-sidenav-container>\n</body>\n",
        styles: ["\n.dc-sidenav {\n    width: 270px;\n}\n"]
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        data_service_1.DataService,
        menu_service_1.MenuService,
        layout_service_1.LayoutService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map