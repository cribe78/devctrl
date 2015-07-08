goog.provide('DevCtrl.stateConfig');

DevCtrl.stateConfig = ['$stateProvider', '$locationProvider' , '$urlRouterProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $stateProvider
            .state('rooms', {
                url: '/rooms',
                scope: true,
                controller: function($scope, $state) {
                    this.foo = "bar";
                    this.$state = $state;
                },
                controllerAs: 'roomsCtrl',
                templateUrl: 'ng/locations.html',
                resolve : {
                    state : '$state',
                },
                data : {
                    title: 'Locations'
                }
            })
            .state('rooms.room', {
                url: '/:name',
                templateUrl: 'ng/room.html',
                controller: 'RoomCtrl',
                controllerAs: 'room',
                resolve: DevCtrl.Room.Resolve,
                data : {
                        listByName : 'rooms'
                }
            })
            .state('config' , {
                'abstract': true,
                url: '/config',
                template: '<ui-view />',
                data : {
                    title : 'Configuration'
                }
            })
            .state('config.data', {
                url: '/data',
                templateUrl: 'ng/data.html',
                resolve : {
                    $state : '$state'
                },
                data : {
                    title : 'Table Data'
                }
            })
            .state('config.data.table', {
                url: '/:table',
                templateUrl: 'ng/tableeditor.html',
                controller: 'TableCtrl',
                controllerAs: 'table',
                resolve: DevCtrl.Table.Resolve
            });

        $urlRouterProvider
            .when("/", "/rooms");

        $locationProvider.html5Mode(true);
    }];