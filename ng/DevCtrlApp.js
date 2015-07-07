goog.provide("DevCtrl.App");
goog.require("DevCtrl.MainCtrl");
goog.require("DevCtrl.stateConfig");
goog.require("DevCtrl.DataService.factory");
goog.require("DevCtrl.MenuService.factory");
goog.require("DevCtrl.Ctrl.Directive");
goog.require("DevCtrl.Menu.Directive");
goog.require("DevCtrl.FkSelect.Directive");
goog.require("DevCtrl.EnumSelect.Directive");
goog.require("DevCtrl.SwitchSet.Directive");
goog.require("DevCtrl.Table.Ctrl");
goog.require("DevCtrl.Table.Resolve");
goog.require("DevCtrl.Record.Ctrl");
goog.require("DevCtrl.Record.Resolve");
goog.require("DevCtrl.Room.Ctrl");
goog.require("DevCtrl.Room.Resolve");

DevCtrl.App = angular.module('DevCtrlApp', ['ui.router', 'ngMaterial', 'btford.socket-io'])
    .factory('DataService', DevCtrl.DataService.factory)
    .factory('MenuService', DevCtrl.MenuService.factory)
    .directive('ctrl', DevCtrl.Ctrl.Directive)
    .directive('coeMenu', DevCtrl.Menu.Directive)
    .directive('fkSelect', DevCtrl.FkSelect.Directive)
    .directive('enumSelect', DevCtrl.EnumSelect.Directive)
    .directive('switchSet', DevCtrl.SwitchSet.Directive)
    .controller('MainCtrl', DevCtrl.MainCtrl)
    .controller('TableCtrl', DevCtrl.Table.Ctrl)
    .controller('RecordCtrl', DevCtrl.Record.Ctrl)
    .controller('RoomCtrl', DevCtrl.Room.Ctrl)
    .config(DevCtrl.stateConfig)


    .run (['$rootScope', function($rootScope) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
            console.log('$stateChangeError - fired when an error occurs during transition.');
            console.log(arguments);
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
        });

        $rootScope.$on('$viewContentLoaded', function (event) {
            console.log('$viewContentLoaded - fired after dom rendered', event);
        });

        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
            console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
            console.log(unfoundState, fromState, fromParams);
        })
    }]);



