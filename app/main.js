"use strict";
require("angular");
const platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
const app_module_1 = require("./app.module");
const static_1 = require("@angular/upgrade/static");
const admin_only_directive_1 = require("./ng1/admin-only.directive");
const menu_service_1 = require("./menu.service");
const StateConfig_1 = require("./ng1/StateConfig");
const table_controller_1 = require("./ng1/table.controller");
const LogCtrl_1 = require("./ng1/LogCtrl");
const record_controller_1 = require("./ng1/record.controller");
const CtrlLogCtrl_1 = require("./ng1/CtrlLogCtrl");
const PanelControlSelectorCtrl_1 = require("./ng1/PanelControlSelectorCtrl");
const FkSelectDirective_1 = require("./ng1/FkSelectDirective");
const Slider2dDirective_1 = require("./ng1/Slider2dDirective");
const object_editor_component_1 = require("./ng1/object-editor.component");
const MainCtrl_1 = require("./ng1/MainCtrl");
const endpoint_controller_1 = require("./ng1/endpoint.controller");
const room_controller_1 = require("./ng1/room.controller");
const rooms_controller_1 = require("./ng1/rooms.controller");
const data_service_1 = require("./data.service");
const fk_autocomplete_component_1 = require("./ng1/fk-autocomplete.component");
require("angular-animate");
require("angular-aria");
require("angular-material");
require("angular-ui-router");
require("./socket");
require("./ng1/toArrayFilter");
const endpoint_status_component_1 = require("./ng1/endpoint-status.component");
const control_component_1 = require("./ng1/control.component");
const endpoints_controller_1 = require("./ng1/endpoints.controller");
const panel_component_1 = require("./ng1/panel.component");
const menu_component_1 = require("./menu.component");
const toolbar_component_1 = require("./ng1/toolbar.component");
const static_2 = require("@angular/upgrade/static");
/**
*const platform = platformBrowserDynamic();
*platform.bootstrapModule(AppModule);
 * */
angular.module('DevCtrlApp', ['ui.router', 'ngMaterial', 'btford.socket-io', 'angular-toArrayFilter'])
    .factory('DataService', static_2.downgradeInjectable(data_service_1.DataService))
    .factory('MenuService', static_2.downgradeInjectable(menu_service_1.MenuService))
    .component('ctrl', control_component_1.ControlComponent)
    .directive('devctrlMenu', static_2.downgradeComponent({ component: menu_component_1.MenuComponent }))
    .component('devctrlToolbar', toolbar_component_1.ToolbarComponent)
    .component('devctrlPanel', panel_component_1.PanelComponent)
    .directive('fkSelect', FkSelectDirective_1.FkSelectDirective)
    .directive('devctrlSlider2d', Slider2dDirective_1.Slider2dDirective)
    .component('devctrlObjectEditor', object_editor_component_1.ObjectEditorComponent)
    .directive('devctrlAdminOnly', admin_only_directive_1.AdminOnlyDirective)
    .component('devctrlEndpointStatus', endpoint_status_component_1.EndpointStatusComponent)
    .component('fkAutocomplete', fk_autocomplete_component_1.FkAutocompleteComponent)
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
//export const upgradeAdapter = new UpgradeAdapter(AppModule);
//upgradeAdapter.bootstrap(document.documentElement, ['DevCtrlApp']);
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule).then(platformRef => {
    const upgrade = platformRef.injector.get(static_1.UpgradeModule);
    upgrade.bootstrap(document.documentElement, ['DevCtrlApp'], { strictDi: true });
});
//# sourceMappingURL=main.js.map