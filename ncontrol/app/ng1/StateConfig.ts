import {TableResolve} from "./TableCtrl";
import {CommonResolve} from "./CommonResolve";
import {LogResolve} from "./LogCtrl";

export let StateConfig = ['$stateProvider', '$locationProvider' , '$urlRouterProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $stateProvider
            .state('rooms', {
                url: '/rooms',
                scope: true,
                controller: 'RoomsCtrl',
                controllerAs: 'rooms',
                templateUrl: 'ng/locations.html',
                resolve: CommonResolve,
                data : {
                    title: 'Locations'
                }
            })
            .state('rooms.room', {
                url: '/:name',
                templateUrl: 'ng/room.html',
                controller: 'RoomCtrl',
                controllerAs: 'room',
                data : {
                        listByName : 'rooms',
                        title : false
                }
            })
            .state('endpoints', {
                url: '/devices',
                templateUrl : 'ng/endpoints.html',
                resolve: CommonResolve,
                data : {
                    title : 'Devices'
                }
            })
            .state('endpoints.endpoint', {
                url: '/:id',
                templateUrl : 'ng/endpoint.html',
                controller: 'EndpointCtrl',
                controllerAs: 'endpoint',
                data : {
                    listByName : 'endpoints',
                    title : false
                }
            })
            .state('config' , {
                url: '/config',
                scope: true,
                templateUrl: 'ng/config.html',
                resolve : CommonResolve,
                data : {
                    title : 'Configuration'
                }
            })
            .state('config.data', {
                url: '/data',
                templateUrl: 'ng/data.html',
                data : {
                    title : 'Data Tables'
                }
            })
            .state('config.log', {
                url: '/log',
                templateUrl: 'ng/log.html',
                controller: 'LogCtrl',
                controllerAs: 'log',
                resolve: LogResolve,
                data: {
                    title : "Log Viewer"
                }
            })
            .state('config.data.table', {
                url: '/:name',
                templateUrl: 'ng/tableeditor.html',
                controller: 'TableCtrl',
                controllerAs: 'table',
                resolve: TableResolve,
                data : {
                    title : "Table Editor"
                }
            });

        $urlRouterProvider
            .when("/", "/rooms");

        $locationProvider.html5Mode(true);
    }];