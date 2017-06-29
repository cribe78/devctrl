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
var common_1 = require("@angular/common");
var control_service_1 = require("../control.service");
var CLQLFaderControl = (function () {
    function CLQLFaderControl(cs, pipe) {
        this.cs = cs;
        this.pipe = pipe;
    }
    CLQLFaderControl.prototype.ngOnInit = function () { };
    CLQLFaderControl.prototype.dbVal = function () {
        var val = this.cs.value;
        if (val >= 423) {
            val = -20 + 0.05 * (val - 423);
        }
        else if (val >= 223) {
            val = -40 + 0.10 * (val - 223);
        }
        else if (val >= 33) {
            val = -78 + 0.20 * (val - 33);
        }
        else if (val >= 15) {
            val = -96 + (val - 15);
        }
        else if (val >= 1) {
            val = -133 + 3 * (val - 1);
        }
        else {
            return "-INF";
        }
        return this.pipe.transform(val, "1.2");
    };
    return CLQLFaderControl;
}());
CLQLFaderControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-clql-fader',
        template: "\n<div class=\"devctrl-ctrl\">\n    <label class=\"text-menu devctrl-ctrl-label\">{{cs.name}}</label>\n    <md-slider style=\"flex: 3 1;\"\n               min=\"{{cs.intConfig('min')}}\"\n               max=\"{{cs.intConfig('max')}}\"\n               [(ngModel)]=\"cs.value\"\n               (change)=\"cs.updateValue()\">\n    </md-slider>\n    <div>{{dbVal()}}db</div>\n</div>    \n    ",
        styles: ["\n.devctrl-ctrl {\n    display: flex; \n    flex-direction: row; \n    align-items: center;\n}\n\n.devctrl-slider-input {\n    width: 60px;\n}\n"]
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService, common_1.DecimalPipe])
], CLQLFaderControl);
exports.CLQLFaderControl = CLQLFaderControl;
//# sourceMappingURL=clql-fader.control.js.map