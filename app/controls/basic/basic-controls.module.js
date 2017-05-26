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
var common_1 = require("@angular/common");
var button_control_1 = require("./button.control");
var default_control_1 = require("./default.control");
var switch_control_1 = require("./switch.control");
var slider_control_1 = require("./slider.control");
var select_control_1 = require("./select.control");
var select_readonly_control_1 = require("./select-readonly.control");
var button_set_control_1 = require("./button-set.control");
var level_control_1 = require("./level.control");
var image_control_1 = require("./image.control");
var slder2d_control_1 = require("./slder2d.control");
var hyperlink_control_1 = require("./hyperlink.control");
var switch_readonly_control_1 = require("./switch-readonly.control");
var BasicControlsModule = (function () {
    function BasicControlsModule() {
    }
    return BasicControlsModule;
}());
BasicControlsModule = __decorate([
    core_1.NgModule({
        imports: [
            material_1.MaterialModule,
            forms_1.FormsModule,
            common_1.CommonModule
        ],
        declarations: [
            button_control_1.ButtonControl,
            button_set_control_1.ButtonSetControl,
            default_control_1.DefaultControl,
            hyperlink_control_1.HyperlinkControl,
            image_control_1.ImageControl,
            level_control_1.LevelControl,
            select_control_1.SelectControl,
            select_readonly_control_1.SelectReadonlyControl,
            slider_control_1.SliderControl,
            slder2d_control_1.Slider2dControl,
            switch_control_1.SwitchControl,
            switch_readonly_control_1.SwitchReadonlyControl
        ],
        exports: [
            button_control_1.ButtonControl,
            button_set_control_1.ButtonSetControl,
            default_control_1.DefaultControl,
            hyperlink_control_1.HyperlinkControl,
            image_control_1.ImageControl,
            level_control_1.LevelControl,
            select_control_1.SelectControl,
            select_readonly_control_1.SelectReadonlyControl,
            slider_control_1.SliderControl,
            slder2d_control_1.Slider2dControl,
            switch_control_1.SwitchControl,
            switch_readonly_control_1.SwitchReadonlyControl
        ]
    })
], BasicControlsModule);
exports.BasicControlsModule = BasicControlsModule;
//# sourceMappingURL=basic-controls.module.js.map