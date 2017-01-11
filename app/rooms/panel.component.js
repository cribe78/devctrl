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
var Panel_1 = require("shared/Panel");
var data_service_1 = require("../data.service");
var record_editor_service_1 = require("data-editor/record-editor.service");
var PanelControl_1 = require("shared/PanelControl");
var Control_1 = require("shared/Control");
var DCSerializable_1 = require("shared/DCSerializable");
var PanelComponent = (function () {
    function PanelComponent(dataService, recordService) {
        this.dataService = dataService;
        this.recordService = recordService;
        this.trackById = DCSerializable_1.DCSerializable.trackById;
    }
    PanelComponent.prototype.addControl = function ($event) {
        this.recordService.editRecord($event, "0", PanelControl_1.PanelControl.tableStr, { panel: this.panelObj });
    };
    ;
    PanelComponent.prototype.editPanel = function ($event) {
        this.recordService.editRecord($event, this.panelObj._id, this.panelObj.table);
    };
    ;
    PanelComponent.prototype.isSwitchGroup = function () {
        return this.panelObj.type == 'switch-group';
    };
    PanelComponent.prototype.pcList = function () {
        var _this = this;
        var pcArray = Object.keys(this.panelObj.referenced[PanelControl_1.PanelControl.tableStr])
            .map(function (id) {
            return _this.panelObj.referenced[PanelControl_1.PanelControl.tableStr][id];
        });
        pcArray.sort(function (a, b) {
            if (typeof b.idx == 'undefined') {
                return -1;
            }
            if (typeof a.idx == 'undefined') {
                return 1;
            }
            return a.idx - b.idx;
        });
        return pcArray;
    };
    PanelComponent.prototype.setAllSwitches = function (val) {
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
    return PanelComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Panel_1.Panel)
], PanelComponent.prototype, "panelObj", void 0);
PanelComponent = __decorate([
    core_1.Component({
        selector: 'devctrl-panel',
        template: "\n<h3 md-subheader>\n    {{panelObj.name}}\n    <button md-button class=\"md-primary\"  \n            *ngIf=\"isSwitchGroup()\"\n            (click)=\"setAllSwitches(true)\">\n        All On\n    </button>\n    <button md-button class=\"md-warn\" \n            *ngIf=\"isSwitchGroup()\"\n            (click)=\"setAllSwitches(false)\">\n        All Off\n    </button>\n    <button md-button *devctrlAdminOnly\n            (click)=\"addControl($event)\"\n            class=\"md-primary\">\n        Add Control\n    </button>\n    <button md-button *devctrlAdminOnly\n            (click)=\"editPanel($event)\"\n            class=\"md-primary md-hue-1\">\n        Edit Panel\n    </button>\n</h3>\n\n<section [ngSwitch]=\"panelObj.type\">\n    <md-list-item *ngSwitchCase=\"'horizontal'\" class=\"devctrl-ctrl-list-item\">\n        <div class=\"hpanel\">\n            <devctrl-ctrl *ngFor=\"let pcontrol of pcList(); trackBy:trackById\"\n                [panelControl]=\"pcontrol\"></devctrl-ctrl>\n        </div>    \n    </md-list-item>\n    <template ngSwitchDefault>\n        <md-list-item *ngFor=\"let pcontrol of pcList(); trackBy:trackById\"\n                    class=\"devctrl-ctrl-list-item\">\n            <devctrl-ctrl [panelControl]=\"pcontrol\"></devctrl-ctrl>\n        </md-list-item>\n    </template>\n</section>\n<md-divider></md-divider>\n",
        styles: ["\n.hpanel {\n    display: flex;\n    flex-direction: row;\n    width: 100%;\n}\n\n.hpanel devctrl-ctrl {\n    flex: 1 1;\n}\n"]
    }),
    __metadata("design:paramtypes", [data_service_1.DataService,
        record_editor_service_1.RecordEditorService])
], PanelComponent);
exports.PanelComponent = PanelComponent;
//# sourceMappingURL=panel.component.js.map