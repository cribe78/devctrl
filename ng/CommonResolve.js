goog.provide('DevCtrl.Common.Resolve');

DevCtrl.Common.Resolve = {
    resetToolbar : function(MenuService) {
        MenuService.toolbarSelect.enable = false;
    },

    loadSchema : function(DataService) {
        console.log("loadSchema called");
        return DataService.getSchemaPromise();
    },

    loadClients: function(DataService) {
        return DataService.getTablePromise('clients');
    },
    // Load all controls.  Do something smarter with this if it starts slowing us down
    loadControls: function(DataService) {
        return DataService.getTablePromise('controls');
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

    loadEndpointTypes : function(DataService) {
        return DataService.getTablePromise('endpoint_types');
    },

    loadControlEndpoints : function(DataService) {
        return DataService.getTablePromise('endpoints');
    },

    loadUserInfo : function(DataService) {
        return DataService.getAdminAuth();
    }
};