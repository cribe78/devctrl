import { Component, OnInit} from '@angular/core';
import {DataService} from "./data.service";
import {MenuService} from "./menu.service";
import {  ActivatedRoute } from '@angular/router';


@Component({
    selector: 'devctrl-app',
    template: `
<div *ngIf="! menu.narrowMode()"
     [hidden]="menu.isSidenavOpen()"
     class="dc-sidenav md-sidenav-left md-whiteframe-z2"
     layout="column">
    <md-toolbar layout="row"  layout-align="start center" class="md-accent">
        <button md-button (click)="menu.toggleSidenav('left')" class="dc-sidenav-close md-icon-button">
            <md-icon aria-label="Menu"  md-font-set="material-icons" >menu</md-icon>
        </button>
        <span flex class="text-display-1 md-accent md-hue-1">DevCtrl BETA</span>
    </md-toolbar>
    <div flex role="navigation" class="md-accent md-hue-1">
        <devctrl-menu></devctrl-menu>
    </div>
</div>
<md-sidenav *ngIf="menu.narrowMode()"
            class="md-sidenav-left md-whiteframe-z2 "
            layout="column"
            md-component-id="left">
    <md-toolbar layout="row"  layout-align="start center" class="md-accent">
        <button md-button (click)="menu.toggleSidenav('left')" class="dc-sidenav-close md-icon-button">
            <md-icon aria-label="Menu"  md-font-set="material-icons" >menu</md-icon>
        </button>
        <span flex class="text-display-1 md-accent md-hue-1">DWI DevCtrl</span>
    </md-toolbar>
    <div flex role="navigation" class="md-accent md-hue-1">
        <devctrl-menu></devctrl-menu>
    </div>
</md-sidenav>
<div layout="column" flex>
    <devctrl-toolbar></devctrl-toolbar>
    <div *ngIf="menu.narrowMode()"
                layout="column"
                flex
                layout-margin
                id="content"
                class="devctrl-main-content">
        <router-outlet></router-outlet>
    </div>
    <div *ngIf="! menu.narrowMode()"
                layout="column"
                layout-align="start center"
                flex
                layout-margin
                id="content"
                [style.background-img]="backgroundImg()">
        <section class="md-whiteframe-z1 devctrl-main-card" [ngClass]="cardClasses()">
                <router-outlet></router-outlet> 

        </section>
    </div>
</div>`
})
export class AppComponent implements OnInit {
    menu : MenuService;

    constructor(public route : ActivatedRoute,
                private dataService: DataService,
                private menuService: MenuService) {
        this.menu = menuService;
    };

    ngOnInit() {
    }

    backgroundImg() {
        //TODO: implement this with the new router
        /**
        if (this.route.name && this.route.params.name) {
            let img = "url(/images/backgrounds/" + this.route.current.name + "/" + this.route.params.name + ".jpg)";
            return img;
        }
         **/

        return "url(/images/backgrounds/default.jpg";
    }

    cardClasses() : { [index: string] : any} {
        if (this.route.data && this.route.data['cardClasses']) {
            return this.route.data['cardClasses'];
        }

        return {};
    }

    updateConfig() {
        this.dataService.updateConfig();
    }
}
