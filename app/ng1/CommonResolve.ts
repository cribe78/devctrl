export let CommonResolve = {
    resetToolbar : function(MenuService) {
        MenuService.toolbarSelect.enable = false;
    },

    // Load all controls.  Do something smarter with this if it starts slowing us down
    loadControls: function(DataService) {
        return DataService.getTablePromise('controls');
    },

    loadRooms : function(DataService) {
        return DataService.getTablePromise('rooms');
    },

    loadOptionSets : function(DataService) {
        return DataService.getTablePromise('option_sets');
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
        return DataService.getUserInfo();
    },
};