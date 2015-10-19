goog.provide("DevCtrl.MainCtrl");

DevCtrl.MainCtrl = ['$state', '$mdSidenav', 'DataService', 'MenuService',
    function($state, $mdSidenav, DataService, MenuService) {
        this.msg = "Hello World!";
        this.tiles = [
            {
                img: "/images/orc.png"
            },
            {
                img: "/images/pict.png"
            },
            {
                img: "/images/sage.png"
            }
        ];

        this.$state = $state;
        this.schema = DataService.schema;
        this.menu = MenuService;
        this.control_endpoints = DataService.getTable('control_endpoints');
        this.config = DataService.config;

        this.updateConfig = function() {
            DataService.updateConfig();
        };

        this.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
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
            DataService.editRecord($event, 0, "control_endpoints");
        };

        this.addEndpointType = function($event) {
            DataService.editRecord($event, 0, "endpoint_types");
        };

        this.dataModel = DataService.dataModel;

        this.title = "DevCtrl";
        this.top = true;

        this.adminEnabled = function() {
            return DataService.isAdminAuthorized();
        };

        this.adminLogin = function() {
            DataService.getAdminAuth();
        };
    }
];