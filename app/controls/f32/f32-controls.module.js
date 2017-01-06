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
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var f32_multibutton_control_1 = require("./f32-multibutton.control");
var F32ControlsModule = (function () {
    function F32ControlsModule() {
    }
    return F32ControlsModule;
}());
F32ControlsModule = __decorate([
    core_1.NgModule({
        imports: [
            material_1.MaterialModule,
            forms_1.FormsModule,
            common_1.CommonModule
        ],
        declarations: [
            f32_multibutton_control_1.F32MultibuttonControl
        ],
        exports: [
            f32_multibutton_control_1.F32MultibuttonControl
        ]
    }),
    __metadata("design:paramtypes", [])
], F32ControlsModule);
exports.F32ControlsModule = F32ControlsModule;
//# sourceMappingURL=f32-controls.module.js.map