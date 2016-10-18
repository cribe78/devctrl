"use strict";
var Endpoint_1 = require("../../shared/Endpoint");
var Control_1 = require("../../shared/Control");
var EndpointController = (function () {
    function EndpointController($stateParams, dataService, menuService) {
        this.$stateParams = $stateParams;
        this.dataService = dataService;
        this.menuService = menuService;
    }
    EndpointController.prototype.$onInit = function () {
        this.endpointId = this.$stateParams.id;
        this.endpoints = this.dataService.getTable(Endpoint_1.Endpoint.tableStr);
        this.obj = this.endpoints[this.endpointId];
        if (this.obj) {
            this.$stateParams.name = this.obj.name;
            this.controls = this.obj.referenced[Control_1.Control.tableStr];
            this.menuService.toolbarSelectTable(Endpoint_1.Endpoint.tableStr, "endpoints.endpoint", this.obj._id);
        }
    };
    EndpointController.prototype.togglePanel = function (panel) {
        if (!angular.isDefined(panel.opened)) {
            panel.opened = true;
        }
        else {
            panel.opened = !panel.opened;
        }
    };
    EndpointController.prototype.isPanelOpen = function (panel) {
        return angular.isDefined(panel.opened) && panel.opened;
    };
    EndpointController.prototype.addControl = function ($event) {
        this.dataService.editRecord($event, '0', 'controls', {
            'endpoint_type_id': this.obj.endpoint_type_id
        });
    };
    EndpointController.prototype.editEndpoint = function ($event) {
        this.dataService.editRecord($event, this.endpointId, 'endpoints');
    };
    EndpointController.$inject = ['$stateParams', 'DataService', 'MenuService'];
    return EndpointController;
}());
exports.EndpointController = EndpointController;
//# sourceMappingURL=endpoint.controller.js.map