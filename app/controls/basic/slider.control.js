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
var control_service_1 = require("../control.service");
var SliderControl = (function () {
    function SliderControl(cs) {
        this.cs = cs;
    }
    SliderControl.prototype.ngOnInit = function () { };
    return SliderControl;
}());
SliderControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-slider',
        template: "\n<div class=\"devctrl-ctrl\"\n     style=\"display: flex; flex-direction: row; align-items: center;\">\n\n        <label class=\"text-menu devctrl-ctrl-label\">{{cs.name}}</label>\n        <md-slider style=\"flex: 3 1;\"\n                   min=\"{{cs.intConfig('min')}}\"\n                   max=\"{{cs.intConfig('max')}}\"\n                   [(ngModel)]=\"cs.value\"\n                   (change)=\"cs.updateValue()\">\n        </md-slider>\n        <div>\n            <input class=\"devctrl-slider-input\"\n                   type=\"number\"\n                   [(ngModel)]=\"cs.value\"\n                   (change)=\"cs.updateValue()\">\n        </div>\n\n</div>    \n    "
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService])
], SliderControl);
exports.SliderControl = SliderControl;
//# sourceMappingURL=slider.control.js.map