import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { UpgradeAdapter } from '@angular/upgrade';
import { AdminOnlyDirective } from "./ng1/admin-only.directive";
import {DataServiceFactory} from "./ng1/DataService";
import {MenuServiceFactory} from "./ng1/MenuService";
import {StateConfig} from "./ng1/StateConfig";
import {CtrlDirective} from "./ng1/CtrlDirective";
import {TableCtrl} from "./ng1/TableCtrl";
import {LogCtrl} from "./ng1/LogCtrl";
import {RecordCtrl} from "./ng1/RecordCtrl";
import {EnumEditorCtrl} from "./ng1/EnumEditorCtrl";
import {CtrlLogCtrl} from "./ng1/CtrlLogCtrl";
import {MenuDirective} from "./ng1/MenuDirective";
import {PanelDirective} from "./ng1/PanelDirective";
import {PanelControlSelectorCtrl} from "./ng1/PanelControlSelectorCtrl";
import {FkSelectDirective} from "./ng1/FkSelectDirective";
import {EnumSelectDirective} from "./ng1/EnumSelectDirective";
import {Slider2dDirective} from "./ng1/Slider2dDirective";
import {ObjectEditorDirective} from "./ng1/ObjectEditorDirective";
import {EndpointStatusDirective} from "./ng1/EndpointStatusDirective";
import {ToolbarDirective} from "./ng1/ToolbarDirective";
import {MainCtrl} from "./ng1/MainCtrl";
import {EndpointCtrl} from "./ng1/EndpointCtrl";
import {RoomCtrl} from "./ng1/RoomCtrl";
import {RoomsCtrl} from "./ng1/RoomsCtrl";
import {DataService2} from "./ds2.service";

import "angular-animate";
import "angular-aria";
import "angular-material";
import "angular-ui-router";
import "./socket";
import "./ng1/toArrayFilter";

/**
*const platform = platformBrowserDynamic();
*platform.bootstrapModule(AppModule);
 * */


angular.module('DevCtrlApp',
    ['ui.router', 'ngMaterial', 'btford.socket-io', 'angular-toArrayFilter'])
    .factory('DataService', DataServiceFactory)
    .service('DataService2', DataService2)
    .factory('MenuService', MenuServiceFactory)
    .directive('ctrl', CtrlDirective)
    .directive('coeMenu', MenuDirective)
    .directive('devctrlPanel', PanelDirective)
    .directive('fkSelect', FkSelectDirective)
    .directive('enumSelect', EnumSelectDirective)
    .directive('devctrlSlider2d', Slider2dDirective)
    .directive('devctrlObjectEditor', ObjectEditorDirective)
    .directive('devctrlAdminOnly', AdminOnlyDirective)
    .directive('devctrlEndpointStatus', EndpointStatusDirective)
    .directive('devctrlToolbar', ToolbarDirective)
    .controller('MainCtrl', MainCtrl)
    .controller('EnumEditorCtrl', EnumEditorCtrl)
    .controller('PanelControlSelectorCtrl', PanelControlSelectorCtrl)
    .controller('EndpointCtrl', EndpointCtrl)
    .controller('LogCtrl', LogCtrl)
    .controller('CtrlLog', CtrlLogCtrl)
    .controller('TableCtrl', TableCtrl)
    .controller('RecordCtrl', RecordCtrl)
    .controller('RoomCtrl', RoomCtrl)
    .controller('RoomsCtrl', RoomsCtrl)
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


export const upgradeAdapter = new UpgradeAdapter(AppModule);

upgradeAdapter.bootstrap(document.documentElement, ['DevCtrlApp']);