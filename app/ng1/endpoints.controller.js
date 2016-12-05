"use strict";
var Endpoint_1 = require("../../shared/Endpoint");
var EndpointType_1 = require("../../shared/EndpointType");
var EndpointsController = (function () {
    function EndpointsController(dataService, $state) {
        this.dataService = dataService;
        this.$state = $state;
    }
    EndpointsController.prototype.$onInit = function () {
        this.endpoints = this.dataService.getTable(Endpoint_1.Endpoint.tableStr);
    };
    EndpointsController.prototype.addEndpoint = function ($event) {
        this.dataService.editRecord($event, '0', Endpoint_1.Endpoint.tableStr);
    };
    EndpointsController.prototype.addEndpointType = function ($event) {
        this.dataService.editRecord($event, '0', EndpointType_1.EndpointType.tableStr);
    };
    EndpointsController.prototype.go = function (state) {
        if (angular.isString(state)) {
            this.$state.go(state);
        }
        else {
            this.$state.go(state.name, state.params);
        }
    };
    EndpointsController.$inject = ['DataService', '$state'];
    EndpointsController.template = "\n<div layout=\"column\" ng-if=\"$ctrl.$state.is('endpoints')\">\n            <md-toolbar layout=\"row\" devctrl-admin-only >\n                <div class=\"md-toolbar-tools\">\n                    <md-button ng-click=\"$ctrl.addEndpoint($event)\">Add Endpoint</md-button>\n                    <md-button ng-click=\"$ctrl.addEndpointType($event)\">Add Endpoint Type</md-button>\n                </div>\n            </md-toolbar>\n            <md-list>\n                <md-list-item \n                ng-repeat-start=\"(id, endpoint) in $ctrl.endpoints | toArray | orderBy: 'name' : false\" \n                ng-click=\"$ctrl.go({ name: 'endpoints.endpoint', params : { name : endpoint.name, id : endpoint._id }})\">\n                    {{endpoint.name}}\n                    <span flex></span>\n                    <devctrl-endpoint-status endpoint-id=\"endpoint._id\"></devctrl-endpoint-status>\n                    <md-icon md-font-set=\"material-icons\" >chevron_right</md-icon>\n                </md-list-item>\n                <md-divider ng-repeat-end></md-divider>\n            </md-list>\n</div>\n<ui-view></ui-view>\n";
    return EndpointsController;
}());
exports.EndpointsController = EndpointsController;
//# sourceMappingURL=endpoints.controller.js.map