"use strict";
const Control_1 = require("../../shared/Control");
const PanelControl_1 = require("../../shared/PanelControl");
class PanelController {
    constructor($mdDialog, menuService, dataService) {
        this.$mdDialog = $mdDialog;
        this.menuService = menuService;
        this.dataService = dataService;
    }
    addControl($event) {
        this.dataService.editRecord($event, "0", PanelControl_1.PanelControl.tableStr, { panel_id: this.panelObj._id });
    }
    ;
    editPanel($event) {
        this.dataService.editRecord($event, this.panelObj._id, this.panelObj.table);
    }
    ;
    setAllSwitches(val) {
        let pcList = this.panelObj.referenced[PanelControl_1.PanelControl.tableStr];
        for (let pcId in pcList) {
            let control = pcList[pcId].control;
            if (control.usertype == Control_1.Control.USERTYPE_SWITCH) {
                control.value = val;
                this.dataService.updateControlValue(control);
            }
        }
    }
    ;
}
PanelController.$inject = ['$mdDialog', 'MenuService', 'DataService'];
exports.PanelComponent = {
    controller: PanelController,
    bindings: {
        panelObj: '<'
    },
    template: `
<ng-include src="'app/ng1/panels/' + $ctrl.panelObj.type + '.html'"></ng-include>
`
};
//# sourceMappingURL=panel.component.js.map