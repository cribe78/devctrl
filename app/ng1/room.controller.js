"use strict";
var Room_1 = require("../../shared/Room");
var Panel_1 = require("../../shared/Panel");
var PanelControl_1 = require("../../shared/PanelControl");
var RoomController = (function () {
    function RoomController($stateParams, dataService, menuService) {
        this.$stateParams = $stateParams;
        this.dataService = dataService;
        this.menuService = menuService;
        this.menu = menuService;
    }
    RoomController.prototype.$onInit = function () {
        this.rooms = this.dataService.getTable(Room_1.Room.tableStr);
        if (this.rooms[this.$stateParams.id]) {
            this.obj = this.rooms[this.$stateParams.id];
            this.$stateParams.name = this.obj.name;
        }
        else {
            for (var id in this.rooms) {
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
    };
    Object.defineProperty(RoomController.prototype, "selectedGroup", {
        get: function () {
            if (typeof this.roomConfig['selectedGroup'] == 'undefined') {
                this.roomConfig['selectedGroup'] = 0;
                this.dataService.updateConfig();
            }
            return this.roomConfig['selectedGroup'];
        },
        set: function (value) {
            this.roomConfig['selectedGroup'] = value;
            this.dataService.updateConfig();
        },
        enumerable: true,
        configurable: true
    });
    RoomController.prototype.addPanel = function ($event) {
        this.dataService.editRecord($event, '0', 'panels', {
            'room_id': this.obj._id
        });
    };
    RoomController.prototype.getGroups = function () {
        var deleteGroups = {};
        for (var groupName in this.roomConfig.groups) {
            deleteGroups[groupName] = true;
        }
        for (var panelId in this.panels) {
            var panel = this.panels[panelId];
            if (!this.roomConfig.groups[panel.grouping]) {
                this.roomConfig.groups[panel.grouping] = { opened: false };
            }
            deleteGroups[panel.grouping] = false;
        }
        for (var grouping in deleteGroups) {
            if (deleteGroups[grouping]) {
                delete this.roomConfig.groups[grouping];
            }
        }
        return this.roomConfig.groups;
    };
    RoomController.prototype.getRoomEndpoints = function (grouping) {
        var roomEndpoints = {};
        var ignoreGrouping = !grouping;
        for (var panelId in this.panels) {
            var panel = this.panels[panelId];
            if (ignoreGrouping || panel.grouping == grouping) {
                var panelControls = panel.referenced[PanelControl_1.PanelControl.tableStr];
                for (var panelControlId in panelControls) {
                    var endpoint = panelControls[panelControlId].endpoint;
                    if (endpoint && !roomEndpoints[endpoint._id]) {
                        roomEndpoints[endpoint._id] = endpoint;
                    }
                }
            }
        }
        return roomEndpoints;
    };
    RoomController.prototype.groupSelected = function (group) {
        console.log("tab " + group + " selected");
    };
    RoomController.prototype.panelControls = function (panel) {
        if (panel.referenced[PanelControl_1.PanelControl.tableStr]) {
            return panel.referenced[PanelControl_1.PanelControl.tableStr];
        }
    };
    RoomController.prototype.toggleGroup = function (group) {
        group.opened = !group.opened;
        this.dataService.updateConfig();
    };
    RoomController.$inject = ['$stateParams', 'DataService', 'MenuService'];
    return RoomController;
}());
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map