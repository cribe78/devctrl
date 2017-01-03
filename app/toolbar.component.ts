import {DataService} from "./data.service";
import {UserSession} from "../shared/UserSession";
import {MenuService} from "./menu.service";
import { Component, Inject, Input } from '@angular/core';


// This component depends on a working md-select, which has not been released yet


@Component({
    moduleId: module.id,
    selector: 'devctrl-toolbar',
    template: `
<md-toolbar class="layout-row layout-align-start-center">
    <div class="flex devctrl-main-toolbar devctrl-ctrl-select layout-row layout-align-center-center">
        <button md-button (click)="menu.toggleSidenav('left')"
                   ng-hide="menu.hideSidenavButton()"
                   class="dc-toolbar-sidenav-button md-icon-button">
            <md-icon aria-label="Menu"  md-font-set="material-icons" >menu</md-icon>
        </button>
        <select *ngIf="menu.toolbarSelect.enabled"
                    aria-label="Select Page"
                    name="toolbarSelect"
                   [(ngModel)]="menu.toolbarSelect.selected"
                   (change)="menu.toolbarSelectUpdate($event)">
            <option class="text-headline"
                        [value]="option.id"
                       *ngFor="let option of menu.toolbarSelect.options">
                {{option.name}}
            </option>
        </select>
        <span class="flex title text-headline">{{menu.pageTitle}}</span>
        <div class="layout-column">
            <div>{{session.client_name}}</div>
            <span *devctrlAdminOnly>{{session.username}}</span>
        </div>

        <button md-button [md-menu-trigger-for]="adminmenu">
            <md-icon>more_vert</md-icon>
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
