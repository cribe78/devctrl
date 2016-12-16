import {Component, Input, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {IndexedDataSet} from "../shared/DCDataModel";
import {Endpoint} from "../shared/Endpoint";
import {DataService} from "./data.service";
import {EndpointType} from "../shared/EndpointType";
import {MenuService} from "./menu.service";
import {RecordEditorService} from "./record-editor.service";

@Component({
    selector: 'devctrl-endpoints',
    template: `
<div layout="column" *ngIf="menu.routeUrl[0] !== 'devices'">
            <md-toolbar layout="row" devctrl-admin-only >
                <div class="md-toolbar-tools">
                    <button md-button (click)="addEndpoint($event)">Add Endpoint</button>
                    <button md-button (click)="addEndpointType($event)">Add Endpoint Type</button>
                </div>
            </md-toolbar>
            <md-list>
                <md-list-item 
                    *ngFor="let endpoint of endpointsList"
                    (click)="menu.go(['devices', endpoint._id])">
                    {{endpoint.name}}
                    <span flex></span>
                    <devctrl-endpoint-status [endpointId]="endpoint._id"></devctrl-endpoint-status>
                    <md-icon md-font-set="material-icons" >chevron_right</md-icon>
                </md-list-item>
                <md-divider ng-repeat-end></md-divider>
            </md-list>
</div>
`
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
        this.menu.pageTitle = "Devices";
    }

    addEndpoint($event) {
        this.recordService.editRecord($event, '0', Endpoint.tableStr);
    }

    addEndpointType($event) {
        this.recordService.editRecord($event, '0', EndpointType.tableStr);
    }
}