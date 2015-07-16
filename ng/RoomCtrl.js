goog.provide("DevCtrl.Room.Ctrl");

DevCtrl.Room.Ctrl = ['$stateParams', 'DataService',
    function($stateParams, DataService) {
        var self = this;
        this.roomName = $stateParams.name;
        this.rooms = DataService.getTable('rooms');  // These tables are pre-resolved by the ui-router

        angular.forEach(this.rooms.listed, function(value) {
            if (value.fields['name'] == self.roomName) {
                self.obj = value;
                self.id = value.id;
            }
        });

        this.panels = this.obj.referenced.panels;

        this.openedGroup = "";

        this.groups = [];
        this.getGroups = function() {
            angular.forEach(self.panels, function(panel) {
                if (self.groups.indexOf(panel.fields.grouping) == -1) {
                    self.groups.push(panel.fields.grouping);
                }
            });

            return self.groups;
        };

        // This function is here to prevent null reference errors
        this.panelControls = function(panel) {
            if (angular.isDefined(panel.referenced['panel_controls'])) {
                return panel.referenced['panel_controls'];
            }
        };

        this.toggleGroup = function(group) {
            if (group == this.openedGroup) {
                this.openedGroup = "";
            }
            else {
                this.openedGroup = group;
            }
        };

        this.isGroupOpen = function(group) {
            var open = group == this.openedGroup;
            return open;

        };
    }
];
