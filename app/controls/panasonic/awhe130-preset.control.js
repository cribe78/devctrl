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
var AWHE130PresetControl = (function () {
    function AWHE130PresetControl(cs) {
        this.cs = cs;
    }
    AWHE130PresetControl.prototype.ngOnInit = function () { };
    AWHE130PresetControl.prototype.previewSource = function () {
        return "http://" + this.cs.control.endpoint.address + "/" + this.cs.config('liveViewPath');
    };
    return AWHE130PresetControl;
}());
AWHE130PresetControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-awhe130-preset',
        template: "\n<div class=\"devctrl-ctrl\">\n    <label class=\"text-menu devctrl-ctrl-label\">{{cs.control.endpoint.name}} Preset Save</label>\n    <img [src]=\"previewSource()\" width=\"640\" height=\"360\" />\n    <div class=\"button-row\">\n        <md-input-container>\n            <input md-input #presetNum type=\"number\" \n                    min=0 max=99 \n                    placeholder=\"Preset Number\">\n        </md-input-container>     \n        <button md-button  (click)=\"cs.setValue(presetNum.value)\">Save</button>\n    </div>\n</div>    \n    ",
        styles: ["\n.button-row {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: space-around;\n}\n.devctrl-ctrl {\n    height: 490px;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n}\n.devctrl-ctrl-label {\n    align-self: flex-start;\n}\nimg {\n   \n}\n"
        ]
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService])
], AWHE130PresetControl);
exports.AWHE130PresetControl = AWHE130PresetControl;
//# sourceMappingURL=awhe130-preset.control.js.map