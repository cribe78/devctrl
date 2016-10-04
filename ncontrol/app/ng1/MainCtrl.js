"use strict";
exports.MainCtrl = ['$state', '$mdMedia', 'DataService', 'MenuService',
    function ($state, $mdMedia, DataService, MenuService) {
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
        this.$mdMedia = $mdMedia;
        this.endpoints = DataService.getTable('endpoints');
        this.config = DataService.config;
        this.user = DataService.dataModel.user;
        this.updateConfig = function () {
            DataService.updateConfig();
        };
        this.go = function (state) {
            if (angular.isString(state)) {
                $state.go(state);
            }
            else {
                $state.go(state.name, state.params);
            }
        };
        this.addEndpoint = function ($event) {
            DataService.editRecord($event, '0', "endpoints");
        };
        this.addEndpointType = function ($event) {
            DataService.editRecord($event, '0', "endpoint_types");
        };
        this.dataModel = DataService.dataModel;
        this.title = "DevCtrl";
        this.top = true;
    }
];
//# sourceMappingURL=MainCtrl.js.map