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
var SwitchControl = (function () {
    function SwitchControl(cs) {
        this.cs = cs;
    }
    SwitchControl.prototype.ngOnInit = function () { };
    return SwitchControl;
}());
SwitchControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-switch',
        template: "\n<div layout=\"row\"\n     layout-align=\"space-between center\"\n     class=\"devctrl-ctrl\"\n     flex >\n\n        <label class=\"text-menu\">{{cs.name}}</label>\n        <md-slide-toggle [(ngModel)]=\"cs.value\"\n                    (change)=\"cs.updateValue()\"></md-slide-toggle>\n\n</div>    \n    "
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService])
], SwitchControl);
exports.SwitchControl = SwitchControl;
//# sourceMappingURL=switch.control.js.map