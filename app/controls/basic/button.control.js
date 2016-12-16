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
var ButtonControl = (function () {
    function ButtonControl(cs) {
        this.cs = cs;
    }
    ButtonControl.prototype.ngOnInit = function () { };
    return ButtonControl;
}());
ButtonControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-button',
        template: "\n<div class=\"devctrl-ctrl\"\n     flex\n     layout=\"row\"\n     layout-align=\"space-between center\">\n    <label flex=\"initial\" class=\"text-menu devctrl-ctrl-label\">{{cs.name}}</label>\n    <button md-button (click)=\"cs.setValue('')\">{{cs.name}}</button>\n</div>\n"
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService])
], ButtonControl);
exports.ButtonControl = ButtonControl;
//# sourceMappingURL=button.control.js.map