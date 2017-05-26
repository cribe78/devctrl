"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var basic_controls_module_1 = require("./basic/basic-controls.module");
var control_component_1 = require("./control.component");
var common_1 = require("@angular/common");
var f32_controls_module_1 = require("./f32/f32-controls.module");
var panasonic_controls_module_1 = require("./panasonic/panasonic-controls.module");
var control_value_selector_component_1 = require("./control-value-selector.component");
var ControlsModule = (function () {
    function ControlsModule() {
    }
    return ControlsModule;
}());
ControlsModule = __decorate([
    core_1.NgModule({
        imports: [
            material_1.MaterialModule,
            forms_1.FormsModule,
            basic_controls_module_1.BasicControlsModule,
            f32_controls_module_1.F32ControlsModule,
            panasonic_controls_module_1.PanasonicControlsModule,
            common_1.CommonModule
        ],
        declarations: [
            control_component_1.ControlComponent,
            control_value_selector_component_1.ControlValueSelectorComponent
        ],
        exports: [
            basic_controls_module_1.BasicControlsModule,
            f32_controls_module_1.F32ControlsModule,
            control_component_1.ControlComponent,
            control_value_selector_component_1.ControlValueSelectorComponent,
            panasonic_controls_module_1.PanasonicControlsModule
        ]
    })
], ControlsModule);
exports.ControlsModule = ControlsModule;
//# sourceMappingURL=controls.module.js.map