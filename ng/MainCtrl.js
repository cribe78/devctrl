goog.provide("DevCtrl.MainCtrl");

DevCtrl.MainCtrl = ['$state', '$mdSidenav', 'DataService',
    function($state, $mdSidenav, DataService) {
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

        this.menu = DataService.getMenu();
        this.schema = DataService.getSchemas();

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
    }
];