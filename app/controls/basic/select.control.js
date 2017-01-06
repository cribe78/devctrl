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
var SelectControl = (function () {
    function SelectControl(cs) {
        this.cs = cs;
    }
    SelectControl.prototype.ngOnInit = function () { };
    return SelectControl;
}());
SelectControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-select',
        template: "\n<div class=\"devctrl-ctrl devctrl-ctrl-select\"\n     fxLayout=\"row\" \n     fxLayoutAlign=\"space-between center\"\n     fxFill\n     style=\"display: flex; flex-direction: row; align-items: center;\">\n    <div fxFlex=\"20%\" class=\"text-menu devctrl-ctrl-label\">{{cs.name}}</div>\n    <form fxFlex=\"none\" style=\"margin-bottom: 0;\">\n        <md-select [(ngModel)]=\"cs.value\"\n                name=\"select\"\n                (change)=\"cs.updateValue()\">\n            <md-option [value]=\"obj.value\" *ngFor=\"let obj of cs.selectOptionsArray(); trackBy: cs.trackByValue\">\n                {{obj.name}}\n            </md-option>\n        </md-select>\n    </form>\n</div>    \n    "
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService])
], SelectControl);
exports.SelectControl = SelectControl;
//# sourceMappingURL=select.control.js.map