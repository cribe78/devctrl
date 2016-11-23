import {IndexedDataSet} from "../../shared/DCDataModel";
import {Endpoint} from "../../shared/Endpoint";
import {DataService} from "../data.service";
import {EndpointType} from "../../shared/EndpointType";
export class EndpointsController {
    endpoints : IndexedDataSet<Endpoint>;

    static $inject = ['DataService', '$state'];
    constructor(private dataService : DataService, public $state){}

    $onInit() {
        this.endpoints = (<IndexedDataSet<Endpoint>>this.dataService.getTable(Endpoint.tableStr));
    }

    addEndpoint($event) {
        this.dataService.editRecord($event, '0', Endpoint.tableStr);
    }

    addEndpointType($event) {
        this.dataService.editRecord($event, '0', EndpointType.tableStr);
    }

    go(state) {
        if (angular.isString(state)) {
            this.$state.go(state);
        }
        else {
            this.$state.go(state.name, state.params);
        }
    }

    static template = `
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
}