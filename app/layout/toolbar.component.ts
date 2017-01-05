import {DataService} from "../data.service";
import {UserSession} from "../../shared/UserSession";
import {MenuService} from "./menu.service";
import { Component, Inject, Input } from '@angular/core';
import {LayoutService} from "./layout.service";


// This component depends on a working md-select, which has not been released yet


@Component({
    moduleId: module.id,
    selector: 'devctrl-toolbar',
    template: `
<div fxLayout="column"
     fxLayout.gt-sm="row">
    <md-toolbar fxFlex fxFlex.gt-sm="270px" class="md-accent devctrl-title-toolbar">
        <div fxLayout="row"
             fxLayoutAlign="space-between center"
             fxFill>
            <button md-icon-button fxFlex="none" (click)="menu.toggleSidenav()" class="dc-sidenav-close md-icon-button">
                <md-icon aria-label="Menu">menu</md-icon>
            </button>
            <span fxFlex class="text-display-1 md-accent">DevCtrl</span>
            <button *ngIf="ls.mobile" fxFlex="none" md-icon-button [md-menu-trigger-for]="adminmenu">
                <md-icon>more_vert</md-icon>
            </button>
        </div>
    </md-toolbar>
    <md-toolbar fxFlex color="primary">
        <div class="devctrl-main-toolbar devctrl-ctrl-select"
             fxLayout="row"
             fxLayoutAlign="space-between center"
             fxFill>
            <select *ngIf="menu.toolbarSelect.enabled && ls.desktop"
                    fxFlex="140px"
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
            <span class="text-headline" 
                    fxFlex 
                    fxAlign="center"
                    fxLayout="row"
                    fxLayoutAlign="space-around center">
                <div>{{menu.pageTitle}}</div>
            </span>
            <div fxFlex="none" fxLayout="column">
                <div fxFlex="50%" class="text-subhead">{{session.client_name}}</div>
                <span fxFlex="50%" *devctrlAdminOnly class="text-subhead">{{session.username}}</span>
            </div>
    
            <button *ngIf="ls.desktop" fxFlex="none" md-icon-button [md-menu-trigger-for]="adminmenu">
                <md-icon>more_vert</md-icon>
            </button>
            <md-menu fxFlex="none" #adminmenu="mdMenu">
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
</div>
`
})
export class ToolbarComponent {
    menu;
    session : UserSession;
    $state;
    menuService;

    constructor(menuService : MenuService,
                private dataService : DataService,
                private ls : LayoutService) {
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
