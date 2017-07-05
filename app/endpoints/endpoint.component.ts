import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {IndexedDataSet} from "../../shared/DCDataModel";
import {Endpoint} from "../../shared/Endpoint";
import {DataService} from "../data.service";
import {MenuService} from "../layout/menu.service";
import {Control} from "../../shared/Control";
import {RecordEditorService} from "../data-editor/record-editor.service";
import {LayoutService} from "../layout/layout.service";

@Component({
    selector: 'devctrl-endpoint',
    template: `
<div id="devctrl-content-canvas">
    <div class="devctrl-card">
        <md-toolbar color="primary">
            <div class="devctrl-toolbar-tools">
                <button md-button *devctrlAdminOnly (click)="addControl($event)">Add Control</button>
                <button md-button *devctrlAdminOnly (click)="editEndpoint($event)">Edit Device</button>
                <button md-button *devctrlAdminOnly (click)="generateConfig($event)">Generate Config</button>
                <span class="devctrl-spacer">&nbsp;</span>
                <form class="search-input">
                    <md-input-container>
                        <input mdInput name="search" placeholder="Search Controls" [(ngModel)]="searchTerm">
                    </md-input-container>
                </form>
                <devctrl-endpoint-status [endpointId]="obj._id" backgroundColor="primary"></devctrl-endpoint-status>
            </div>
        </md-toolbar>
        
        <md-list>
            <ng-template ngFor let-controlId [ngForOf]="filteredControls()">
                <md-list-item class="devctrl-ctrl-list-item"><devctrl-ctrl [controlId]="controlId"></devctrl-ctrl></md-list-item>
                <md-divider></md-divider>
            </ng-template>
        </md-list>
    </div>
    <devctrl-action-history [hidden]="!ls.desktopWide"></devctrl-action-history>
 </div>

`,
    //language=CSS
    styles: [`
        .devctrl-card {
            max-width: 900px;
            flex: 1 1;
        }
        
        .search-input {
            margin-bottom: 0;
        }
    `]
})
export class EndpointComponent implements OnInit {
    endpointId: string;
    obj: Endpoint;
    controls: IndexedDataSet<Control>;
    searchTerm: string;


    constructor(private route : ActivatedRoute,
                private dataService: DataService,
                private menu : MenuService,
                private recordService : RecordEditorService,
                private ls : LayoutService) {}

    ngOnInit() {
        this.controls = {};
        this.route.data.subscribe((data: { endpoint: Endpoint }) => {
            this.menu.currentTopLevel = MenuService.TOPLEVEL_DEVICES;
            this.endpointId = data.endpoint._id;
            console.log(`endpoint ${this.endpointId} loaded`);
            this.obj = data.endpoint;
            if (this.obj) {
                this.menu.pageTitle = this.obj.name;
                this.controls = <IndexedDataSet<Control>>this.obj.referenced[Control.tableStr];
                this.menu.toolbarSelectTable(Endpoint.tableStr, ['devices'], this.obj._id);
            }
        });
    }

    controlIds() {
        return Object.keys(this.controls);
        //Object.keys(this.controls).map(key => this.controls[key]);
    }

    togglePanel(panel) {
        if (typeof panel.opened == 'undefined') {
            panel.opened = true;
        }
        else {
            panel.opened = ! panel.opened;
        }
    }

    isPanelOpen(panel) {
        return !! panel.opened;
    }

    addControl($event) {
        this.recordService.editRecord($event, '0', 'controls',
            {
                endpoint: this.obj,
                ctid: this.endpointId + "-",
                poll: false
            }
        );
    }

    editEndpoint($event) {
        this.recordService.editRecord($event, this.endpointId, 'endpoints');
    }

    filteredControls() {
        if (! this.searchTerm) {
            return this.controlIds();
        }

        let searchTerm = this.searchTerm.toLowerCase();
        let controlIds = this.controlIds();

        return  controlIds.filter(id => {
            return this.controls[id].name.toLowerCase().includes(searchTerm);
        });
    }


    generateConfig($event) {
        this.dataService.generateEndpointConfig($event, this.endpointId);
    }

    trackById(index: number, val) {
        return val._id;
    }
}