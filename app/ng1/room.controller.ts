import {IndexedDataSet} from "../../shared/DCDataModel";
import {Room} from "../../shared/Room";
import {DataService} from "../data.service";
import {Panel} from "../../shared/Panel";
import {PanelControl} from "../../shared/PanelControl";
import {Endpoint} from "../../shared/Endpoint";
import {MenuService} from "./menu.service";
export class RoomController {
    menu;
    rooms : IndexedDataSet<Room>;
    obj: Room;
    panels : IndexedDataSet<Panel>;
    config;
    roomConfig;

    static $inject = ['$stateParams', 'DataService', 'MenuService'];
    constructor(private $stateParams, private dataService: DataService, private menuService : MenuService) {
        this.menu = menuService;
    }

    $onInit() {
        this.rooms = (<IndexedDataSet<Room>>this.dataService.getTable(Room.tableStr));

        if (this.rooms[this.$stateParams.id]) {
            this.obj = this.rooms[this.$stateParams.id];
            this.$stateParams.name = this.obj.name;
        }
        else {
            for (let id in this.rooms) {
                if (this.rooms[id].name == this.$stateParams.name) {
                    this.obj = this.rooms[id];
                    break;
                }
            }
        }

        this.menu.toolbarSelectTable("rooms", "rooms.room", this.obj._id);
        this.panels = <IndexedDataSet<Panel>>this.obj.referenced[Panel.tableStr];
        this.config = this.dataService.config;


        if (! this.config.rooms) {
            this.config.rooms = {};
        }

        if (! this.config.rooms[this.obj._id]) {
            this.config.rooms[this.obj._id] = { groups : {}};
        }

        this.roomConfig = this.config.rooms[this.obj._id];
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
        this.dataService.editRecord($event, '0', 'panels',
            {
                'room_id' : this.obj._id
            }
        );
    }


    getGroups() {
        let deleteGroups = {};

        for (let groupName in this.roomConfig.groups) {
            deleteGroups[groupName] = true;
        }

        for (let panelId in this.panels) {
            let panel = this.panels[panelId];
            if (! this.roomConfig.groups[panel.grouping]) {
                this.roomConfig.groups[panel.grouping] = { opened: false }
            }
            deleteGroups[panel.grouping] = false;
        }

        for (let grouping in deleteGroups) {
            if (deleteGroups[grouping]) {
                delete this.roomConfig.groups[grouping];
            }
        }

        return this.roomConfig.groups;
    }

    getRoomEndpoints(grouping) : IndexedDataSet<Endpoint> {
        let roomEndpoints : IndexedDataSet<Endpoint> = {};
        let ignoreGrouping = ! grouping;

        for (let panelId in this.panels) {
            let panel = this.panels[panelId];
            if (ignoreGrouping || panel.grouping == grouping) {
                let panelControls = <IndexedDataSet<PanelControl>>panel.referenced[PanelControl.tableStr];

                for (let panelControlId in panelControls) {
                    let endpoint = panelControls[panelControlId].endpoint;
                    if (endpoint && ! roomEndpoints[endpoint._id]) {
                        roomEndpoints[endpoint._id] = endpoint;
                    }
                }
            }
        }

        return roomEndpoints;
    }

    groupSelected(group) {
        console.log(`tab ${group} selected`);
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
}
