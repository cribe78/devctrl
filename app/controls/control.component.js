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
var menu_service_1 = require("../layout/menu.service");
var PanelControl_1 = require("../../shared/PanelControl");
var control_service_1 = require("./control.service");
var ControlComponent = (function () {
    function ControlComponent(cs, menu) {
        this.cs = cs;
        this.menu = menu;
    }
    ControlComponent.prototype.ngOnInit = function () {
        if (this.panelControl) {
            this.cs.panelControl = this.panelControl;
        }
        else if (this.control) {
            this.cs.control = this.control;
        }
        else {
            this.cs.controlId = this.controlId;
        }
    };
    return ControlComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", PanelControl_1.PanelControl)
], ControlComponent.prototype, "panelControl", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ControlComponent.prototype, "controlId", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ControlComponent.prototype, "control", void 0);
ControlComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'devctrl-ctrl',
        providers: [control_service_1.ControlService],
        templateUrl: 'control.html',
        //language=CSS
        styles: ["        \n        .control-wrapper {\n            flex: 1 1;\n        }\n.devctrl-ctrl-item {\n    min-height: 48px;\n    width: 100%;\n    display: flex;\n    flex-direction: row;\n}\n\n.devctrl-ctrl-admin-placeholder {\n    width: 48px;\n}\n\n:host {\n    width: 100%;\n}\n\n:host /deep/ .devctrl-ctrl-flex-layout {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: space-between;\n }\n \n:host /deep/ .devctrl-ctrl-label {\n    min-height: 32px;\n    margin-right: 12px;\n    width: 180px;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    overflow: hidden;\n}\n\n:host /deep/ .devctrl-ctrl {\n    min-height: 48px;\n}\n\n"]
    }),
    __metadata("design:paramtypes", [control_service_1.ControlService,
        menu_service_1.MenuService])
], ControlComponent);
exports.ControlComponent = ControlComponent;
//# sourceMappingURL=control.component.js.map