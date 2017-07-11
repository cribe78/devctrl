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
var control_service_1 = require("../control.service");
var SwitchReadonlyControl = (function () {
    function SwitchReadonlyControl(cs) {
        this.cs = cs;
    }
    SwitchReadonlyControl.prototype.ngOnInit = function () { };
    return SwitchReadonlyControl;
}());
SwitchReadonlyControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-switch-readonly',
        template: "\n<div class=\"devctrl-ctrl devctrl-ctrl-flex-layout\">\n    <label class=\"text-menu devctrl-ctrl-label\">{{cs.name}}</label>\n    <button md-mini-fab [disabled]=\"! cs.value\" color=\"accent\"></button>\n    ",
        //language=CSS
        styles: ["\n        button {\n            pointer-events: none;\n        }\n    "]
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService])
], SwitchReadonlyControl);
exports.SwitchReadonlyControl = SwitchReadonlyControl;
//# sourceMappingURL=switch-readonly.control.js.map