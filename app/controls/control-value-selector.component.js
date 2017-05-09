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
var Control_1 = require("../../shared/Control");
var ControlValueSelectorComponent = (function () {
    function ControlValueSelectorComponent() {
        this.controlValueChange = new core_1.EventEmitter();
    }
    ControlValueSelectorComponent.prototype.ngOnInit = function () { };
    ControlValueSelectorComponent.prototype.trackByValue = function (idx, obj) {
        return obj.value;
    };
    ControlValueSelectorComponent.prototype.valueChange = function (value) {
        this.controlValueChange.emit(value);
    };
    return ControlValueSelectorComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Control_1.Control)
], ControlValueSelectorComponent.prototype, "control", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ControlValueSelectorComponent.prototype, "controlValue", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ControlValueSelectorComponent.prototype, "placeholder", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ControlValueSelectorComponent.prototype, "controlValueChange", void 0);
ControlValueSelectorComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'devctrl-control-value-selector',
        template: "\n<div class=\"value-selector-switch\" [ngSwitch]=\"control.usertype\">\n        <md-select *ngSwitchCase=\"'select'\"\n                [ngModel]=\"controlValue\"\n                name=\"select\"\n                [placeholder]=\"placeholder\"\n                (change)=\"valueChange($event.value)\">\n            <md-option [value]=\"obj.value\" *ngFor=\"let obj of control.selectOptionsArray(); trackBy: trackByValue\">\n                {{obj.name}}\n            </md-option>    \n        </md-select>\n        <md-slide-toggle *ngSwitchCase=\"'switch'\"\n            [ngModel]=\"controlValue\"\n            (change)=\"valueChange($event)\"></md-slide-toggle>\n        <md-input-container *ngSwitchDefault>\n            <input mdInput name=\"value\"  \n                    [placeholder]=\"placeholder\"\n                    [ngModel]=\"controlValue\"\n                    (change)=\"valueChange($event)\">\n        </md-input-container>\n</div>\n    ",
        //language=CSS
        styles: ["        \n        md-select {\n            width: 100%;\n        }\n        \n        .value-selector-switch {\n            width: 100%;\n        }\n    "]
    }),
    __metadata("design:paramtypes", [])
], ControlValueSelectorComponent);
exports.ControlValueSelectorComponent = ControlValueSelectorComponent;
//# sourceMappingURL=control-value-selector.component.js.map