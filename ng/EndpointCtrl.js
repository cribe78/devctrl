goog.provide("DevCtrl.Endpoint.Ctrl");

DevCtrl.Endpoint.Ctrl = ['$stateParams', 'DataService', 'MenuService',
    function($stateParams, DataService, MenuService) {
        var self = this;
        this.endpointId = $stateParams.id;
        this.endpoints = DataService.getTable('control_endpoints');
        this.obj = this.endpoints.indexed[this.endpointId];

        // The toolbar title uses this
        $stateParams.name = this.obj.fields.name;

        // This function is here to prevent null reference errors
        this.controls = this.obj.referenced['controls'];

        MenuService.toolbarSelectTable("control_endpoints", "endpoints.endpoint", self.obj.id);

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

        this.addTemplate = function($event) {
            DataService.editRecord($event, '0', 'control_templates',
                {
                    'endpoint_type_id' : self.obj.fields.endpoint_type_id
                }
            );
        };

        this.editEndpoint = function($event) {
            DataService.editRecord($event, this.endpointId, 'control_endpoints');
        };
    }
];

