"use strict";
const Endpoint_1 = require("../../shared/Endpoint");
const Control_1 = require("../../shared/Control");
class EndpointController {
    constructor($stateParams, dataService, menuService) {
        this.$stateParams = $stateParams;
        this.dataService = dataService;
        this.menuService = menuService;
    }
    $onInit() {
        this.endpointId = this.$stateParams.id;
        this.endpoints = this.dataService.getTable(Endpoint_1.Endpoint.tableStr);
        this.obj = this.endpoints[this.endpointId];
        if (this.obj) {
            this.$stateParams.name = this.obj.name;
            this.controls = this.obj.referenced[Control_1.Control.tableStr];
            this.menuService.toolbarSelectTable(Endpoint_1.Endpoint.tableStr, "endpoints.endpoint", this.obj._id);
        }
    }
    togglePanel(panel) {
        if (!angular.isDefined(panel.opened)) {
            panel.opened = true;
        }
        else {
            panel.opened = !panel.opened;
        }
    }
    isPanelOpen(panel) {
        return angular.isDefined(panel.opened) && panel.opened;
    }
    addControl($event) {
        this.dataService.editRecord($event, '0', 'controls', {
            'endpoint_type_id': this.obj.endpoint_type_id
        });
    }
    editEndpoint($event) {
        this.dataService.editRecord($event, this.endpointId, 'endpoints');
    }
    generateConfig($event) {
        this.dataService.generateEndpointConfig($event, this.endpointId);
    }
}
EndpointController.$inject = ['$stateParams', 'DataService', 'MenuService'];
EndpointController.template = `
<md-toolbar>
    <div class="md-toolbar-tools">
        <md-button devctrl-admin-only ng-click="$ctrl.addControl($event)">Add Control</md-button>
        <md-button devctrl-admin-only ng-click="$ctrl.editEndpoint($event)">Edit Device</md-button>
        <md-button devctrl-admin-only ng-click="$ctrl.generateConfig($event)">Generate Config</md-button>
        <span flex></span>
        <devctrl-endpoint-status endpoint-id="$ctrl.obj._id"></devctrl-endpoint-status>
    </div>
</md-toolbar>

<md-list>
    <md-list-item ng-repeat-start="(key, control) in $ctrl.controls">
        <ctrl flex control-id="key"></ctrl>
    </md-list-item>
    <md-divider ng-repeat-end></md-divider>
</md-list>
`;
exports.EndpointController = EndpointController;
//# sourceMappingURL=endpoint.controller.js.map