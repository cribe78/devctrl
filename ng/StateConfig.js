goog.provide('DevCtrl.stateConfig');

DevCtrl.stateConfig = ['$stateProvider', '$locationProvider' , '$urlRouterProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $stateProvider
            .state('root', {
                'abstract': true,
                url: '',
                template: '<ui-view />'
            })
            .state('root.rooms', {
                url: '/rooms',
                templateUrl: 'ng/locations.html'
            })
            .state('root.room', {
                url: '/room/:name',
                templateUrl: 'ng/room.html',
                controller: 'RoomCtrl',
                controllerAs: 'room',
                resolve: DevCtrl.Room.Resolve
            })
            .state('root.config' , {
                'abstract': true,
                url: '/config',
                template: '<ui-view />'
            })
            .state('root.config.all', {
                url: '',
                templateUrl: 'ng/config.html'
            })
            .state('root.config.table', {
                url: '/:table',
                templateUrl: 'ng/tableeditor.html',
                controller: 'TableCtrl',
                controllerAs: 'table',
                resolve: DevCtrl.Table.Resolve
            });

        $urlRouterProvider
            .when("/", "/locations");

        $locationProvider.html5Mode(true);
    }];