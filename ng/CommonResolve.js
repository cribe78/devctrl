goog.provide('DevCtrl.Common.Resolve');

DevCtrl.Common.Resolve = {
    // Load all controls.  Do something smarter with this if it starts slowing us down
    loadControls: function(DataService) {
        return DataService.getTablePromise('controls');
    },

    loadControlTemplates: function(DataService) {
        return DataService.getTablePromise('control_templates');
    },

    loadRooms : function(DataService) {
        return DataService.getTablePromise('rooms');
    },

    loadPanels : function(DataService) {
        return DataService.getTablePromise('panels');
    },

    loadPanelControls : function(DataService) {
        return DataService.getTablePromise('panel_controls');
    },

    loadControlSets : function(DataService) {
        return DataService.getTablePromise('control_sets');
    }
};