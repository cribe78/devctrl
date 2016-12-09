import "angular";

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { UpgradeModule } from '@angular/upgrade/static';
import { AdminOnlyDirective } from "./ng1/admin-only.directive";
import {MenuService} from "./menu.service";
import {StateConfig} from "./ng1/StateConfig";
import {TableController} from "./ng1/table.controller";
import {LogCtrl} from "./ng1/LogCtrl";
import {RecordController} from "./ng1/record.controller";
import {CtrlLogCtrl} from "./ng1/CtrlLogCtrl";
import {PanelControlSelectorCtrl} from "./ng1/PanelControlSelectorCtrl";
import {FkSelectDirective} from "./ng1/FkSelectDirective";
import {Slider2dDirective} from "./ng1/Slider2dDirective";
import {ObjectEditorComponent} from "./ng1/object-editor.component";

import {MainCtrl} from "./ng1/MainCtrl";
import {EndpointController} from "./ng1/endpoint.controller";
import {RoomController} from "./ng1/room.controller"
import {RoomsController} from "./ng1/rooms.controller";
import {DataService} from "./data.service";
import {FkAutocompleteComponent} from "./ng1/fk-autocomplete.component";

import "angular-animate";
import "angular-aria";
import "angular-material";
import "angular-ui-router";
import "./socket";
import "./ng1/toArrayFilter";
import {EndpointStatusComponent} from "./ng1/endpoint-status.component";
import {ControlComponent} from "./ng1/control.component";
import {EndpointsController} from "./ng1/endpoints.controller";
import {PanelComponent} from "./ng1/panel.component";
import {MenuComponent} from "./menu.component";
import {ToolbarComponent} from "./ng1/toolbar.component";
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
/**
*const platform = platformBrowserDynamic();
*platform.bootstrapModule(AppModule);
 * */

angular.module('DevCtrlApp',
    ['ui.router', 'ngMaterial', 'btford.socket-io', 'angular-toArrayFilter'])
    .service('DataService', DataService)
    .factory('MenuService', downgradeInjectable(MenuService))
    .component('ctrl', ControlComponent)
    .directive('devctrlMenu',
        downgradeComponent({component: MenuComponent}) as angular.IDirectiveFactory)
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

    .controller('MainCtrl', MainCtrl)
    .controller('PanelControlSelectorCtrl', PanelControlSelectorCtrl)
    .controller('EndpointCtrl', EndpointController)
    .controller('LogCtrl', LogCtrl)
    .controller('CtrlLog', CtrlLogCtrl)
    .controller('TableCtrl', TableController)
    .controller('RecordController', RecordController)
    .controller('RoomCtrl', RoomController)
    .controller('RoomsCtrl', RoomsController)
    .controller('EndpointsCtrl', EndpointsController)
    .config(StateConfig)
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


//export const upgradeAdapter = new UpgradeAdapter(AppModule);

//upgradeAdapter.bootstrap(document.documentElement, ['DevCtrlApp']);
platformBrowserDynamic().bootstrapModule(AppModule).then(platformRef => {
    const upgrade = platformRef.injector.get(UpgradeModule) as UpgradeModule;
    upgrade.bootstrap(document.documentElement, ['DevCtrlApp'], {strictDi: true});
});
