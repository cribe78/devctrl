import {CommonResolve} from "./CommonResolve";
import {LogResolve} from "./LogCtrl";
import {TableController} from "./table.controller";
import {EndpointsController} from "./endpoints.controller";
import {EndpointController} from "./endpoint.controller";

export let StateConfig = ['$stateProvider', '$locationProvider' , '$urlRouterProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $stateProvider
            .state('rooms', {
                url: '/rooms',
                scope: true,
                controller: 'RoomsCtrl',
                controllerAs: 'rooms',
                templateUrl: 'app/ng1/rooms.html',
                resolve: CommonResolve,
                data : {
                    title: 'Locations'
                }
            })
            .state('rooms.room', {
                url: '/:name',
                templateUrl: 'app/ng1/room.html',
                controller: 'RoomCtrl',
                controllerAs: 'room',
                data : {
                        listByName : 'rooms',
                        title : false
                }
            })
            .state('endpoints', {
                url: '/devices',
                template : EndpointsController.template,
                controller : EndpointsController,
                controllerAs : '$ctrl',
                resolve: CommonResolve,
                data : {
                    title : 'Devices'
                }
            })
            .state('endpoints.endpoint', {
                url: '/:id',
                template : EndpointController.template,
                controller: EndpointController,
                controllerAs: '$ctrl',
                data : {
                    listByName : 'endpoints',
                    title : false
                }
            })
            .state('config' , {
                url: '/config',
                scope: true,
                templateUrl: 'app/ng1/config.html',
                resolve : CommonResolve,
                data : {
                    title : 'Configuration'
                }
            })
            .state('config.data', {
                url: '/data',
                templateUrl: 'app/ng1/data.html',
                data : {
                    title : 'Data Tables'
                }
            })
            .state('config.log', {
                url: '/log',
                templateUrl: 'app/ng1/log.html',
                controller: 'LogCtrl',
                controllerAs: 'log',
                resolve: LogResolve,
                data: {
                    title : "Log Viewer"
                }
            })
            .state('config.data.table', {
                url: '/:name',
                template: TableController.template,
                controller: TableController,
                controllerAs: '$ctrl',
                data : {
                    title : "Table Editor",
                    cardClasses : "card-wide"
                }
            });

        $urlRouterProvider
            .when("/", "/rooms");

        $locationProvider.html5Mode(true);
    }];