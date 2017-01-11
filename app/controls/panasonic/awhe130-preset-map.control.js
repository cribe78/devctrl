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
        this.ds.logAction("Preset " + value + " clicked", ['preset_select'], [this.cs.controlId]);
    };
    return AWHE130PresetMapControl;
}());
AWHE130PresetMapControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-awhe130-preset-map',
        template: "\n<div class=\"devctrl-ctrl\">\n    <label class=\"text-menu devctrl-ctrl-label\">{{cs.name}}</label>\n    <svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 350 440\">\n        <defs>\n            <style>\n                .cls-1,.cls-5{fill:#7997ce;}\n                .cls-1,.cls-4{stroke:#231f20;}\n                .cls-1,.cls-4,.cls-5{stroke-miterlimit:10;}\n                .cls-2{\n                    font-size:40px;\n                    pointer-events: none;   \n                }\n                .cls-2,.cls-3,.cls-6{fill:#2b2b2b;font-family:MyriadPro-BoldCond, Myriad Pro;font-weight:700;}\n                .cls-3{font-size:38.76px;}.cls-4{fill:none;stroke-width:3px;}\n                .cls-5{stroke:#000;}\n                .cls-6{font-size:30.6px;}\n                .cls-7{letter-spacing:-0.01em;}\n                .cls-8{letter-spacing:0em;}\n            </style>\n        </defs>\n        <svg:g [ngSwitch]=\"imageMap\">\n            <svg:g *ngSwitchCase=\"'pict-l'\" preset-map-pict-l (presetSelected)=\"presetSelected($event)\" />\n            <svg:g *ngSwitchCase=\"'pict-r'\" preset-map-pict-r (presetSelected)=\"presepict-tSelected($event)\" />\n            <svg:g *ngSwitchDefault>\n                <text x=\"10\" y=\"50\" font-size=\"32\">Unimplemented default image map</text>\n            </svg:g>\n        </svg:g>\n    </svg>\n</div>\n    ",
        styles: ["\n.devctrl-ctrl {\n    height: 490px;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n}\n.devctrl-ctrl-label {\n    align-self: flex-start;\n}\n\n"]
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService,
        data_service_1.DataService])
], AWHE130PresetMapControl);
exports.AWHE130PresetMapControl = AWHE130PresetMapControl;
//# sourceMappingURL=awhe130-preset-map.control.js.map