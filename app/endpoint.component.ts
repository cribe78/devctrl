import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {IndexedDataSet} from "../shared/DCDataModel";
import {Endpoint} from "../shared/Endpoint";
import {DataService} from "./data.service";
import {MenuService} from "./menu.service";
import {Control} from "../shared/Control";
import {RecordEditorService} from "./record-editor.service";

@Component({
    selector: 'devctrl-endpoint',
    template: `
<md-toolbar>
    <div class="md-toolbar-tools">
        <button md-button devctrl-admin-only (click)="addControl($event)">Add Control</button>
        <button md-button devctrl-admin-only (click)="editEndpoint($event)">Edit Device</button>
        <button md-button devctrl-admin-only (click)="generateConfig($event)">Generate Config</button>
        <span flex></span>
        <devctrl-endpoint-status [endpointId]="obj._id"></devctrl-endpoint-status>
    </div>
</md-toolbar>

<md-list>
    <template ngFor let-controlId [ngForOf]="controlIds()">
        <a md-list-item>
            <ctrl flex [controlId]="controlId"></ctrl>
        </a>
        <md-divider></md-divider>
    </template>
</md-list>   
`
})
export class EndpointComponent implements OnInit {
    endpointId: string;
    endpoints: IndexedDataSet<Endpoint>;
    obj: Endpoint;
    controls: IndexedDataSet<Control>;


    constructor(private route : ActivatedRoute,
                private dataService: DataService,
                private menu : MenuService,
                private recordService : RecordEditorService) {}

    ngOnInit() {
        this.endpoints = <IndexedDataSet<Endpoint>>this.dataService.getTable(Endpoint.tableStr);
        this.route.params.subscribe((params) => {
            this.endpointId = params['id'];
            console.log(`endpoint ${this.endpointId} loaded`);
            this.obj = this.endpoints[this.endpointId];
            if (this.obj) {
                this.menu.pageTitle = this.obj.name;
                this.controls = <IndexedDataSet<Control>>this.obj.referenced[Control.tableStr];
                this.menu.toolbarSelectTable(Endpoint.tableStr, "endpoints.endpoint", this.obj._id);
            }
        });
    }

    controlIds() {
        return Object.keys(this.controls);
        //Object.keys(this.controls).map(key => this.controls[key]);
    }

    togglePanel(panel) {
        if (! angular.isDefined(panel.opened)) {
            panel.opened = true;
        }
        else {
            panel.opened = ! panel.opened;
        }
    }

    isPanelOpen(panel) {
        return angular.isDefined(panel.opened) && panel.opened;
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