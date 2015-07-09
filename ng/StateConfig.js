goog.provide('DevCtrl.stateConfig');

DevCtrl.stateConfig = ['$stateProvider', '$locationProvider' , '$urlRouterProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $stateProvider
            .state('rooms', {
                url: '/rooms',
                scope: true,
                controller: 'RoomsCtrl',
                controllerAs: 'rooms',
                templateUrl: 'ng/locations.html',
                resolve: DevCtrl.Common.Resolve,
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
                resolve: DevCtrl.Common.Resolve,
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
                    listByName : 'control_endpoints',
                    title : false
                }
            })
            .state('config' , {
                url: '/config',
                scope: true,
                templateUrl: 'ng/config.html',
                resolve : DevCtrl.Common.Resolve,
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
            .state('config.data.table', {
                url: '/:name',
                templateUrl: 'ng/tableeditor.html',
                controller: 'TableCtrl',
                controllerAs: 'table',
                resolve: DevCtrl.Table.Resolve,
                data : {
                    title : "Table Editor"
                }
            });

        $urlRouterProvider
            .when("/", "/rooms");

        $locationProvider.html5Mode(true);
    }];