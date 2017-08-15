import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {IndexedDataSet} from "../shared/DCDataModel";
import {Room} from "../shared/Room";
import {DataService} from "../data.service";
import {Panel} from "../shared/Panel";
import {MenuService} from "../layout/menu.service";
import {Endpoint} from "../shared/Endpoint";
import {PanelControl} from "../shared/PanelControl";
import 'rxjs/add/operator/switchMap';
import {RecordEditorService} from "../data-editor/record-editor.service";
import {LayoutService} from "../layout/layout.service";
//TODO: remember selected tab

@Component({
    selector: 'devctrl-room',
    template: `
<div id="devctrl-content-canvas">
    <div class="devctrl-card">
        <!-- TODO: initial tab selection is not working -->
        <md-tab-group #tabgroup 
            [selectedIndex]="selectedGroup" 
            (selectChange)="groupSelected(tabgroup.selectedIndex)">
            <md-tab *ngFor="let groupName of getGroups()"
                    label="{{groupName}}" >
                <md-list>
                        <devctrl-panel *ngFor="let rpanel of groupPanels(groupName)"
                                       [panelObj]="rpanel">
                        </devctrl-panel>
                </md-list>
        
            </md-tab>
            <md-tab label="Devices">
                <md-nav-list class="devices">
                    <ng-template ngFor let-endpoint [ngForOf]="getRoomEndpoints()" [ngForTrackBy]="trackById">
                        <a md-list-item
                                  (click)="menu.go(['devices', endpoint._id])">
                            <span md-line>{{endpoint.name}}</span>
                            <span>&nbsp;</span>
                            <devctrl-endpoint-status [endpointId]="endpoint._id"></devctrl-endpoint-status>
                            <md-icon md-font-set="material-icons">keyboard_arrow_right</md-icon>
                        </a>
                        <md-divider></md-divider>
                    </ng-template>
                </md-nav-list>
            </md-tab>
        </md-tab-group>
        <div class="devctrl-card-bottom" *devctrlAdminOnly>
            <button md-button
                    (click)="addPanel($event)"
                    class="md-primary">
                Add Panel
            </button>
        </div>
    </div>
    <devctrl-action-history *ngIf="ls.desktopWide"></devctrl-action-history>
</div>
    
`,
    //language=CSS
    styles: [`        
        .devctrl-card {
            max-width: 900px;
            flex: 1 1;
        }
        
        .devctrl-card-bottom {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
        }

        md-tab-group /deep/ .mat-tab-body-content {
            height: auto;
        }
        
        :host /deep/ .devices .mat-list-item {
            width: 100%;
        }
`]
})
export class RoomComponent implements OnInit {

    rooms : IndexedDataSet<Room>;
    obj: Room;
    panels : IndexedDataSet<Panel>;
    config;
    roomConfig;

    constructor(private route : ActivatedRoute,
                private dataService: DataService,
                public menu : MenuService,
                private recordService : RecordEditorService,
                public ls : LayoutService) {
    }

    ngOnInit() {
        this.rooms = (<IndexedDataSet<Room>>this.dataService.getTable(Room.tableStr));
        this.config = this.dataService.config;

        if (! this.config.rooms) {
            this.config.rooms = {};
        }

        this.route.data.subscribe((data: { room: Room}) => {
            this.obj = data.room;

            this.menu.currentTopLevel = MenuService.TOPLEVEL_ROOMS;
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
        //console.log(`previously selected groupis ${this.roomConfig['selectedGroup']}`);
        return this.roomConfig['selectedGroup'];
    }

    set selectedGroup(value) {
        this.roomConfig['selectedGroup'] = value;
        this.dataService.updateConfig();
    }

    addPanel($event) {
        this.recordService.editRecord($event, '0', 'panels',
            {
                'room' : this.obj,
                'grouping' : this.currentGrouping()
            }
        );
    }


    currentGrouping() {
        let groups = this.getGroups();
        let grouping = groups[this.selectedGroup];
        return grouping;
    }

    getGroups() {
        let deleteGroups = {};
        let groupList = [];

        // Only update the groups list if the panels have been loaded
        // This allows initial groupings to be loaded from local storage
        if (Object.keys(this.panels).length > 0) {
            for (let groupName in this.roomConfig.groups) {
                deleteGroups[groupName] = true;
            }

            for (let panelId in this.panels) {
                let panel = this.panels[panelId];
                if (!this.roomConfig.groups[panel.grouping]) {
                    this.roomConfig.groups[panel.grouping] = {opened: false}
                    groupList.push(panel.grouping);
                }
                deleteGroups[panel.grouping] = false;
            }

            for (let grouping in deleteGroups) {
                if (deleteGroups[grouping]) {
                    delete this.roomConfig.groups[grouping];
                }
            }
        }

        return Object.keys(this.roomConfig.groups);
    }

    getRoomEndpoints(grouping = "") : Endpoint[] {
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

    groupSelected(idx) {
        this.selectedGroup = idx;
        console.log(`tab ${idx} selected`);
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