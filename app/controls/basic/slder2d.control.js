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
var Slider2dControl = (function () {
    function Slider2dControl(cs) {
        this.cs = cs;
    }
    Slider2dControl.prototype.ngOnInit = function () { };
    Object.defineProperty(Slider2dControl.prototype, "xValue", {
        get: function () {
            return this._xValue;
        },
        set: function (val) {
            if (typeof this._xValue == 'undefined' || typeof this._yValue == 'undefined') {
                this.setXYVals();
            }
            this._xValue = val;
            this.cs.value = this._xValue + "," + this._yValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slider2dControl.prototype, "yValue", {
        get: function () {
            return this._yValue;
        },
        set: function (val) {
            if (typeof this._xValue == 'undefined' || typeof this._yValue == 'undefined') {
                this.setXYVals();
            }
            this._yValue = val;
            this.cs.value = this._xValue + "," + this._yValue;
        },
        enumerable: true,
        configurable: true
    });
    Slider2dControl.prototype.setXYVals = function () {
        var xyVals = this.cs.value.split(",");
        this._xValue = typeof xyVals[0] != 'undefined' ? xyVals[0] : 0;
        this._xValue = parseInt(this._xValue);
        this._yValue = typeof xyVals[1] != 'undefined' ? xyVals[1] : 0;
        this._yValue = parseInt(this._yValue);
    };
    return Slider2dControl;
}());
Slider2dControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-slider2d',
        template: "\n<div>\n    <label class=\"text-menu devctrl-ctrl-label\">{{cs.name}}</label>\n</div>\n<div class=\"coe-ctrl layout-row laout-align-space-between-center\">\n    <label class=\"text-caption devctrl-ctrl-label devctrl-label-indented\">{{cs.config('xName')}}</label>\n    <md-slider flex\n               min=\"{{cs.intConfig('xMin')}}\"\n               max=\"{{cs.intConfig('xMax')}}\"\n               [(ngModel)]=\"xValue\"\n               (change)=\"cs.updateValue()\">\n    </md-slider>\n    <input class=\"devctrl-slider-input\" type=\"number\"\n           [(ngModel)]=\"slider2d.xValue\"\n           (change)=\"cs.updateValue()\">\n\n</div>\n<div class=\"coe-ctrl\"\n     layout=\"row\"\n     layout-align=\"space-between center\" >\n    <label class=\"text-caption devctrl-ctrl-label devctrl-label-indented\">{{cs.config('yName')}}</label>\n    <md-slider flex\n               min=\"{{cs.intConfig('yMin')}}\"\n               max=\"{{cs.intConfig('yMax')}}\"\n               [(ngModel)]=\"yValue\"\n               (change)=\"cs.updateValue()\">\n    </md-slider>\n    <input class=\"devctrl-slider-input\" type=\"number\"\n           [(ngModel)]=\"slider2d.yValue\"\n           (change)=\"cs.updateValue()\">\n</div>    \n    "
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService])
], Slider2dControl);
exports.Slider2dControl = Slider2dControl;
//# sourceMappingURL=slder2d.control.js.map