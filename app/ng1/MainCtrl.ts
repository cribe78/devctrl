import {DataService} from "../data.service";
export let MainCtrl = ['$state', 'DataService', 'MenuService',
    function($state, DataService: DataService, MenuService) {
        this.msg = "Hello World!";

        this.$state = $state;
        this.schema = DataService.schema;
        this.menu = MenuService;
        //this.$mdMedia = $mdMedia;
        this.endpoints = DataService.getTable('endpoints');
        this.config = DataService.config;


        this.updateConfig = function() {
            DataService.updateConfig();
        };


        this.go = function(state) {
            if (angular.isString(state)) {
                $state.go(state);
            }
            else {
                $state.go(state.name, state.params);
            }
        };

        this.addEndpoint = function($event) {
            DataService.editRecord($event, '0', "endpoints");
        };

        this.addEndpointType = function($event) {
            DataService.editRecord($event, '0', "endpoint_types");
        };

        this.title = "DevCtrl";
        this.top = true;
    }
];