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
        this.menu = MenuService;
        this.schema = DataService.getSchemas();
        this.control_endpoints = DataService.getTable('control_endpoints');

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

        this.dataModel = DataService.dataModel;

        this.title = "DevCtrl";
        this.top = true;
    }
];