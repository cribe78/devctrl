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
var data_service_1 = require("./data.service");
var menu_service_1 = require("./layout/menu.service");
var ConfigDataComponent = (function () {
    function ConfigDataComponent(route, menu, dataService) {
        this.route = route;
        this.menu = menu;
        this.dataService = dataService;
    }
    ConfigDataComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.schema = this.dataService.schema;
        this.schemaArray = Object.keys(this.schema).map(function (key) {
            _this.schema[key]['name'] = key;
            return _this.schema[key];
        });
        this.menu.currentTopLevel = menu_service_1.MenuService.TOPLEVEL_CONFIG;
    };
    ConfigDataComponent.prototype.noActivatedChildren = function () {
        var val = this.route.children.length == 0;
        return val;
    };
    return ConfigDataComponent;
}());
ConfigDataComponent = __decorate([
    core_1.Component({
        selector: 'devctrl-config-data',
        template: "\n<div layout=\"column\" *ngIf=\"noActivatedChildren()\">\n    <md-list>\n        <template ngFor let-schema [ngForOf]=\"schemaArray\">\n            <a md-list-item (click)=\"menu.go(['config', schema.name])\">\n                {{schema.label}}\n                <span flex></span>\n                <md-icon>chevron_right</md-icon>\n            </a>\n            <md-divider></md-divider> \n        </template>\n    </md-list>\n</div>  \n"
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        menu_service_1.MenuService,
        data_service_1.DataService])
], ConfigDataComponent);
exports.ConfigDataComponent = ConfigDataComponent;
//# sourceMappingURL=config-data.component.js.map