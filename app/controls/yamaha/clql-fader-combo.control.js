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
var CLQLFaderComboControl = (function () {
    function CLQLFaderComboControl(cs, pipe) {
        this.cs = cs;
        this.pipe = pipe;
    }
    CLQLFaderComboControl.prototype.ngOnInit = function () {
        this.components = this.cs.loadComponentControls();
    };
    CLQLFaderComboControl.prototype.dbVal = function (val) {
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
    return CLQLFaderComboControl;
}());
CLQLFaderComboControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-clql-fader-combo',
        template: "\n<div class=\"devctrl-ctrl\">\n    <label class=\"text-menu devctrl-ctrl-label\">{{cs.name}}</label>\n    <md-checkbox [(ngModel)]=\"components.onOff.value\"\n                  (change)=\"cs.updateComponentValue('onOff')\"></md-checkbox>\n    <md-slider style=\"flex: 3 1;\"\n               min=\"{{cs.intConfig('min', 'fader')}}\"\n               max=\"{{cs.intConfig('max', 'fader')}}\"\n               [(ngModel)]=\"components.fader.value\"\n               (change)=\"cs.updateComponentValue('fader')\">\n    </md-slider>\n    <div>{{dbVal(components.fader.value)}}db</div>\n</div>        \n    ",
        //language=CSS
        styles: ["\n.devctrl-ctrl {\n    display: flex; \n    flex-direction: row; \n    align-items: center;\n}\n\n.devctrl-slider-input {\n    width: 60px;\n}\n"]
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService, common_1.DecimalPipe])
], CLQLFaderComboControl);
exports.CLQLFaderComboControl = CLQLFaderComboControl;
//# sourceMappingURL=clql-fader-combo.control.js.map