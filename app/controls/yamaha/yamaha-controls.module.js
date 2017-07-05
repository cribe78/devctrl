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
var clql_fader_control_1 = require("./clql-fader.control");
var clql_fader_combo_control_1 = require("./clql-fader-combo.control");
var YamahaControlsModule = (function () {
    function YamahaControlsModule() {
    }
    return YamahaControlsModule;
}());
YamahaControlsModule = __decorate([
    core_1.NgModule({
        imports: [
            material_1.MaterialModule,
            forms_1.FormsModule,
            common_1.CommonModule
        ],
        declarations: [
            clql_fader_control_1.CLQLFaderControl,
            clql_fader_combo_control_1.CLQLFaderComboControl
        ],
        exports: [
            clql_fader_control_1.CLQLFaderControl,
            clql_fader_combo_control_1.CLQLFaderComboControl
        ],
        providers: [
            common_1.DecimalPipe
        ]
    })
], YamahaControlsModule);
exports.YamahaControlsModule = YamahaControlsModule;
//# sourceMappingURL=yamaha-controls.module.js.map