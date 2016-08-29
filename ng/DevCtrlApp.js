goog.provide("DevCtrl.App");
goog.require("DevCtrl.MainCtrl");
goog.require("DevCtrl.stateConfig");
goog.require("DevCtrl.DataService.factory");
goog.require("DevCtrl.MenuService.factory");
goog.require("DevCtrl.AdminOnly.Directive");
goog.require("DevCtrl.Ctrl.Directive");
goog.require("DevCtrl.Menu.Directive");
goog.require("DevCtrl.FkSelect.Directive");
goog.require("DevCtrl.EndpointStatus.Directive");
goog.require("DevCtrl.EnumSelect.Directive");
goog.require("DevCtrl.EnumEditor.Ctrl");
goog.require("DevCtrl.Log.Ctrl");
goog.require("DevCtrl.ObjectEditor.Directive");
goog.require("DevCtrl.Panel.Directive");
goog.require("DevCtrl.Slider2d.Directive");
goog.require("DevCtrl.Toolbar.Directive");
goog.require("DevCtrl.Table.Ctrl");
goog.require("DevCtrl.Table.Resolve");
goog.require("DevCtrl.PanelControlSelector.Ctrl");
goog.require("DevCtrl.CtrlLog.Ctrl");
goog.require("DevCtrl.Endpoint.Ctrl");
goog.require("DevCtrl.Record.Ctrl");
goog.require("DevCtrl.Room.Ctrl");
goog.require("DevCtrl.Rooms.Ctrl");
goog.require("DevCtrl.Common.Resolve");

DevCtrl.App = angular.module('DevCtrlApp', ['ui.router', 'ngMaterial', 'btford.socket-io', 'angular-toArrayFilter'])
    .factory('DataService', DevCtrl.DataService.factory)
    .factory('MenuService', DevCtrl.MenuService.factory)
    .directive('ctrl', DevCtrl.Ctrl.Directive)
    .directive('coeMenu', DevCtrl.Menu.Directive)
    .directive('devctrlPanel', DevCtrl.Panel.Directive)
    .directive('fkSelect', DevCtrl.FkSelect.Directive)
    .directive('enumSelect', DevCtrl.EnumSelect.Directive)
    .directive('devctrlSlider2d', DevCtrl.Slider2d.Directive)
    .directive('devctrlObjectEditor', DevCtrl.ObjectEditor.Directive)
    .directive('devctrlAdminOnly', DevCtrl.AdminOnly.Directive)
    .directive('devctrlEndpointStatus', DevCtrl.EndpointStatus.Directive)
    .directive('devctrlToolbar', DevCtrl.Toolbar.Directive)
    .controller('MainCtrl', DevCtrl.MainCtrl)
    .controller('EnumEditorCtrl', DevCtrl.EnumEditor.Ctrl)
    .controller('PanelControlSelectorCtrl', DevCtrl.PanelControlSelector.Ctrl)
    .controller('EndpointCtrl', DevCtrl.Endpoint.Ctrl)
    .controller('LogCtrl', DevCtrl.Log.Ctrl)
    .controller('CtrlLog', DevCtrl.CtrlLog.Ctrl)
    .controller('TableCtrl', DevCtrl.Table.Ctrl)
    .controller('RecordCtrl', DevCtrl.Record.Ctrl)
    .controller('RoomCtrl', DevCtrl.Room.Ctrl)
    .controller('RoomsCtrl', DevCtrl.Rooms.Ctrl)
    .config(DevCtrl.stateConfig)

//state change debugging
    .run (['$rootScope', function($rootScope) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            //console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
            console.log('$stateChangeError - fired when an error occurs during transition.');
            console.log(arguments);
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            //console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
        });

        $rootScope.$on('$viewContentLoaded', function (event) {
            //console.log('$viewContentLoaded - fired after dom rendered', event);
        });

        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
            console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
            console.log(unfoundState, fromState, fromParams);
        })
    }]);



