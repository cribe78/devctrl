import "angular";

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { UpgradeModule } from '@angular/upgrade/static';
import { AdminOnlyDirective } from "./ng1/admin-only.directive";
import {MenuService} from "./menu.service";
import {LogCtrl} from "./ng1/LogCtrl";

import {CtrlLogCtrl} from "./ng1/CtrlLogCtrl";
import {PanelControlSelectorCtrl} from "./ng1/PanelControlSelectorCtrl";
import {FkSelectDirective} from "./ng1/FkSelectDirective";
import {Slider2dDirective} from "./ng1/Slider2dDirective";
import {ObjectEditorComponent} from "./ng1/object-editor.component";

import {DataService} from "./data.service";
import {FkAutocompleteComponent} from "./ng1/fk-autocomplete.component";

import "angular-animate";
import "angular-aria";
import "angular-material";
import "./ng1/toArrayFilter";
import {EndpointStatusComponent} from "./ng1/endpoint-status.component";
//import {ControlComponent} from "./ng1/control.component";
import {PanelComponent} from "./ng1/panel.component";
import {MenuComponent} from "./menu.component";
import {ToolbarComponent} from "./ng1/toolbar.component";
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import {RecordEditorService} from "./record-editor.service";
import {TableComponent} from "./ng1/table.component";
import {AppComponent} from "./app.component";
import {ControlComponent} from "./controls/control.component";
/**
*const platform = platformBrowserDynamic();
*platform.bootstrapModule(AppModule);
 * */

angular.module('DevCtrlApp',
    ['ngMaterial', 'angular-toArrayFilter'])
    .factory('DataService', downgradeInjectable(DataService))
    .factory('MenuService', downgradeInjectable(MenuService))
    .factory('RecordEditorService', downgradeInjectable(RecordEditorService))
    //.component('ctrl', ControlComponent)
    .component('devctrlTable', TableComponent)
    .directive('devctrlMenu',
        downgradeComponent({component: MenuComponent}) as angular.IDirectiveFactory)
    .directive('devctrlCtrl',
        downgradeComponent({component: ControlComponent}) as angular.IDirectiveFactory)
    .directive('devctrlApp',
        downgradeComponent({component: AppComponent}) as angular.IDirectiveFactory)
    //.directive('devctrlToolbar',
    //    downgradeComponent({component: ToolbarComponent}) as angular.IDirectiveFactory)
    .component('devctrlToolbar', ToolbarComponent)
    .component('devctrlPanel', PanelComponent)
    .directive('fkSelect', FkSelectDirective)
    .directive('devctrlSlider2d', Slider2dDirective)
    .component('devctrlObjectEditor', ObjectEditorComponent)
    .directive('devctrlAdminOnly', AdminOnlyDirective)
    .component('devctrlEndpointStatus', EndpointStatusComponent)
    .component('fkAutocomplete', FkAutocompleteComponent)
    .controller('PanelControlSelectorCtrl', PanelControlSelectorCtrl)
    .controller('LogCtrl', LogCtrl)
    .controller('CtrlLog', CtrlLogCtrl)
    //.component('devctrlTable', TableComponent)
    //.config(StateConfig)
    .run(function() {});



export let upgrade : UpgradeModule;

//upgradeAdapter.bootstrap(document.documentElement, ['DevCtrlApp']);
platformBrowserDynamic().bootstrapModule(AppModule).then(platformRef => {
    upgrade = platformRef.injector.get(UpgradeModule) as UpgradeModule;
    upgrade.bootstrap(document.documentElement, ['DevCtrlApp'], {strictDi: true});
});
