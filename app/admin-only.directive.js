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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
const core_1 = require("@angular/core");
const data_service_1 = require("./data.service");
let AdminOnlyDirective = class AdminOnlyDirective {
    constructor(_template, _viewContainer, dataService) {
        this._template = _template;
        this._viewContainer = _viewContainer;
        this.dataService = dataService;
        this._hasView = false;
        this._inverted = false;
    }
    ngDoCheck() {
        let test = this.dataService.isAdminAuthorized() != this._inverted;
        if (test && !this._hasView) {
            this._hasView = true;
            this._viewContainer.createEmbeddedView(this._template);
        }
        else if (!test && this._hasView) {
            this._hasView = false;
            this._viewContainer.clear();
        }
    }
    set invert(invertVal) {
        this._inverted = !!invertVal;
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], AdminOnlyDirective.prototype, "invert", null);
AdminOnlyDirective = __decorate([
    core_1.Directive({ selector: '[devctrlAdminOnly]' }),
    __param(2, core_1.Inject('DataService')),
    __metadata("design:paramtypes", [core_1.TemplateRef,
        core_1.ViewContainerRef,
        data_service_1.DataService])
], AdminOnlyDirective);
exports.AdminOnlyDirective = AdminOnlyDirective;
//# sourceMappingURL=admin-only.directive.js.map