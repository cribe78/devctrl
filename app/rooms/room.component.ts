import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {IndexedDataSet} from "shared/DCDataModel";
import {Room} from "shared/Room";
import {DataService} from "../data.service";
import {Panel} from "shared/Panel";
import {MenuService} from "../menu.service";
import {Endpoint} from "shared/Endpoint";
import {PanelControl} from "shared/PanelControl";
import 'rxjs/add/operator/switchMap';
import {RecordEditorService} from "data-editor/record-editor.service";

@Component({
    selector: 'devctrl-room',
    template: `
<md-tab-group [selectedIndex]="selectedGroup" md-dynamic-height>
    <md-tab *ngFor="let groupName of getGroups()"
            label="{{groupName}}" 
            (selectChange)="groupSelected(groupName)">
        <md-list flex>
                <devctrl-panel *ngFor="let rpanel of groupPanels(groupName)"
                               [panelObj]="rpanel">
                </devctrl-panel>
        </md-list>

    </md-tab>
    <md-tab label="Devices" (selectChange)="groupSelected('Devices')">
        <md-list>
            <template ngFor let-endpoint [ngForOf]="getRoomEndpoints()" [ngForTrackBy]="trackById">

                <a md-list-item
                          (click)="menu.go(['devices', endpoint._id])"
                          flex
                          layout="row">
                    <span>{{endpoint.name}}</span>
                    <span flex></span>
                    <devctrl-endpoint-status [endpointId]="endpoint._id"></devctrl-endpoint-status>
                    <md-icon md-font-set="material-icons">keyboard_arrow_right</md-icon>
                </a>
                <md-divider></md-divider>
            </template>
        </md-list>
    </md-tab>
</md-tab-group>
<div flex layout="row" devctrl-admin-only>
    <span flex></span>
    <button md-button
            (click)="addPanel($event)"
            class="md-primary">
        Add Panel
    </button>
</div>
    
`
})
export class RoomComponent implements OnInit {

    rooms : IndexedDataSet<Room>;
    obj: Room;
    panels : IndexedDataSet<Panel>;
    config;
    roomConfig;

    constructor(private route : ActivatedRoute,
                private dataService: DataService,
                private menu : MenuService,
                private recordService : RecordEditorService) {
    }

    ngOnInit() {
        this.rooms = (<IndexedDataSet<Room>>this.dataService.getTable(Room.tableStr));
        this.config = this.dataService.config;

        if (! this.config.rooms) {
            this.config.rooms = {};
        }

        this.route.data.subscribe((data: { room: Room}) => {
            this.obj = data.room;

            this.menu.pageTitle = this.obj.name;
            this.menu.toolbarSelectTable("rooms", ['rooms'], this.obj._id);
            this.panels = <IndexedDataSet<Panel>>this.obj.referenced[Panel.tableStr];

            if (! this.config.rooms[this.obj._id]) {
                this.config.rooms[this.obj._id] = { groups : {}};
            }

            this.roomConfig = this.config.rooms[this.obj._id];
        });
    }


    get selectedGroup() {
        if (typeof this.roomConfig['selectedGroup'] == 'undefined') {
            this.roomConfig['selectedGroup'] = 0;
            this.dataService.updateConfig();
        }
        return this.roomConfig['selectedGroup'];
    }

    set selectedGroup(value) {
        this.roomConfig['selectedGroup'] = value;
        this.dataService.updateConfig();
    }

    addPanel($event) {
        this.recordService.editRecord($event, '0', 'panels',
            {
                'room_id' : this.obj._id
            }
        );
    }


    getGroups() {
        let deleteGroups = {};
        let groupList = [];

        for (let groupName in this.roomConfig.groups) {
            deleteGroups[groupName] = true;
        }

        for (let panelId in this.panels) {
            let panel = this.panels[panelId];
            if (! this.roomConfig.groups[panel.grouping]) {
                this.roomConfig.groups[panel.grouping] = { opened: false }
                groupList.push(panel.grouping);
            }
            deleteGroups[panel.grouping] = false;
        }

        for (let grouping in deleteGroups) {
            if (deleteGroups[grouping]) {
                delete this.roomConfig.groups[grouping];
            }
        }

        return Object.keys(this.roomConfig.groups);
    }

    getRoomEndpoints(grouping) : Endpoint[] {
        let roomEndpoints : IndexedDataSet<Endpoint> = {};
        let roomEndpointList = [];
        let ignoreGrouping = ! grouping;

        for (let panelId in this.panels) {
            let panel = this.panels[panelId];
            if (ignoreGrouping || panel.grouping == grouping) {
                let panelControls = <IndexedDataSet<PanelControl>>panel.referenced[PanelControl.tableStr];

                for (let panelControlId in panelControls) {
                    let endpoint = panelControls[panelControlId].endpoint;
                    if (endpoint && ! roomEndpoints[endpoint._id]) {
                        roomEndpoints[endpoint._id] = endpoint;
                        roomEndpointList.push(endpoint);
                    }
                }
            }
        }

        return roomEndpointList;
    }

    groupPanels(groupName) {
        let panels = [];
        for (let id in this.panels) {
            if (this.panels[id].grouping == groupName) {
                panels.push(this.panels[id]);
            }
        }

        panels.sort((a, b) => {
            return a.panel_index - b.panel_index;
        });

        return panels;
    }

    getRoomByName(roomName) {
        for (let id in this.rooms) {

            if (this.rooms[id].name.toLowerCase() == roomName.toLowerCase()) {
                return this.rooms[id];
            }
        }

        console.log(`Room ${roomName} not found`);
    }

    groupSelected($event) {
        console.log(`tab ??? selected`);
    }



    panelControls(panel: Panel) {
        if (panel.referenced[PanelControl.tableStr]) {
            return panel.referenced[PanelControl.tableStr];
        }
    }

    toggleGroup(group) {
        group.opened = ! group.opened;
        this.dataService.updateConfig();
    }

    trackById(index: number, endpoint) {
        return endpoint._id;
    }
}