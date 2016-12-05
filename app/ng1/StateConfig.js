"use strict";
var CommonResolve_1 = require("./CommonResolve");
var LogCtrl_1 = require("./LogCtrl");
var table_controller_1 = require("./table.controller");
var endpoints_controller_1 = require("./endpoints.controller");
var endpoint_controller_1 = require("./endpoint.controller");
exports.StateConfig = ['$stateProvider', '$locationProvider', '$urlRouterProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $stateProvider
            .state('rooms', {
            url: '/rooms',
            scope: true,
            controller: 'RoomsCtrl',
            controllerAs: 'rooms',
            templateUrl: 'app/ng1/rooms.html',
            resolve: CommonResolve_1.CommonResolve,
            data: {
                title: 'Locations'
            }
        })
            .state('rooms.room', {
            url: '/:name',
            templateUrl: 'app/ng1/room.html',
            controller: 'RoomCtrl',
            controllerAs: 'room',
            data: {
                listByName: 'rooms',
                title: false
            }
        })
            .state('endpoints', {
            url: '/devices',
            template: endpoints_controller_1.EndpointsController.template,
            controller: endpoints_controller_1.EndpointsController,
            controllerAs: '$ctrl',
            resolve: CommonResolve_1.CommonResolve,
            data: {
                title: 'Devices'
            }
        })
            .state('endpoints.endpoint', {
            url: '/:id',
            template: endpoint_controller_1.EndpointController.template,
            controller: endpoint_controller_1.EndpointController,
            controllerAs: '$ctrl',
            data: {
                listByName: 'endpoints',
                title: false
            }
        })
            .state('config', {
            url: '/config',
            scope: true,
            templateUrl: 'app/ng1/config.html',
            resolve: CommonResolve_1.CommonResolve,
            data: {
                title: 'Configuration'
            }
        })
            .state('config.data', {
            url: '/data',
            templateUrl: 'app/ng1/data.html',
            data: {
                title: 'Data Tables'
            }
        })
            .state('config.log', {
            url: '/log',
            templateUrl: 'app/ng1/log.html',
            controller: 'LogCtrl',
            controllerAs: 'log',
            resolve: LogCtrl_1.LogResolve,
            data: {
                title: "Log Viewer"
            }
        })
            .state('config.data.table', {
            url: '/:name',
            template: table_controller_1.TableController.template,
            controller: table_controller_1.TableController,
            controllerAs: '$ctrl',
            data: {
                title: "Table Editor",
                cardClasses: "card-wide"
            }
        });
        $urlRouterProvider
            .when("/", "/rooms");
        $locationProvider.html5Mode(true);
    }];
//# sourceMappingURL=StateConfig.js.map