"use strict";
require("angular");
var app_module_1 = require('./app.module');
var upgrade_1 = require('@angular/upgrade');
var admin_only_directive_1 = require("./ng1/admin-only.directive");
var MenuService_1 = require("./ng1/MenuService");
var StateConfig_1 = require("./ng1/StateConfig");
var CtrlDirective_1 = require("./ng1/CtrlDirective");
var TableCtrl_1 = require("./ng1/TableCtrl");
var LogCtrl_1 = require("./ng1/LogCtrl");
var RecordCtrl_1 = require("./ng1/RecordCtrl");
var EnumEditorCtrl_1 = require("./ng1/EnumEditorCtrl");
var CtrlLogCtrl_1 = require("./ng1/CtrlLogCtrl");
var MenuDirective_1 = require("./ng1/MenuDirective");
var PanelDirective_1 = require("./ng1/PanelDirective");
var PanelControlSelectorCtrl_1 = require("./ng1/PanelControlSelectorCtrl");
var FkSelectDirective_1 = require("./ng1/FkSelectDirective");
var EnumSelectDirective_1 = require("./ng1/EnumSelectDirective");
var Slider2dDirective_1 = require("./ng1/Slider2dDirective");
var ObjectEditorDirective_1 = require("./ng1/ObjectEditorDirective");
var ToolbarDirective_1 = require("./ng1/ToolbarDirective");
var MainCtrl_1 = require("./ng1/MainCtrl");
var EndpointCtrl_1 = require("./ng1/EndpointCtrl");
var RoomCtrl_1 = require("./ng1/RoomCtrl");
var RoomsCtrl_1 = require("./ng1/RoomsCtrl");
var data_service_1 = require("./data.service");
require("angular-animate");
require("angular-aria");
require("angular-material");
require("angular-ui-router");
require("./socket");
require("./ng1/toArrayFilter");
var endpoint_status_component_1 = require("./ng1/endpoint-status.component");
/**
*const platform = platformBrowserDynamic();
*platform.bootstrapModule(AppModule);
 * */
angular.module('DevCtrlApp', ['ui.router', 'ngMaterial', 'btford.socket-io', 'angular-toArrayFilter'])
    .service('DataService', data_service_1.DataService)
    .factory('MenuService', MenuService_1.MenuServiceFactory)
    .directive('ctrl', CtrlDirective_1.CtrlDirective)
    .directive('coeMenu', MenuDirective_1.MenuDirective)
    .directive('devctrlPanel', PanelDirective_1.PanelDirective)
    .directive('fkSelect', FkSelectDirective_1.FkSelectDirective)
    .directive('enumSelect', EnumSelectDirective_1.EnumSelectDirective)
    .directive('devctrlSlider2d', Slider2dDirective_1.Slider2dDirective)
    .directive('devctrlObjectEditor', ObjectEditorDirective_1.ObjectEditorDirective)
    .directive('devctrlAdminOnly', admin_only_directive_1.AdminOnlyDirective)
    .component('devctrlEndpointStatus', endpoint_status_component_1.EndpointStatusComponent)
    .directive('devctrlToolbar', ToolbarDirective_1.ToolbarDirective)
    .controller('MainCtrl', MainCtrl_1.MainCtrl)
    .controller('EnumEditorCtrl', EnumEditorCtrl_1.EnumEditorCtrl)
    .controller('PanelControlSelectorCtrl', PanelControlSelectorCtrl_1.PanelControlSelectorCtrl)
    .controller('EndpointCtrl', EndpointCtrl_1.EndpointCtrl)
    .controller('LogCtrl', LogCtrl_1.LogCtrl)
    .controller('CtrlLog', CtrlLogCtrl_1.CtrlLogCtrl)
    .controller('TableCtrl', TableCtrl_1.TableCtrl)
    .controller('RecordCtrl', RecordCtrl_1.RecordCtrl)
    .controller('RoomCtrl', RoomCtrl_1.RoomCtrl)
    .controller('RoomsCtrl', RoomsCtrl_1.RoomsCtrl)
    .config(StateConfig_1.StateConfig)
    .run(['$rootScope', function ($rootScope) {
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
        });
    }]);
exports.upgradeAdapter = new upgrade_1.UpgradeAdapter(app_module_1.AppModule);
exports.upgradeAdapter.bootstrap(document.documentElement, ['DevCtrlApp']);
//# sourceMappingURL=main.js.map