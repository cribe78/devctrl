"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var Room_1 = require("shared/Room");
var data_service_1 = require("../data.service");
var Panel_1 = require("shared/Panel");
var menu_service_1 = require("../layout/menu.service");
var PanelControl_1 = require("shared/PanelControl");
require("rxjs/add/operator/switchMap");
var record_editor_service_1 = require("data-editor/record-editor.service");
var layout_service_1 = require("../layout/layout.service");
//TODO: remember selected tab
var RoomComponent = (function () {
    function RoomComponent(route, dataService, menu, recordService, ls) {
        this.route = route;
        this.dataService = dataService;
        this.menu = menu;
        this.recordService = recordService;
        this.ls = ls;
    }
    RoomComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rooms = this.dataService.getTable(Room_1.Room.tableStr);
        this.config = this.dataService.config;
        if (!this.config.rooms) {
            this.config.rooms = {};
        }
        this.route.data.subscribe(function (data) {
            _this.obj = data.room;
            _this.menu.currentTopLevel = menu_service_1.MenuService.TOPLEVEL_ROOMS;
            _this.menu.pageTitle = _this.obj.name;
            _this.menu.toolbarSelectTable("rooms", ['rooms'], _this.obj._id);
            _this.panels = _this.obj.referenced[Panel_1.Panel.tableStr];
            if (!_this.config.rooms[_this.obj._id]) {
                _this.config.rooms[_this.obj._id] = { groups: {} };
            }
            _this.roomConfig = _this.config.rooms[_this.obj._id];
        });
    };
    Object.defineProperty(RoomComponent.prototype, "selectedGroup", {
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
    RoomComponent.prototype.addPanel = function ($event) {
        this.recordService.editRecord($event, '0', 'panels', {
            'room': this.obj,
            'grouping': this.currentGrouping()
        });
    };
    RoomComponent.prototype.currentGrouping = function () {
        var groups = this.getGroups();
        var grouping = groups[this.selectedGroup];
        return grouping;
    };
    RoomComponent.prototype.getGroups = function () {
        var deleteGroups = {};
        var groupList = [];
        for (var groupName in this.roomConfig.groups) {
            deleteGroups[groupName] = true;
        }
        for (var panelId in this.panels) {
            var panel = this.panels[panelId];
            if (!this.roomConfig.groups[panel.grouping]) {
                this.roomConfig.groups[panel.grouping] = { opened: false };
                groupList.push(panel.grouping);
            }
            deleteGroups[panel.grouping] = false;
        }
        for (var grouping in deleteGroups) {
            if (deleteGroups[grouping]) {
                delete this.roomConfig.groups[grouping];
            }
        }
        return Object.keys(this.roomConfig.groups);
    };
    RoomComponent.prototype.getRoomEndpoints = function (grouping) {
        var roomEndpoints = {};
        var roomEndpointList = [];
        var ignoreGrouping = !grouping;
        for (var panelId in this.panels) {
            var panel = this.panels[panelId];
            if (ignoreGrouping || panel.grouping == grouping) {
                var panelControls = panel.referenced[PanelControl_1.PanelControl.tableStr];
                for (var panelControlId in panelControls) {
                    var endpoint = panelControls[panelControlId].endpoint;
                    if (endpoint && !roomEndpoints[endpoint._id]) {
                        roomEndpoints[endpoint._id] = endpoint;
                        roomEndpointList.push(endpoint);
                    }
                }
            }
        }
        return roomEndpointList;
    };
    RoomComponent.prototype.groupPanels = function (groupName) {
        var panels = [];
        for (var id in this.panels) {
            if (this.panels[id].grouping == groupName) {
                panels.push(this.panels[id]);
            }
        }
        panels.sort(function (a, b) {
            return a.panel_index - b.panel_index;
        });
        return panels;
    };
    RoomComponent.prototype.getRoomByName = function (roomName) {
        for (var id in this.rooms) {
            if (this.rooms[id].name.toLowerCase() == roomName.toLowerCase()) {
                return this.rooms[id];
            }
        }
        console.log("Room " + roomName + " not found");
    };
    RoomComponent.prototype.groupSelected = function (idx) {
        this.selectedGroup = idx;
        console.log("tab " + idx + " selected");
    };
    RoomComponent.prototype.panelControls = function (panel) {
        if (panel.referenced[PanelControl_1.PanelControl.tableStr]) {
            return panel.referenced[PanelControl_1.PanelControl.tableStr];
        }
    };
    RoomComponent.prototype.toggleGroup = function (group) {
        group.opened = !group.opened;
        this.dataService.updateConfig();
    };
    RoomComponent.prototype.trackById = function (index, endpoint) {
        return endpoint._id;
    };
    return RoomComponent;
}());
RoomComponent = __decorate([
    core_1.Component({
        selector: 'devctrl-room',
        template: "\n<div id=\"devctrl-content-canvas\">\n    <div class=\"devctrl-card\">\n        <!-- TODO: initial tab selection is not working -->\n        <md-tab-group #tabgroup \n            [selectedIndex]=\"selectedGroup\" \n            (selectChange)=\"groupSelected(tabgroup.selectedIndex)\">\n            <md-tab *ngFor=\"let groupName of getGroups()\"\n                    label=\"{{groupName}}\" >\n                <md-list>\n                        <devctrl-panel *ngFor=\"let rpanel of groupPanels(groupName)\"\n                                       [panelObj]=\"rpanel\">\n                        </devctrl-panel>\n                </md-list>\n        \n            </md-tab>\n            <md-tab label=\"Devices\">\n                <md-nav-list class=\"devices\">\n                    <ng-template ngFor let-endpoint [ngForOf]=\"getRoomEndpoints()\" [ngForTrackBy]=\"trackById\">\n                        <a md-list-item\n                                  (click)=\"menu.go(['devices', endpoint._id])\">\n                            <span md-line>{{endpoint.name}}</span>\n                            <span>&nbsp;</span>\n                            <devctrl-endpoint-status [endpointId]=\"endpoint._id\"></devctrl-endpoint-status>\n                            <md-icon md-font-set=\"material-icons\">keyboard_arrow_right</md-icon>\n                        </a>\n                        <md-divider></md-divider>\n                    </ng-template>\n                </md-nav-list>\n            </md-tab>\n        </md-tab-group>\n        <div class=\"devctrl-card-bottom\" *devctrlAdminOnly>\n            <button md-button\n                    (click)=\"addPanel($event)\"\n                    class=\"md-primary\">\n                Add Panel\n            </button>\n        </div>\n    </div>\n    <devctrl-action-history *ngIf=\"ls.desktopWide\"></devctrl-action-history>\n</div>\n    \n",
        //language=CSS
        styles: ["        \n        .devctrl-card {\n            max-width: 900px;\n            flex: 1 1;\n        }\n        \n        .devctrl-card-bottom {\n            display: flex;\n            flex-direction: row;\n            justify-content: flex-end;\n        }\n\n        md-tab-group /deep/ .mat-tab-body-content {\n            height: auto;\n        }\n        \n        :host /deep/ .devices .mat-list-item {\n            width: 100%;\n        }\n"]
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        data_service_1.DataService,
        menu_service_1.MenuService,
        record_editor_service_1.RecordEditorService,
        layout_service_1.LayoutService])
], RoomComponent);
exports.RoomComponent = RoomComponent;
//# sourceMappingURL=room.component.js.map