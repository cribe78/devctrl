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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var control_service_1 = require("../../control.service");
var data_service_1 = require("../../../data.service");
var PresetMapDefault = (function () {
    function PresetMapDefault(cs, ds) {
        this.cs = cs;
        this.ds = ds;
        this.presetSelected = new core_1.EventEmitter();
    }
    PresetMapDefault.prototype.ngOnInit = function () { };
    PresetMapDefault.prototype.triggerPreset = function (preset) {
        this.presetSelected.emit(preset);
    };
    return PresetMapDefault;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], PresetMapDefault.prototype, "presetSelected", void 0);
PresetMapDefault = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: '[preset-map-default]',
        templateUrl: 'preset-map-default.html'
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService,
        data_service_1.DataService])
], PresetMapDefault);
exports.PresetMapDefault = PresetMapDefault;
//# sourceMappingURL=preset-map-default.control.js.map