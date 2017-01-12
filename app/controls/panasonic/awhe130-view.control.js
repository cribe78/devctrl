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
var AWHE130ViewControl = (function () {
    function AWHE130ViewControl(cs) {
        this.cs = cs;
    }
    AWHE130ViewControl.prototype.ngOnInit = function () { };
    AWHE130ViewControl.prototype.previewSource = function () {
        return "http://" + this.cs.control.endpoint.address + "/" + this.cs.config('liveViewPath');
    };
    return AWHE130ViewControl;
}());
AWHE130ViewControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-awhe130-view',
        template: "\n<div class=\"devctrl-ctrl\">\n    <label class=\"text-menu devctrl-ctrl-label\">{{cs.control.endpoint.name}} View</label>\n    <img [src]=\"previewSource()\" width=\"640\" height=\"360\" />\n</div>    \n    ",
        styles: ["\n.devctrl-ctrl {\n    height: 490px;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n}\n.devctrl-ctrl-label {\n    align-self: flex-start;\n}\nimg {\n   \n}\n"
        ]
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService])
], AWHE130ViewControl);
exports.AWHE130ViewControl = AWHE130ViewControl;
//# sourceMappingURL=awhe130-view.control.js.map