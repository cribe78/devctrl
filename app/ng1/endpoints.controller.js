"use strict";
const Endpoint_1 = require("../../shared/Endpoint");
const EndpointType_1 = require("../../shared/EndpointType");
class EndpointsController {
    constructor(dataService, $state) {
        this.dataService = dataService;
        this.$state = $state;
    }
    $onInit() {
        this.endpoints = this.dataService.getTable(Endpoint_1.Endpoint.tableStr);
    }
    addEndpoint($event) {
        this.dataService.editRecord($event, '0', Endpoint_1.Endpoint.tableStr);
    }
    addEndpointType($event) {
        this.dataService.editRecord($event, '0', EndpointType_1.EndpointType.tableStr);
    }
    go(state) {
        if (angular.isString(state)) {
            this.$state.go(state);
        }
        else {
            this.$state.go(state.name, state.params);
        }
    }
}
EndpointsController.$inject = ['DataService', '$state'];
EndpointsController.template = `
<div layout="column" ng-if="$ctrl.$state.is('endpoints')">
            <md-toolbar layout="row" devctrl-admin-only >
                <div class="md-toolbar-tools">
                    <md-button ng-click="$ctrl.addEndpoint($event)">Add Endpoint</md-button>
                    <md-button ng-click="$ctrl.addEndpointType($event)">Add Endpoint Type</md-button>
                </div>
            </md-toolbar>
            <md-list>
                <md-list-item 
                ng-repeat-start="(id, endpoint) in $ctrl.endpoints | toArray | orderBy: 'name' : false" 
                ng-click="$ctrl.go({ name: 'endpoints.endpoint', params : { name : endpoint.name, id : endpoint._id }})">
                    {{endpoint.name}}
                    <span flex></span>
                    <devctrl-endpoint-status endpoint-id="endpoint._id"></devctrl-endpoint-status>
                    <md-icon md-font-set="material-icons" >chevron_right</md-icon>
                </md-list-item>
                <md-divider ng-repeat-end></md-divider>
            </md-list>
</div>
<ui-view></ui-view>
`;
exports.EndpointsController = EndpointsController;
//# sourceMappingURL=endpoints.controller.js.map