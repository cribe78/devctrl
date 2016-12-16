"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Control_1 = require("../../shared/Control");
var PanelControl_1 = require("../../shared/PanelControl");
var core_1 = require("@angular/core");
var static_1 = require("@angular/upgrade/static");
var PanelController = (function () {
    function PanelController(menuService, dataService, recordService) {
        this.menuService = menuService;
        this.dataService = dataService;
        this.recordService = recordService;
    }
    PanelController.prototype.addControl = function ($event) {
        this.recordService.editRecord($event, "0", PanelControl_1.PanelControl.tableStr, { panel_id: this.panelObj._id });
    };
    ;
    PanelController.prototype.editPanel = function ($event) {
        this.recordService.editRecord($event, this.panelObj._id, this.panelObj.table);
    };
    ;
    PanelController.prototype.setAllSwitches = function (val) {
        var pcList = this.panelObj.referenced[PanelControl_1.PanelControl.tableStr];
        for (var pcId in pcList) {
            var control = pcList[pcId].control;
            if (control.usertype == Control_1.Control.USERTYPE_SWITCH) {
                control.value = val;
                this.dataService.updateControlValue(control);
            }
        }
    };
    ;
    return PanelController;
}());
PanelController.$inject = ['MenuService', 'DataService', 'RecordEditorService'];
exports.PanelComponent = {
    controller: PanelController,
    bindings: {
        panelObj: '<'
    },
    template: "\n<ng-include src=\"'app/ng1/panels/' + $ctrl.panelObj.type + '.html'\"></ng-include>\n"
};
var PanelComponentNg2 = (function (_super) {
    __extends(PanelComponentNg2, _super);
    function PanelComponentNg2(elementRef, injector) {
        return _super.call(this, 'devctrlPanel', elementRef, injector) || this;
    }
    return PanelComponentNg2;
}(static_1.UpgradeComponent));
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], PanelComponentNg2.prototype, "panelObj", void 0);
PanelComponentNg2 = __decorate([
    core_1.Directive({
        selector: 'devctrl-panel'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
], PanelComponentNg2);
exports.PanelComponentNg2 = PanelComponentNg2;
//# sourceMappingURL=panel.component.js.map