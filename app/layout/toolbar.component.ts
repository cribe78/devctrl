import {DataService} from "../data.service";
import {UserSession} from "../shared/UserSession";
import {MenuService} from "./menu.service";
import { Component, Inject, Input } from '@angular/core';
import {LayoutService} from "./layout.service";
import {RecordEditorService} from "../data-editor/record-editor.service";
import {UserInfo} from "../shared/UserInfo";
import {IndexedDataSet} from "../shared/DCDataModel";


@Component({

    selector: 'devctrl-toolbar',
    template: `
<div class="outer-div" [class.fullscreen]="menu.fullscreen">
    <md-toolbar color="accent" class="devctrl-title-toolbar">
        <div class="devctrl-title-toolbar-inner">
            <button md-icon-button (click)="menu.toggleSidenav()">
                <md-icon aria-label="Menu">menu</md-icon>
            </button>
            <span class="text-display-1 md-accent">DevCtrl</span>
            <button *ngIf="ls.mobile" md-icon-button [md-menu-trigger-for]="adminmenu">
                <md-icon>more_vert</md-icon>
            </button>
        </div>
    </md-toolbar>
    <md-toolbar color="primary" class="devctrl-main-toolbar">
        <div class="devctrl-main-toolbar devctrl-ctrl-select">
            <span class="devctrl-pagetitle text-headline" >
                <div class="dc-parent-link" *ngIf="menu.parentName" (click)="menu.goToParent()">{{menu.parentName}}</div>
                <div *ngIf="menu.parentName">&nbsp;>&nbsp;</div>
                <div>{{menu.pageTitle}}</div>
            </span>
            <div class="devctrl-client-info">
                <div class="text-subhead">{{userInfo().name}}</div>
                <span *devctrlAdminOnly class="text-subhead">{{session.username}}</span>
            </div>
    
            <button *ngIf="ls.desktop" md-icon-button [md-menu-trigger-for]="adminmenu">
                <md-icon>more_vert</md-icon>
            </button>
            <md-menu #adminmenu="mdMenu">
                <button md-menu-item *devctrlAdminOnly="false" (click)="adminLogin()">
                        Admin Login
                </button>
                <button md-menu-item *devctrlAdminOnly (click)="revokeAdmin()">
                        Admin Logout 
                </button>
                
                <button md-menu-item *devctrlAdminOnly (click)="editClient($event)">
                        Edit Client
                </button>
                <button md-menu-item (click)="openHelp()">
                    Help                    
                </button>
            </md-menu>
        </div>
    </md-toolbar>
</div>
`,
    //language=CSS
    styles: [`   
.outer-div {
    display: flex;
    flex-direction: row;
}


md-toolbar.devctrl-main-toolbar {
    flex: 1 1;
}


div.devctrl-main-toolbar {
    display: flex;
    flex: 1 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.dc-parent-link {
    cursor: pointer;    
}

.devctrl-client-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.devctrl-pagetitle {
    flex: 1 1;
    display: flex;
    justify-content: center;
}

.devctrl-title-toolbar {
    width: 270px;
}

.devctrl-title-toolbar-inner {    
    display: flex;
    justify-content: space-between;
}

.devctrl-main-toolbar md-select {
    width: 200px;
}

.fullscreen {
    display: none;
}

md-select /deep/ .mat-select-value {
    color: rgba(255,255,255,.87);
}

md-select /deep/ .mat-select-arrow {
    color: rgba(255,255,255,.87);
}

@media screen and (max-width: 599px) {
    .devctrl-title-toolbar {
        width: 100%;
    }
    
    .outer-div {
        flex-direction: column;
    }
}

.job-toolbar {
    flex: 1 1;
    display: flex;
    justify-content: space-between;
}

.job-monitor-card {
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    transition: box-shadow 280ms cubic-bezier(.4,0,.2,1);
    will-change: box-shadow;
    display: block;

}

.job-output {
    display: flex;
    flex-direction: column;
    overflow: auto;
    max-height: 800px;
}

`]
})
export class ToolbarComponent {
    menu;
    session : UserSession;
    userInfos : IndexedDataSet<UserInfo>;
    menuService;

    constructor(menuService : MenuService,
                private dataService : DataService,
                public ls : LayoutService,
                private rs : RecordEditorService) {
        this.menu = menuService;
        this.menuService = menuService;
        this.session = this.dataService['userSession'];
        console.log("Toolbar Component created");
        this.userInfos = this.dataService.getTable(UserInfo.tableStr) as IndexedDataSet<UserInfo>;
    }

    showAdminLogin() {
        // Show Admin login option if not currently admin authorized
        return ! this.dataService.isAdminAuthorized();
    };

    adminLogin() {
        this.dataService.doAdminLogon();
    };

    editClient($event) {
        this.rs.editRecord($event, this.session.userInfo_id, UserInfo.tableStr);
        //TODO implement editting of session name
    };


    openHelp() {
        window.open('https://bitbucket.org/ufdwi/devctrl/wiki/Home');
    }

    revokeAdmin() {
        this.dataService.revokeAdminAuth();
    };

    updateConfig() {
        this.dataService.updateConfig();
    };

    userInfo() {
        if (this.userInfos[this.session.userInfo_id]) {
            return this.userInfos[this.session.userInfo_id];
        }

        return { name: "unknown"};

    }
}
