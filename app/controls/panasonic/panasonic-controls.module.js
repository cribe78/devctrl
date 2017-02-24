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
var awhe130_preset_control_1 = require("./awhe130-preset.control");
var awhe130_preset_map_control_1 = require("./awhe130-preset-map.control");
var preset_map_pict_l_control_1 = require("./preset-maps/preset-map-pict-l.control");
var preset_map_pict_r_control_1 = require("./preset-maps/preset-map-pict-r.control");
var PanasonicControlsModule = (function () {
    function PanasonicControlsModule() {
    }
    return PanasonicControlsModule;
}());
PanasonicControlsModule = __decorate([
    core_1.NgModule({
        imports: [
            material_1.MaterialModule,
            forms_1.FormsModule,
            common_1.CommonModule
        ],
        declarations: [
            awhe130_preset_control_1.AWHE130PresetControl,
            awhe130_preset_map_control_1.AWHE130PresetMapControl,
            preset_map_pict_l_control_1.PresetMapPictLControl,
            preset_map_pict_r_control_1.PresetMapPictRControl
        ],
        exports: [
            awhe130_preset_control_1.AWHE130PresetControl,
            awhe130_preset_map_control_1.AWHE130PresetMapControl,
            preset_map_pict_l_control_1.PresetMapPictLControl,
            preset_map_pict_r_control_1.PresetMapPictRControl
        ]
    }),
    __metadata("design:paramtypes", [])
], PanasonicControlsModule);
exports.PanasonicControlsModule = PanasonicControlsModule;
//# sourceMappingURL=panasonic-controls.module.js.map