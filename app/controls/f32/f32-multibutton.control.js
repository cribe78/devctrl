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
var F32MultibuttonControl = (function () {
    function F32MultibuttonControl(cs) {
        this.cs = cs;
    }
    F32MultibuttonControl.prototype.ngOnInit = function () { };
    return F32MultibuttonControl;
}());
F32MultibuttonControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-f32-multibutton',
        //TODO: SVG icons aren't loading
        template: "\n<div class=\"devctrl-ctrl devctrl-ctrl-flex-layout\">\n    <label class=\"text-menu devctrl-ctrl-label\">{{cs.name}}</label>\n    <div *ngIf=\"cs.config('direction') !== 'reverse'\">\n        <button  md-icon-button (click)=\"cs.setValue(1)\">\n            <md-icon>play_arrow</md-icon>\n        </button>\n        <button  md-icon-button (click)=\"cs.setValue(2)\">\n            <md-icon>fast_forward</md-icon>\n        </button>\n        <button md-icon-button (click)=\"cs.setValue(3)\">\n            <md-icon svg-src=\"/images/icon_triple_fast.svg\"></md-icon>\n        </button>\n    </div>\n    <div *ngIf=\"cs.config('direction') == 'reverse'\">\n        <button  md-icon-button (click)=\"cs.setValue(1)\">\n            <md-icon  class=\"rot180\">play_arrow</md-icon>\n        </button>\n        <button  md-icon-button (click)=\"cs.setValue(2)\">\n            <md-icon>fast_rewind</md-icon>\n        </button>\n        <button  md-icon-button (click)=\"cs.setValue(3)\">\n            <md-icon class=\"rot180\" svgSrc=\"/images/icon_triple_fast.svg\"></md-icon>\n        </button>\n    </div>\n</div>    \n    ",
        styles: ["\n.rot180 {\n    transform: rotate(180deg);\n}\n"]
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService])
], F32MultibuttonControl);
exports.F32MultibuttonControl = F32MultibuttonControl;
//# sourceMappingURL=f32-multibutton.control.js.map