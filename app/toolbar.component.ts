import {DataService} from "./data.service";
import {UserSession} from "../shared/UserSession";
import {MenuService} from "./menu.service";
import { Component, Inject, Input } from '@angular/core';
declare var angular: angular.IAngularStatic;

// This component depends on a working md-select, which has not been released yet


@Component({
    moduleId: module.id,
    selector: 'devctrl-toolbar',
    template: `
<md-toolbar layout="row" layout-align="start center">
    <div flex layout="row"
         layout-align="center center"
         class="devctrl-main-toolbar devctrl-ctrl-select">
        <button md-button (click)="toggleSidenav('left')"
                   ng-hide="menu.hideSidenavButton()"
                   class="dc-toolbar-sidenav-button md-icon-button">
            <md-icon aria-label="Menu"  md-font-set="material-icons" >menu</md-icon>
        </button>
        <select *ngIf="menu.toolbarSelect.enabled"
                    aria-label="Select Page"
                   placeholder="{{$ctrl.pageTitle()}}"
                   ng-model="$ctrl.menu.toolbarSelect.selected"
                   ng-change="$ctrl.menu.toolbarSelectUpdate()">
            <md-option class="text-headline"s
                        ng-value="option.value"
                       ng-repeat="option in $ctrl.menu.toolbarSelect.options">
                {{option.name}}
            </md-option>
        </select> -->
        <span flex class="title text-headline">{{pageTitle()}}</span>
        <div layout="column">
            <div>{{session.client_name}}</div>
            <span *devctrlAdminOnly>{{session.username}}</span>
        </div>

        <button md-icon-button [md-menu-trigger-for]="adminmenu">
            <md-icon  md-font-set="material-icons">more_vert</md-icon>
        </button>
        <md-menu #adminmenu="mdMenu">
            <button md-menu-item (click)="adminLogin()">
                    Admin Login
            </button>
            <button md-menu-item *devctrlAdminOnly (click)="revokeAdmin()">
                    Admin Logout
            </button>
            <button md-menu-item *devCtrlAdminOnly (click)="editClient($event)">
                    Edit Client
            </button>
        </md-menu>
    </div>
</md-toolbar>
`
})
export class ToolbarComponent {
    menu;
    session : UserSession;
    $state;
    menuService;

    //static $inject = [ '$state', 'MenuService', 'DataService'];
    constructor(@Inject('$state') $state,
                menuService : MenuService,
                @Inject('DataService') private dataService : DataService) {
        this.menu = menuService;
        this.menuService = menuService;
        this.$state = $state;
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

    pageTitle() {
        return this.$state.current.title || this.$state.params.name;
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


let templateOoriginal = `
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
                   placeholder="{{$ctrl.pageTitle()}}"
                   ng-model="$ctrl.menu.toolbarSelect.selected"
                   ng-change="$ctrl.menu.toolbarSelectUpdate()">
            <md-option class="text-headline"
                        ng-value="option.value"
                       ng-repeat="option in $ctrl.menu.toolbarSelect.options">
                {{option.name}}
            </md-option>
        </md-select>
        <span flex class="title text-headline">{{$ctrl.pageTitle()}}</span>
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
                <md-menu-item ng-if="$ctrl.adminLoggedIn()">
                    <md-switch ng-model="$ctrl.config.editEnabled"
                               ng-change="$ctrl.updateConfig()">
                        Edit
                    </md-switch>
                </md-menu-item>
                <md-menu-item ng-if="$ctrl.adminLoggedIn()">
                    <md-button ng-click="$ctrl.revokeAdmin()">
                        Admin Logout
                    </md-button>
                </md-menu-item>
                <md-menu-item ng-if="$ctrl.adminLoggedIn()">
                    <md-button ng-click="$ctrl.editClient($event)">
                        Edit Client
                    </md-button>
                </md-menu-item>
            </md-menu-content>
        </md-menu>
    </div>
</md-toolbar>
`;