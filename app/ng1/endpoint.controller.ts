import {DataService} from "../data.service";
import {IndexedDataSet} from "../../shared/DCDataModel";
import {Endpoint} from "../../shared/Endpoint";
import {Control} from "../../shared/Control";
import {MenuService} from "./menu.service";
export class EndpointController {
    endpointId: string;
    endpoints: IndexedDataSet<Endpoint>;
    obj: Endpoint;
    controls: IndexedDataSet<Control>;

    static $inject = ['$stateParams', 'DataService', 'MenuService'];
    constructor(private $stateParams, private dataService: DataService, private menuService : MenuService) {}

    $onInit() {
        this.endpointId = this.$stateParams.id;
        this.endpoints = <IndexedDataSet<Endpoint>>this.dataService.getTable(Endpoint.tableStr);
        this.obj = this.endpoints[this.endpointId];

        if (this.obj) {
            this.$stateParams.name = this.obj.name;
            this.controls = <IndexedDataSet<Control>>this.obj.referenced[Control.tableStr];
            this.menuService.toolbarSelectTable(Endpoint.tableStr, "endpoints.endpoint", this.obj._id);
        }
    }

    togglePanel(panel) {
        if (! angular.isDefined(panel.opened)) {
            panel.opened = true;
        }
        else {
            panel.opened = ! panel.opened;
        }
    }

    isPanelOpen(panel) {
        return angular.isDefined(panel.opened) && panel.opened;
    }

    addControl($event) {
        this.dataService.editRecord($event, '0', 'controls',
            {
                'endpoint_type_id' : this.obj.endpoint_type_id
            }
        );
    }

    editEndpoint($event) {
        this.dataService.editRecord($event, this.endpointId, 'endpoints');
    }

    generateConfig($event) {
        this.dataService.generateEndpointConfig($event, this.endpointId);
    }

    static template = `
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
`
}