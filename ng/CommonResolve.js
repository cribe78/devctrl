goog.provide('DevCtrl.Common.Resolve');

DevCtrl.Common.Resolve = {
    // Load all controls.  Do something smarter with this if it starts slowing us down
    loadSchema : function(DataService) {
        return DataService.getSchemaPromise();
    },

    loadControls: function(DataService, loadSchema) {
        return DataService.getTablePromise('controls');
    },

    loadControlTemplates: function(DataService, loadSchema) {
        return DataService.getTablePromise('control_templates');
    },

    loadRooms : function(DataService, loadSchema) {
        return DataService.getTablePromise('rooms');
    },

    loadPanels : function(DataService, loadSchema) {
        return DataService.getTablePromise('panels');
    },

    loadPanelControls : function(DataService, loadSchema) {
        return DataService.getTablePromise('panel_controls');
    },

    loadControlSets : function(DataService, loadSchema) {
        return DataService.getTablePromise('control_sets');
    }
};