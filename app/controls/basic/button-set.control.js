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
var ButtonSetControl = (function () {
    function ButtonSetControl(cs) {
        this.cs = cs;
    }
    ButtonSetControl.prototype.ngOnInit = function () { };
    ButtonSetControl.prototype.setValue = function (values) {
        for (var idx in this.cs.value) {
            this.cs.value[idx] = true;
        }
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var v = values_1[_i];
            this.cs.value[v] = false;
        }
        this.cs.updateValue();
    };
    return ButtonSetControl;
}());
ButtonSetControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-button-set',
        template: "\n<div class=\"devctrl-ctrl devctrl-ctrl-flex-layout\">\n    <label class=\"text-menu devctrl-ctrl-label\">{{cs.name}}</label>\n    <md-button-toggle-group multiple (change)=\"setValue($event)\">\n        <md-button-toggle [value]=\"0\" [checked]=\"!cs.value[0]\">1</md-button-toggle>\n        <md-button-toggle [value]=\"1\" [checked]=\"!cs.value[1]\">2</md-button-toggle>\n        <md-button-toggle [value]=\"2\" [checked]=\"!cs.value[2]\">3</md-button-toggle>\n        <md-button-toggle [value]=\"3\" [checked]=\"!cs.value[3]\">4</md-button-toggle>\n    </md-button-toggle-group>\n</div>    \n    "
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService])
], ButtonSetControl);
exports.ButtonSetControl = ButtonSetControl;
//# sourceMappingURL=button-set.control.js.map