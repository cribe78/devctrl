"use strict";
exports.PanelControlSelectorCtrl = ['$mdDialog', 'DataService',
    function ($mdDialog, DataService) {
        var self = this;
        this.endpointTypes = DataService.getTable("endpoint_types");
        this.endpoints = DataService.getTable("endpoints");
        this.controls = DataService.getTable("controls");
        this.newPanelControl = DataService.getNewRowRef("panel_controls");
        this.newPanelControl.fields.panel_id = this.panelId;
        this.endpointTypesSelected = [];
        this.endpointsSelected = [];
        this.endpointsSelected = '0';
        this.getControlName = function (row) {
            var ret = row.fields.name;
            return ret;
        };
        this.getEndpointTypes = function () {
            return this.endpointTypes.indexed;
        };
        this.getEndpoints = function () {
            return this.endpoints.indexed;
        };
        this.controlList = {};
        this.getControls = function () {
            angular.forEach(self.controls.indexed, function (control) {
                var loadControl = false;
                var loadAll = true;
                if (angular.isArray(self.endpointsSelected) && self.endpointsSelected.length > 0) {
                    loadAll = false;
                    var ctrlEp = control.fields.endpoint_id;
                    angular.forEach(self.endpointsSelected, function (endpointId) {
                        if (endpointId == ctrlEp) {
                            loadControl = true;
                        }
                    });
                }
                else if (self.endpointSelected !== '0') {
                    loadAll = false;
                    if (self.endpointSelected == control.foreign.endpoint_id.id) {
                        loadControl = true;
                    }
                }
                else if (angular.isArray(self.endpointTypesSelected) && self.endpointTypesSelected.length > 0) {
                    loadAll = false;
                    var ctrlEpType = control.foreign.endpoints.fields.endpoint_type_id;
                    angular.forEach(self.endpointTypesSelected, function (typeId) {
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
        };
        this.endpointList = {};
        this.getEndpoints = function () {
            angular.forEach(self.endpoints.indexed, function (endpoint) {
                var loadEndpoint = false;
                var loadAll = true;
                if (angular.isArray(self.endpointTypesSelected) && self.endpointTypesSelected.length > 0) {
                    loadAll = false;
                    var epType = endpoint.fields.endpoint_type_id;
                    angular.forEach(self.endpointTypesSelected, function (typeId) {
                        if (epType == typeId) {
                            loadEndpoint = true;
                        }
                    });
                }
                if (loadEndpoint || loadAll) {
                    self.endpointList[endpoint.id] = endpoint;
                }
                else {
                    delete self.endpointList[endpoint.id];
                }
            });
            return self.endpointList;
        };
        this.clearEndpointTypes = function () {
            self.endpointTypesSelected = undefined;
        };
        this.clearEndpoints = function () {
            self.endpointsSelected = undefined;
        };
        this.addPanelControl = function () {
            DataService.addRow(self.newPanelControl);
            $mdDialog.hide();
        };
        this.cancelAdd = function () {
            $mdDialog.hide();
        };
    }
];
//# sourceMappingURL=PanelControlSelectorCtrl.js.map