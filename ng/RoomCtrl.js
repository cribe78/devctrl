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

        // This function is here to prevent null reference errors
        this.panelControls = function(panel) {
            if (angular.isDefined(panel.referenced['panel_controls'])) {
                return panel.referenced['panel_controls'];
            }
        };

        this.togglePanel = function(panel) {
            if (! angular.isDefined(panel.opened)) {
                panel.opened = true;
            }
            else {
                panel.opened = ! panel.opened;
            }
        };

        this.isPanelOpen = function(panel) {
            var open = angular.isDefined(panel.opened) && panel.opened;
            return open;

        };
    }
];
