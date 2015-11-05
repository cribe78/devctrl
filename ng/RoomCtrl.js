goog.provide("DevCtrl.Room.Ctrl");

DevCtrl.Room.Ctrl = ['$stateParams', 'DataService', 'MenuService',
    function($stateParams, DataService, MenuService) {
        var self = this;
        this.menu = MenuService;
        this.roomName = $stateParams.name;
        this.rooms = DataService.getTable('rooms');  // These tables are pre-resolved by the ui-router

        angular.forEach(this.rooms.listed, function(value) {
            if (value.fields['name'] == self.roomName) {
                self.obj = value;
                self.id = value.id;
            }
        });



        this.panels = this.obj.referenced.panels;

        this.addPanel = function($event) {
            DataService.editRecord($event, '0', 'panels',
                {
                    'room_id' : self.id
                }
            );
        };

        this.config = DataService.config;
        var roomConfig = {};
        if (! angular.isObject(this.config.rooms)) {
            this.config.rooms = {};
        }
        if (! angular.isObject(this.config.rooms[self.id])) {
            this.config.rooms[this.id] = {
                groups: {}
            }
        }

        roomConfig = this.config.rooms[this.id];

        this.getGroups = function() {
            var deleteGroups = {};
            angular.forEach(roomConfig.groups, function(group, groupName) {
                deleteGroups[groupName] = true;
            });


            angular.forEach(self.panels, function(panel) {
                if (! angular.isDefined(roomConfig.groups[panel.fields.grouping])) {
                    roomConfig.groups[panel.fields.grouping] = {
                        opened: false
                    };
                    deleteGroups[panel.fields.grouping] = false;
                }
                else {
                    deleteGroups[panel.fields.grouping] = false;
                }
            });

            angular.forEach(deleteGroups, function(group, groupName) {
                if (group) {
                    delete roomConfig.groups[groupName];
                }
            });

            return roomConfig.groups;
        };

        this.getRoomEndpoints = function(grouping) {
            var roomEndpoints = {};
            var ignoreGrouping = ! angular.isDefined(grouping);
            var room = self.obj;
            var panels = room.referenced.panels;

            angular.forEach(panels, function(panel, panelId) {
                if (ignoreGrouping || panel.fields.grouping == grouping) {
                    var panelControls = panel.referenced.panel_controls;
                    angular.forEach(panelControls, function(panelControl, panelControlId) {
                        var endpoint = panelControl.foreign.controls.foreign.control_endpoints;
                        if (! angular.isDefined(roomEndpoints[endpoint.id])) {
                            roomEndpoints[endpoint.id] = endpoint;
                        }
                    });
                }
            });

            return roomEndpoints;
        };

        // This function is here to prevent null reference errors
        this.panelControls = function(panel) {
            if (angular.isDefined(panel.referenced['panel_controls'])) {
                return panel.referenced['panel_controls'];
            }
        };

        this.toggleGroup = function(group) {
            group.opened = ! group.opened;

            DataService.updateConfig();
        };
    }
];
