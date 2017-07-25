import {Component, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Panel} from "../shared/Panel";
import {DataService} from "../data.service";
import {RecordEditorService} from "../data-editor/record-editor.service";
import {PanelControl} from "../shared/PanelControl";
import {IndexedDataSet} from "../shared/DCDataModel";
import {Control} from "../shared/Control";
import {DCSerializable} from "../shared/DCSerializable";

@Component({
    selector: 'devctrl-panel',
    template: `
<h3 md-subheader>
    {{panelObj.name}}
    <button md-button class="md-primary"  
            *ngIf="isSwitchGroup()"
            (click)="setAllSwitches(true)">
        All On
    </button>
    <button md-button class="md-warn" 
            *ngIf="isSwitchGroup()"
            (click)="setAllSwitches(false)">
        All Off
    </button>
    <button md-button *devctrlAdminOnly
            (click)="addControl($event)"
            class="md-primary">
        Add Control
    </button>
    <button md-button *devctrlAdminOnly
            (click)="editPanel($event)"
            class="md-primary md-hue-1">
        Edit Panel
    </button>
</h3>

<section [ngSwitch]="panelObj.type">
    <md-list-item *ngSwitchCase="'horizontal'" class="devctrl-ctrl-list-item">
        <div class="hpanel">
            <devctrl-ctrl *ngFor="let pcontrol of pcList(); trackBy:trackById"
                [panelControl]="pcontrol"></devctrl-ctrl>
        </div>    
    </md-list-item>
    <ng-template ngSwitchDefault>
        <md-list-item *ngFor="let pcontrol of pcList(); trackBy:trackById"
                    class="devctrl-ctrl-list-item">
            <devctrl-ctrl [panelControl]="pcontrol"></devctrl-ctrl>
        </md-list-item>
    </ng-template>
</section>
<md-divider></md-divider>
`,
    styles: [`
.hpanel {
    display: flex;
    flex-direction: row;
    width: 100%;
}

.hpanel devctrl-ctrl {
    flex: 1 1;
}
`]

})
export class PanelComponent
{
    @Input()panelObj : Panel;

    constructor(private dataService : DataService,
                private recordService : RecordEditorService) {}

    addControl($event) {
        this.recordService.editRecord(
            $event, "0", PanelControl.tableStr,
            { panel: this.panelObj}
        );
    };

    editPanel($event) {
        this.recordService.editRecord($event, this.panelObj._id, this.panelObj.table);
    };

    isSwitchGroup() {
        return this.panelObj.type == 'switch-group';
    }

    pcList() {
        let pcArray = Object.keys(this.panelObj.referenced[PanelControl.tableStr])
            .map(id => {
                return this.panelObj.referenced[PanelControl.tableStr][id] as PanelControl;
            });

        pcArray.sort((a, b) => {
            if (typeof b.idx == 'undefined') {
                return -1;
            }
            if (typeof a.idx == 'undefined') {
                return 1;
            }

            return a.idx - b.idx;
        })

        return pcArray;
    }

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

    trackById = DCSerializable.trackById;
}