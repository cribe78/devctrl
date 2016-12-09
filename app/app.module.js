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
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const material_1 = require("@angular/material");
const http_1 = require("@angular/http");
const static_1 = require("@angular/upgrade/static");
const menu_component_1 = require("./menu.component");
const menu_service_1 = require("./menu.service");
//import {ToolbarComponent} from "./toolbar.component";
const admin_only_directive_1 = require("./admin-only.directive");
const data_service_1 = require("./data.service");
let AppModule = class AppModule {
    ngDoBootstrap() { }
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            static_1.UpgradeModule,
            material_1.MaterialModule.forRoot(),
            http_1.HttpModule
        ],
        declarations: [menu_component_1.MenuComponent, admin_only_directive_1.AdminOnlyDirective],
        entryComponents: [menu_component_1.MenuComponent],
        providers: [
            data_service_1.DataService,
            menu_service_1.MenuService,
            {
                provide: '$state',
                useFactory: i => i.get('$state'),
                deps: ['$injector']
            },
            {
                provide: '$mdToast',
                useFactory: i => i.get('$mdToast'),
                deps: ['$injector']
            },
            {
                provide: '$mdDialog',
                useFactory: i => i.get('$mdDialog'),
                deps: ['$injector']
            },
        ],
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map