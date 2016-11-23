"use strict";
require("angular");
var app_module_1 = require('./app.module');
var upgrade_1 = require('@angular/upgrade');
var admin_only_directive_1 = require("./ng1/admin-only.directive");
var menu_service_1 = require("./ng1/menu.service");
var StateConfig_1 = require("./ng1/StateConfig");
var table_controller_1 = require("./ng1/table.controller");
var LogCtrl_1 = require("./ng1/LogCtrl");
var record_controller_1 = require("./ng1/record.controller");
var CtrlLogCtrl_1 = require("./ng1/CtrlLogCtrl");
var MenuDirective_1 = require("./ng1/MenuDirective");
var PanelDirective_1 = require("./ng1/PanelDirective");
var PanelControlSelectorCtrl_1 = require("./ng1/PanelControlSelectorCtrl");
var FkSelectDirective_1 = require("./ng1/FkSelectDirective");
var Slider2dDirective_1 = require("./ng1/Slider2dDirective");
var object_editor_component_1 = require("./ng1/object-editor.component");
var ToolbarDirective_1 = require("./ng1/ToolbarDirective");
var MainCtrl_1 = require("./ng1/MainCtrl");
var endpoint_controller_1 = require("./ng1/endpoint.controller");
var room_controller_1 = require("./ng1/room.controller");
var rooms_controller_1 = require("./ng1/rooms.controller");
var data_service_1 = require("./data.service");
var fk_autocomplete_component_1 = require("./ng1/fk-autocomplete.component");
require("angular-animate");
require("angular-aria");
require("angular-material");
require("angular-ui-router");
require("./socket");
require("./ng1/toArrayFilter");
var endpoint_status_component_1 = require("./ng1/endpoint-status.component");
var control_component_1 = require("./ng1/control.component");
var endpoints_controller_1 = require("./ng1/endpoints.controller");
/**
*const platform = platformBrowserDynamic();
*platform.bootstrapModule(AppModule);
 * */
angular.module('DevCtrlApp', ['ui.router', 'ngMaterial', 'btford.socket-io', 'angular-toArrayFilter'])
    .service('DataService', data_service_1.DataService)
    .service('MenuService', menu_service_1.MenuService)
    .component('ctrl', control_component_1.ControlComponent)
    .directive('coeMenu', MenuDirective_1.MenuDirective)
    .directive('devctrlPanel', PanelDirective_1.PanelDirective)
    .directive('fkSelect', FkSelectDirective_1.FkSelectDirective)
    .directive('devctrlSlider2d', Slider2dDirective_1.Slider2dDirective)
    .component('devctrlObjectEditor', object_editor_component_1.ObjectEditorComponent)
    .directive('devctrlAdminOnly', admin_only_directive_1.AdminOnlyDirective)
    .component('devctrlEndpointStatus', endpoint_status_component_1.EndpointStatusComponent)
    .component('fkAutocomplete', fk_autocomplete_component_1.FkAutocompleteComponent)
    .directive('devctrlToolbar', ToolbarDirective_1.ToolbarDirective)
    .controller('MainCtrl', MainCtrl_1.MainCtrl)
    .controller('PanelControlSelectorCtrl', PanelControlSelectorCtrl_1.PanelControlSelectorCtrl)
    .controller('EndpointCtrl', endpoint_controller_1.EndpointController)
    .controller('LogCtrl', LogCtrl_1.LogCtrl)
    .controller('CtrlLog', CtrlLogCtrl_1.CtrlLogCtrl)
    .controller('TableCtrl', table_controller_1.TableController)
    .controller('RecordController', record_controller_1.RecordController)
    .controller('RoomCtrl', room_controller_1.RoomController)
    .controller('RoomsCtrl', rooms_controller_1.RoomsController)
    .controller('EndpointsCtrl', endpoints_controller_1.EndpointsController)
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