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
var ImageControl = (function () {
    function ImageControl(cs) {
        this.cs = cs;
        this.loadingError = false;
    }
    ImageControl.prototype.ngOnInit = function () { };
    ImageControl.prototype.imgError = function ($event) {
        this.loadingError = true;
    };
    ImageControl.prototype.source = function () {
        if (this.loadingError) {
            return "/images/loading-error.svg";
        }
        if (this.cs.config("url")) {
            return this.cs.config("url");
        }
        var path = this.cs.config("path");
        var proto = this.cs.config("proto");
        proto = proto ? proto : "https://";
        if (proto == "http" || proto == "https") {
            proto = proto + "://";
        }
        var host = this.cs.config("host");
        host = host ? host : this.cs.control.endpoint.address;
        return proto + host + path;
    };
    return ImageControl;
}());
ImageControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-image',
        template: "\n<div class=\"devctrl-ctrl\">\n    <label class=\"text-menu devctrl-ctrl-label\">{{cs.name}}</label>\n    <img [src]=\"source()\" width=\"100%\" (error)=\"imgError($event)\"/>\n</div> \n    ",
        //language=CSS
        styles: ["        \n    "]
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService])
], ImageControl);
exports.ImageControl = ImageControl;
//# sourceMappingURL=image.control.js.map