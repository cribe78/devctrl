import {DataService} from "../data.service";
import {MenuService} from "../menu.service";
import {Control} from "../../shared/Control";
import {PanelControl} from "../../shared/PanelControl";
import {Panel} from "../../shared/Panel";
import {IndexedDataSet} from "../../shared/DCDataModel";
class PanelController {
    panelObj : Panel;

    static $inject = ['$mdDialog', 'MenuService', 'DataService'];
    constructor(private $mdDialog, private menuService : MenuService, private dataService : DataService) {}

    addControl($event) {
        this.dataService.editRecord(
            $event, "0", PanelControl.tableStr,
            { panel_id: this.panelObj._id}
        );
    };

    editPanel($event) {
        this.dataService.editRecord($event, this.panelObj._id, this.panelObj.table);
    };

    setAllSwitches(val) {
        let pcList = <IndexedDataSet<PanelControl>>this.panelObj.referenced[PanelControl.tableStr];
        for (let pcId in pcList) {
            let control = pcList[pcId].control;

            if (control.usertype == Control.USERTYPE_SWITCH) {
                control.value = val;
                this.dataService.updateControlValue(control);
            }
        }
    };
}

export let PanelComponent : angular.IComponentOptions = {
    controller: PanelController,
    bindings : {
        panelObj : '<'
    },
    template: `
<ng-include src="'app/ng1/panels/' + $ctrl.panelObj.type + '.html'"></ng-include>
`
};