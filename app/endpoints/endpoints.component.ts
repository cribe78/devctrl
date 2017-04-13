import {Component, Input, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {IndexedDataSet} from "../../shared/DCDataModel";
import {Endpoint} from "../../shared/Endpoint";
import {DataService} from "../data.service";
import {EndpointType} from "../../shared/EndpointType";
import {MenuService} from "../layout/menu.service";
import {RecordEditorService} from "../data-editor/record-editor.service";

@Component({
    selector: 'devctrl-endpoints',
    template: `
<div id="devctrl-content-canvas">
    <div class="devctrl-card">
        <md-toolbar color="primary">
            <div class="devctrl-toolbar-test">
                <button md-button *devctrlAdminOnly (click)="addEndpoint($event)">Add Endpoint</button>
                <button md-button *devctrlAdminOnly (click)="addEndpointType($event)">Add Endpoint Type</button>
            </div>
        </md-toolbar>
        <md-nav-list>
            <template ngFor let-endpoint [ngForOf]="endpointsList">
                 <a md-list-item 
                    (click)="menu.go(['devices', endpoint._id])">
                    {{endpoint.name}}
                    <span class="devctrl-spacer"></span>
                    <devctrl-endpoint-status [endpointId]="endpoint._id"></devctrl-endpoint-status>
                    <md-icon>chevron_right</md-icon>
                </a>
                <md-divider></md-divider>           
            </template>       
        </md-nav-list>
</div>
`,
    //language=CSS
    styles: [`
        .devctrl-card {
            max-width: 900px;
            flex: 1 1;
        }
    `]
})
export class EndpointsComponent implements OnInit {
    endpoints : IndexedDataSet<Endpoint>;
    endpointsList : Endpoint[];


    constructor(private dataService : DataService,
                public route : ActivatedRoute,
                private menu : MenuService,
                private recordService : RecordEditorService){}

    ngOnInit() {
        this.endpoints = (<IndexedDataSet<Endpoint>>this.dataService.getTable(Endpoint.tableStr));
        this.endpointsList = this.dataService.sortedArray('endpoints', 'name') as Endpoint[];
        this.menu.currentTopLevel = MenuService.TOPLEVEL_DEVICES;
        this.menu.pageTitle = "Devices";
    }

    addEndpoint($event) {
        this.recordService.editRecord($event, '0', Endpoint.tableStr);
    }

    addEndpointType($event) {
        this.recordService.editRecord($event, '0', EndpointType.tableStr);
    }
}