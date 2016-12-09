"use strict";
const Room_1 = require("../../shared/Room");
const Panel_1 = require("../../shared/Panel");
const PanelControl_1 = require("../../shared/PanelControl");
class RoomController {
    constructor($stateParams, dataService, menuService) {
        this.$stateParams = $stateParams;
        this.dataService = dataService;
        this.menuService = menuService;
        this.menu = menuService;
    }
    $onInit() {
        this.rooms = this.dataService.getTable(Room_1.Room.tableStr);
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
        this.panels = this.obj.referenced[Panel_1.Panel.tableStr];
        this.config = this.dataService.config;
        if (!this.config.rooms) {
            this.config.rooms = {};
        }
        if (!this.config.rooms[this.obj._id]) {
            this.config.rooms[this.obj._id] = { groups: {} };
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
        this.dataService.editRecord($event, '0', 'panels', {
            'room_id': this.obj._id
        });
    }
    getGroups() {
        let deleteGroups = {};
        for (let groupName in this.roomConfig.groups) {
            deleteGroups[groupName] = true;
        }
        for (let panelId in this.panels) {
            let panel = this.panels[panelId];
            if (!this.roomConfig.groups[panel.grouping]) {
                this.roomConfig.groups[panel.grouping] = { opened: false };
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
    getRoomEndpoints(grouping) {
        let roomEndpoints = {};
        let ignoreGrouping = !grouping;
        for (let panelId in this.panels) {
            let panel = this.panels[panelId];
            if (ignoreGrouping || panel.grouping == grouping) {
                let panelControls = panel.referenced[PanelControl_1.PanelControl.tableStr];
                for (let panelControlId in panelControls) {
                    let endpoint = panelControls[panelControlId].endpoint;
                    if (endpoint && !roomEndpoints[endpoint._id]) {
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
    panelControls(panel) {
        if (panel.referenced[PanelControl_1.PanelControl.tableStr]) {
            return panel.referenced[PanelControl_1.PanelControl.tableStr];
        }
    }
    toggleGroup(group) {
        group.opened = !group.opened;
        this.dataService.updateConfig();
    }
}
RoomController.$inject = ['$stateParams', 'DataService', 'MenuService'];
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map