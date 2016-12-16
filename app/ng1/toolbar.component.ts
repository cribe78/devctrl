import {UserSession} from "../../shared/UserSession";
import {MenuService} from "../menu.service";
import {DataService} from "../data.service";
import { Directive, ElementRef, Injector } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

class ToolbarController {
    menu;
    session : UserSession;
    $state;
    menuService;

    static $inject = ['MenuService', 'DataService'];
    constructor(menuService : MenuService,
                private dataService : DataService) {
        this.menu = menuService;
        this.menuService = menuService;
        this.session = this.dataService['userSession'];
        console.log("Toolbar Component created");

    }

    showAdminLogin() {
        // Show Admin login option if not currently admin authorized
        return ! this.dataService.isAdminAuthorized();
    };

    adminLogin() {
        this.dataService.doAdminLogon();
    };

    editClient($event) {
        //this.dataService.editRecord($event, self.user.client_id, "clients");
        //TODO implement editting of session name
    };


    revokeAdmin() {
        this.dataService.revokeAdminAuth();
    };

    updateConfig() {
        this.dataService.updateConfig();
    };
}


export let ToolbarComponent : angular.IComponentOptions = {
    controller: ToolbarController,
    template: `
<md-toolbar layout="row" layout-align="start center">
    <div flex layout="row"
         layout-align="center center"
         class="devctrl-main-toolbar devctrl-ctrl-select">
        <md-button ng-click="$ctrl.menu.toggleSidenav('left')"
                   ng-hide="$ctrl.menu.hideSidenavButton()"
                   class="dc-toolbar-sidenav-button md-icon-button">
            <md-icon aria-label="Menu"  md-font-set="material-icons" >menu</md-icon>
        </md-button>
        <md-select ng-if="$ctrl.menu.toolbarSelect.enabled"
                    aria-label="Select Page"
                   placeholder="{{$ctrl.menu.pageTitle}}"
                   ng-model="$ctrl.menu.toolbarSelect.selected"
                   ng-change="$ctrl.menu.toolbarSelectUpdate()">
            <md-option class="text-headline"
                        ng-value="option.value"
                       ng-repeat="option in $ctrl.menu.toolbarSelect.options">
                {{option.name}}
            </md-option>
        </md-select>
        <span flex class="title text-headline">{{$ctrl.menu.pageTitle}}</span>
        <div layout="column">
            <div>{{$ctrl.session.client_name}}</div>
            <span ng-if="$ctrl.adminLoggedIn()">{{$ctrl.session.username}}</span>
        </div>


        <md-menu>
            <md-button  class="md-icon-button" ng-click="$mdOpenMenu($event)">
                <md-icon  md-font-set="material-icons">more_vert</md-icon>
            </md-button>
            <md-menu-content>
                <md-menu-item ng-if="$ctrl.showAdminLogin()">
                    <md-button ng-click="$ctrl.adminLogin()">
                        Admin Login
                    </md-button>
                </md-menu-item>
                <md-menu-item devctrl-admin-only>
                    <md-switch ng-model="$ctrl.config.editEnabled"
                               ng-change="$ctrl.updateConfig()">
                        Edit
                    </md-switch>
                </md-menu-item>
                <md-menu-item devctrl-admin-only>
                    <md-button ng-click="$ctrl.revokeAdmin()">
                        Admin Logout
                    </md-button>
                </md-menu-item>
                <md-menu-item devctrl-admin-only>
                    <md-button ng-click="$ctrl.editClient($event)">
                        Edit Client
                    </md-button>
                </md-menu-item>
            </md-menu-content>
        </md-menu>
    </div>
</md-toolbar>
`
}

@Directive({
    selector: 'devctrl-toolbar'
})
export class ToolbarComponentNg2 extends UpgradeComponent {
    constructor(elementRef: ElementRef, injector: Injector) {
        super('devctrlToolbar', elementRef, injector);
    }
}