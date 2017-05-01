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
var HyperlinkControl = (function () {
    function HyperlinkControl(cs) {
        this.cs = cs;
    }
    HyperlinkControl.prototype.ngOnInit = function () { };
    HyperlinkControl.prototype.linkText = function () {
        var text = this.cs.config("linkText");
        if (text) {
            return text;
        }
        return this.linkUrl();
    };
    HyperlinkControl.prototype.linkUrl = function () {
        var url = this.cs.config("url");
        if (url) {
            return url;
        }
        var relativeUrl = this.cs.config("relativeUrl");
        var proto = this.cs.config("linkProto");
        proto = proto ? proto : "https";
        var host = this.cs.control.endpoint.address;
        url = proto + "://" + host + relativeUrl;
        return url;
    };
    return HyperlinkControl;
}());
HyperlinkControl = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ctrl-hyperlink',
        template: "\n<div class=\"devctrl-ctrl devctrl-ctrl-flex-layout\">\n    <label class=\"text-menu devctrl-ctrl-label\">{{cs.name}}</label>\n    <a href=\"{{linkUrl()}}\" target=\"_blank\">{{linkText()}}</a>\n</div>      \n    "
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService])
], HyperlinkControl);
exports.HyperlinkControl = HyperlinkControl;
//# sourceMappingURL=hyperlink.control.js.map