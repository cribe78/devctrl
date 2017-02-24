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
var router_1 = require("@angular/router");
var ConfigComponent = (function () {
    function ConfigComponent(route, router) {
        this.route = route;
        this.router = router;
    }
    ConfigComponent.prototype.noActivatedChildren = function () {
        var val = this.route.children.length == 0;
        return val;
    };
    return ConfigComponent;
}());
ConfigComponent = __decorate([
    core_1.Component({
        selector: 'devctrl-config',
        template: "\n<div *ngIf=\"noActivatedChildren()\">\n    <md-card>\n        <md-card-content>\n            <md-list>\n                <a md-list-item (click)=\"router.navigate(['config','data'])\">\n                    Table Data\n                    <span flex></span>\n                    <md-icon md-font-set=\"material-icons\" >chevron_right</md-icon>\n                </a>\n                <a md-list-item (click)=\"router.navigate(['config','log'])\">\n                    Logs\n                    <span flex></span>\n                    <md-icon md-font-set=\"material-icons\" >chevron_right</md-icon>\n                </a>\n            </md-list>\n        </md-card-content>\n    </md-card>\n</div>\n<router-outlet></router-outlet>    \n"
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router])
], ConfigComponent);
exports.ConfigComponent = ConfigComponent;
//# sourceMappingURL=config.component.js.map