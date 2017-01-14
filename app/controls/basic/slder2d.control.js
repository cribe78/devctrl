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
    Slider2dControl.prototype.ngOnInit = function () {
    };
    Slider2dControl.prototype.stepX = function () {
        var step = this.cs.intConfig("stepX");
        return step ? step : 1;
    };
    Slider2dControl.prototype.stepY = function () {
        var step = this.cs.intConfig("stepY");
        return step ? step : 1;
    };
    Object.defineProperty(Slider2dControl.prototype, "xVal", {
        get: function () {
            var m = this.cs.floatConfig('xMultiplier', 1);
            return this.cs.value.x / m;
        },
        set: function (val) {
            var m = this.cs.floatConfig('xMultiplier', 1);
            this.cs.value.x = m * val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slider2dControl.prototype, "yVal", {
        get: function () {
            var m = this.cs.floatConfig('yMultiplier', 1);
            return this.cs.value.y / m;
        },
        set: function (val) {
            var m = this.cs.floatConfig('yMultiplier', 1);
            this.cs.value.y = m * val;
        },
        enumerable: true,
        configurable: true
    });
    return Slider2dControl;
}());
Slider2dControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-slider2d',
        template: "\n<div class=\"devctrl-ctrl\">\n    <div>\n        <label class=\"text-menu devctrl-ctrl-label\">{{cs.name}}</label>\n    </div>\n    <div class=\"container\">\n        <label class=\"text-caption devctrl-ctrl-label label-indented\">{{cs.config('xName')}}</label>\n        <md-slider class=\"slider\"\n                   min=\"{{cs.intConfig('xMin')}}\"\n                   max=\"{{cs.intConfig('xMax')}}\"\n                   [step]=\"stepY\"\n                   [(ngModel)]=\"xVal\"\n                   (change)=\"cs.updateValue()\">\n        </md-slider>\n        <md-input-container>\n            <input md-input \n                   class=\"devctrl-slider-input\" type=\"number\"\n                   [(ngModel)]=\"xVal\"\n                   (change)=\"cs.updateValue()\">\n        </md-input-container>\n    \n    </div>\n    <div class=\"container\">\n        <label class=\"text-caption devctrl-ctrl-label label-indented\">{{cs.config('yName')}}</label>\n        <md-slider class=\"slider\"\n                   min=\"{{cs.intConfig('yMin')}}\"\n                   max=\"{{cs.intConfig('yMax')}}\"\n                   [step]=\"stepY\"\n                   [(ngModel)]=\"yVal\"\n                   (change)=\"cs.updateValue()\">\n        </md-slider>\n        <md-input-container>\n            <input md-input \n                   class=\"devctrl-slider-input\" type=\"number\"\n                   [(ngModel)]=\"yVal\"\n                   (change)=\"cs.updateValue()\">\n        </md-input-container>\n    </div>    \n</div>\n    ",
        styles: ["\n.label-indented {\n    margin-left: 24px;\n}\ndiv.container {\n    display: flex;\n    flex-direction: row;\n}\n\ndiv.devctrl-ctrl {\n    display: flex;\n    flex-direction: column;\n}\n\n.devctrl-slider-input {\n    width: 60px;\n}\n.slider {\n    flex: 1 1;\n}\n\n"]
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService])
], Slider2dControl);
exports.Slider2dControl = Slider2dControl;
//# sourceMappingURL=slder2d.control.js.map