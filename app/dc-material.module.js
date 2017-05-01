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
var material_1 = require("@angular/material");
var DCMaterialModule = (function () {
    function DCMaterialModule() {
    }
    return DCMaterialModule;
}());
DCMaterialModule = __decorate([
    core_1.NgModule({
        imports: [
            material_1.MdButtonModule,
            material_1.MdCardModule,
            material_1.MdCheckboxModule,
            material_1.MdGridListModule,
            material_1.MdIconModule,
            material_1.MdInputModule,
            material_1.MdListModule,
            material_1.MdMenuModule,
            material_1.MdSelectModule,
            material_1.MdSliderModule,
            material_1.MdTabsModule,
            material_1.MdToolbarModule,
            material_1.MdTooltipModule,
            material_1.MdSidenavModule
        ],
        exports: [
            material_1.MdButtonModule,
            material_1.MdCardModule,
            material_1.MdCheckboxModule,
            material_1.MdGridListModule,
            material_1.MdIconModule,
            material_1.MdInputModule,
            material_1.MdListModule,
            material_1.MdMenuModule,
            material_1.MdSelectModule,
            material_1.MdSliderModule,
            material_1.MdTabsModule,
            material_1.MdToolbarModule,
            material_1.MdTooltipModule,
            material_1.MdSidenavModule
        ]
    }),
    __metadata("design:paramtypes", [])
], DCMaterialModule);
exports.DCMaterialModule = DCMaterialModule;
//# sourceMappingURL=dc-material.module.js.map