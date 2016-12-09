"use strict";
var Control_1 = require("../../shared/Control");
var PanelControl_1 = require("../../shared/PanelControl");
var PanelController = (function () {
    function PanelController($mdDialog, menuService, dataService) {
        this.$mdDialog = $mdDialog;
        this.menuService = menuService;
        this.dataService = dataService;
    }
    PanelController.prototype.addControl = function ($event) {
        this.dataService.editRecord($event, "0", PanelControl_1.PanelControl.tableStr, { panel_id: this.panelObj._id });
    };
    ;
    PanelController.prototype.editPanel = function ($event) {
        this.dataService.editRecord($event, this.panelObj._id, this.panelObj.table);
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
PanelController.$inject = ['$mdDialog', 'MenuService', 'DataService'];
exports.PanelComponent = {
    controller: PanelController,
    bindings: {
        panelObj: '<'
    },
    template: "\n<ng-include src=\"'app/ng1/panels/' + $ctrl.panelObj.type + '.html'\"></ng-include>\n"
};
//# sourceMappingURL=panel.component.js.map