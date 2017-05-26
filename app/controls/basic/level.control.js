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
var LevelControl = (function () {
    function LevelControl(cs) {
        this.cs = cs;
    }
    LevelControl.prototype.ngOnInit = function () {
        // Initialize min and max values
        this.max = this.cs.intConfig('max');
        this.min = this.cs.intConfig('min');
        if (this.min >= this.max) {
            this.max = this.min + 1;
        }
    };
    LevelControl.prototype.normalizedValue = function () {
        // Normalize a numeric value to a scale of 0 - 100
        var rawVal = this.cs.value;
        var limVal = rawVal < this.min ? this.min : rawVal;
        limVal = limVal > this.max ? this.max : limVal;
        var normVal = 100 * (limVal + (0 - this.min)) / (this.max - this.min);
        return normVal;
    };
    return LevelControl;
}());
LevelControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-level',
        template: "\n<div class=\"devctrl-ctrl devctrl-ctrl-flex-layout\">\n    <label class=\"text-menu devctrl-ctrl-label\">{{cs.name}}</label>\n    <span style=\"flex: 1 1; display: flex;\">\n        <span class=\"level-bar\" [style.width.%]=\"normalizedValue()\">&nbsp;</span>\n        <span class=\"level-remaining\" [style.width.%]=\"100 - normalizedValue()\">&nbsp;</span>\n    </span>\n</div>  \n    ",
        styles: ["\n.level-bar {\n    background-color: #3f51b5;\n    height: 16px;\n}\n.level-remaining { \n    background-color: #bdbdbd;\n    height: 16px;  \n}\n"]
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService])
], LevelControl);
exports.LevelControl = LevelControl;
//# sourceMappingURL=level.control.js.map