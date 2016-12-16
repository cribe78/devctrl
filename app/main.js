"use strict";
require("angular");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var app_module_1 = require("./app.module");
var static_1 = require("@angular/upgrade/static");
var admin_only_directive_1 = require("./ng1/admin-only.directive");
var menu_service_1 = require("./menu.service");
var LogCtrl_1 = require("./ng1/LogCtrl");
var CtrlLogCtrl_1 = require("./ng1/CtrlLogCtrl");
var PanelControlSelectorCtrl_1 = require("./ng1/PanelControlSelectorCtrl");
var FkSelectDirective_1 = require("./ng1/FkSelectDirective");
var Slider2dDirective_1 = require("./ng1/Slider2dDirective");
var object_editor_component_1 = require("./ng1/object-editor.component");
var data_service_1 = require("./data.service");
var fk_autocomplete_component_1 = require("./ng1/fk-autocomplete.component");
require("angular-animate");
require("angular-aria");
require("angular-material");
require("./ng1/toArrayFilter");
var endpoint_status_component_1 = require("./ng1/endpoint-status.component");
var control_component_1 = require("./ng1/control.component");
var panel_component_1 = require("./ng1/panel.component");
var menu_component_1 = require("./menu.component");
var toolbar_component_1 = require("./ng1/toolbar.component");
var static_2 = require("@angular/upgrade/static");
var record_editor_service_1 = require("./record-editor.service");
var table_component_1 = require("./ng1/table.component");
var app_component_1 = require("./app.component");
/**
*const platform = platformBrowserDynamic();
*platform.bootstrapModule(AppModule);
 * */
angular.module('DevCtrlApp', ['ngMaterial', 'angular-toArrayFilter'])
    .factory('DataService', static_2.downgradeInjectable(data_service_1.DataService))
    .factory('MenuService', static_2.downgradeInjectable(menu_service_1.MenuService))
    .factory('RecordEditorService', static_2.downgradeInjectable(record_editor_service_1.RecordEditorService))
    .component('ctrl', control_component_1.ControlComponent)
    .component('devctrlTable', table_component_1.TableComponent)
    .directive('devctrlMenu', static_2.downgradeComponent({ component: menu_component_1.MenuComponent }))
    .directive('devctrlApp', static_2.downgradeComponent({ component: app_component_1.AppComponent }))
    .component('devctrlToolbar', toolbar_component_1.ToolbarComponent)
    .component('devctrlPanel', panel_component_1.PanelComponent)
    .directive('fkSelect', FkSelectDirective_1.FkSelectDirective)
    .directive('devctrlSlider2d', Slider2dDirective_1.Slider2dDirective)
    .component('devctrlObjectEditor', object_editor_component_1.ObjectEditorComponent)
    .directive('devctrlAdminOnly', admin_only_directive_1.AdminOnlyDirective)
    .component('devctrlEndpointStatus', endpoint_status_component_1.EndpointStatusComponent)
    .component('fkAutocomplete', fk_autocomplete_component_1.FkAutocompleteComponent)
    .controller('PanelControlSelectorCtrl', PanelControlSelectorCtrl_1.PanelControlSelectorCtrl)
    .controller('LogCtrl', LogCtrl_1.LogCtrl)
    .controller('CtrlLog', CtrlLogCtrl_1.CtrlLogCtrl)
    .run(function () { });
//upgradeAdapter.bootstrap(document.documentElement, ['DevCtrlApp']);
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule).then(function (platformRef) {
    exports.upgrade = platformRef.injector.get(static_1.UpgradeModule);
    exports.upgrade.bootstrap(document.documentElement, ['DevCtrlApp'], { strictDi: true });
});
//# sourceMappingURL=main.js.map