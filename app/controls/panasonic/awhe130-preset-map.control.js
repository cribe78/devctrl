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
var data_service_1 = require("../../data.service");
var AWHE130PresetMapControl = (function () {
    function AWHE130PresetMapControl(cs, ds) {
        this.cs = cs;
        this.ds = ds;
    }
    AWHE130PresetMapControl.prototype.ngOnInit = function () { };
    Object.defineProperty(AWHE130PresetMapControl.prototype, "imageMap", {
        get: function () {
            return this.cs.config("imageMap");
        },
        enumerable: true,
        configurable: true
    });
    AWHE130PresetMapControl.prototype.presetSelected = function (value) {
        this.cs.setValue(value);
    };
    AWHE130PresetMapControl.prototype.imageMapClasses = function () {
        var map = {};
        map[this.imageMap] = true;
        return map;
    };
    return AWHE130PresetMapControl;
}());
AWHE130PresetMapControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-awhe130-preset-map',
        template: "\n<div class=\"devctrl-ctrl\">\n    <label class=\"text-menu devctrl-ctrl-label\">{{cs.name}}</label>\n    <svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" [ngClass]=\"imageMapClasses()\">\n        <defs>\n            <style>\n                .cls-1 {\n                    fill:#9FA8DA;\n                    cursor: pointer; \n                }\n                .cls-1:hover {\n                    fill:#EC407A;\n                }\n                .cls-1.selected {\n                    fill: #F06292;\n                }\n                .cls-1,.cls-4{\n                    stroke: rgba(0,0,0,.5);\n                }\n                .cls-1,.cls-4,.cls-5{stroke-miterlimit:10;}\n                .cls-2{\n                    font-size:32px;\n                    pointer-events: none;   \n                }\n                .cls-2,.cls-3,.cls-6{\n                    fill:#000000;\n                    font-weight:500;\n                }\n                .cls-3{font-size:24px;}\n                .cls-4{fill:none;stroke-width:3px;}\n                .cls-6{\n                    font-size:28px;\n                }\n                .no-click {\n                    pointer-events: none;\n                }\n                .podium {\n                    fill: #E0E0E0;\n                }\n            </style>\n        </defs>\n        <svg:g [ngSwitch]=\"imageMap\">\n            <svg:g *ngSwitchCase=\"'pict-l'\" preset-map-pict-l (presetSelected)=\"presetSelected($event)\" />\n            <svg:g *ngSwitchCase=\"'pict-r'\" preset-map-pict-r (presetSelected)=\"presetSelected($event)\" />\n            <svg:g *ngSwitchCase=\"'orc-students'\" preset-map-orc-students (presetSelected)=\"presetSelected($event)\" />\n            <svg:g *ngSwitchCase=\"'orc-instructor'\" preset-map-orc-instructor (presetSelected)=\"presetSelected($event)\" />\n            <svg:g *ngSwitchDefault preset-map-default (presetSelected)=\"presetSelected($event)\" />\n        </svg:g>\n    </svg>\n</div>\n    ",
        //language=CSS
        styles: ["\n        .devctrl-ctrl {\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n        }\n        .devctrl-ctrl-label {\n            align-self: flex-start;\n        }\n\n        svg {\n            width: 100%;\n            height: 594px;\n        }\n        \n        svg.orc-instructor {\n            height: 200px;\n            width: 640px;\n        }\n        \n        svg.orc-students {\n            height: 330px;\n            width: 580px;\n        }\n"]
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService,
        data_service_1.DataService])
], AWHE130PresetMapControl);
exports.AWHE130PresetMapControl = AWHE130PresetMapControl;
//# sourceMappingURL=awhe130-preset-map.control.js.map