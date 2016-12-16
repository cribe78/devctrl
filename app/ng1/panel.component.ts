import {DataService} from "../data.service";
import {MenuService} from "../menu.service";
import {Control} from "../../shared/Control";
import {PanelControl} from "../../shared/PanelControl";
import {Panel} from "../../shared/Panel";
import {IndexedDataSet} from "../../shared/DCDataModel";
import { Directive, ElementRef, Injector, Input } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';
import {RecordEditorService} from "../record-editor.service";

class PanelController {
    panelObj : Panel;

    static $inject = ['MenuService', 'DataService', 'RecordEditorService'];
    constructor(private menuService : MenuService,
                private dataService : DataService,
                private recordService : RecordEditorService) {}

    addControl($event) {
        this.recordService.editRecord(
            $event, "0", PanelControl.tableStr,
            { panel_id: this.panelObj._id}
        );
    };

    editPanel($event) {
        this.recordService.editRecord($event, this.panelObj._id, this.panelObj.table);
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

@Directive({
    selector: 'devctrl-panel'
})
export class PanelComponentNg2 extends UpgradeComponent {
    @Input()panelObj;

    constructor(elementRef: ElementRef, injector: Injector) {
        super('devctrlPanel', elementRef, injector);
    }
}