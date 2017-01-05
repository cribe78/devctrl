import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {IndexedDataSet} from "../../shared/DCDataModel";
import {Endpoint} from "../../shared/Endpoint";
import {DataService} from "../data.service";
import {MenuService} from "../layout/menu.service";
import {Control} from "../../shared/Control";
import {RecordEditorService} from "../data-editor/record-editor.service";

@Component({
    selector: 'devctrl-endpoint',
    template: `
<div fxLayout="row" fxLayoutAlign="center start" id="devctrl-content-canvas">
    <div fxFlex="none" fxFlex.gt-xs="800px" class="devctrl-card">
        <md-toolbar color="primary">
            <div  fxFill fxLayout="row" class="md-toolbar-tools">
                <button fxFlex="none" fxFlexAlign="start" md-button *devctrlAdminOnly (click)="addControl($event)">Add Control</button>
                <button fxFlex="none" fxFlexAlign="start" md-button *devctrlAdminOnly (click)="editEndpoint($event)">Edit Device</button>
                <button fxFlex="none" fxFlexAlign="start" md-button *devctrlAdminOnly (click)="generateConfig($event)">Generate Config</button>
                <span fxFlex>&nbsp;</span>
                <devctrl-endpoint-status fxFlex="none" [endpointId]="obj._id" backgroundColor="primary"></devctrl-endpoint-status>
            </div>
        </md-toolbar>
        
        <md-list>
            <template ngFor let-controlId [ngForOf]="controlIds()">
                <md-list-item><devctrl-ctrl [controlId]="controlId"></devctrl-ctrl></md-list-item>
                <md-divider></md-divider>
            </template>
        </md-list>
     </div>
 </div>
`
})
export class EndpointComponent implements OnInit {
    endpointId: string;
    obj: Endpoint;
    controls: IndexedDataSet<Control>;


    constructor(private route : ActivatedRoute,
                private dataService: DataService,
                private menu : MenuService,
                private recordService : RecordEditorService) {}

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
                'endpoint_type_id' : this.obj.endpoint_type_id
            }
        );
    }

    editEndpoint($event) {
        this.recordService.editRecord($event, this.endpointId, 'endpoints');
    }

    generateConfig($event) {
        this.dataService.generateEndpointConfig($event, this.endpointId);
    }

    trackById(index: number, val) {
        return val._id;
    }
}