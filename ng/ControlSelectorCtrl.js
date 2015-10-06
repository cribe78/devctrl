
goog.provide("DevCtrl.ControlSelector.Ctrl");
goog.provide("DevCtrl.ControlSelector.Resolve");

DevCtrl.ControlSelector.Ctrl = ['DataService',
    function(DataService) {
        var self = this;
        this.endpointTypes = DataService.getTable("endpoint_types");
        this.endpoints = DataService.getTable("endpoint_types");
        this.controls = DataService.getTable("controls");
        this.control_templates = DataService.getTable("control_templates");

        this.getEndpointTypes = function() {
            return this.endpointTypes.indexed;
        };

        this.getEndpoints = function() {
            return this.endpoints.indexed;
        };

        this.controlList = {};
        this.getControls = function() {
            angular.forEach(self.controls.indexed, function(control) {
                var loadControl = false;
                var loadAll = true;
                if (angular.isArray(self.endpointTypesSelected)) {
                    loadAll = false;
                    var ctrlEpType = control.foreign.control_endpoints.id;

                    angular.forEach(self.endpointTypesSelected, function(typeId) {
                           if (ctrlEpType == typeId) {
                               loadControl = true;
                           }
                    });
                }

                if (loadControl || loadAll) {
                    self.controlList[control.id] = control;
                }
                else {
                    delete self.controlList[control.id];
                }
            });

            return self.controlList;
        }
    }
];
