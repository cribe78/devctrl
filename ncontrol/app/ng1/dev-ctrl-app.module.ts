import { AdminOnlyDirective } from "./admin-only.directive";
import {DataServiceFactory} from "./DataService";
import {MenuServiceFactory} from "./MenuService";
import {StateConfig} from "./StateConfig";
import {CtrlDirective} from "./CtrlDirective";
import {TableCtrl} from "./TableCtrl";
import {LogCtrl} from "./LogCtrl";
import {RecordCtrl} from "./RecordCtrl";
import {EnumEditorCtrl} from "./EnumEditorCtrl";
import {CtrlLogCtrl} from "./CtrlLogCtrl";
import {MenuDirective} from "./MenuDirective";
import {PanelDirective} from "./PanelDirective";
import {PanelControlSelectorCtrl} from "./PanelControlSelectorCtrl";
import {FkSelectDirective} from "./FkSelectDirective";
import {EnumSelectDirective} from "./EnumSelectDirective";
import {Slider2dDirective} from "./Slider2dDirective";
import {ObjectEditorDirective} from "./ObjectEditorDirective";
import {EndpointStatusDirective} from "./EndpointStatusDirective";
import {ToolbarDirective} from "./ToolbarDirective";
import {MainCtrl} from "./MainCtrl";
import {EndpointCtrl} from "./EndpointCtrl";
import {RoomCtrl} from "./RoomCtrl";
import {RoomsCtrl} from "./RoomsCtrl";


export let DevCtrlApp = angular.module('DevCtrlApp',
    ['ui.router', 'ngMaterial', 'btford.socket-io', 'angular-toArrayFilter'])
    .factory('DataService', DataServiceFactory)
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

