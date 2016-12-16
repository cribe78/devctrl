import { Component, OnInit} from '@angular/core';
import {DataService} from "./data.service";
import {MenuService} from "./menu.service";
import {  ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'devctrl-app',
    template: `
<div *ngIf="! menu.narrowMode()"
     [hidden]="menu.isSidenavOpen()"
     class="dc-sidenav md-sidenav-left md-whiteframe-z2 layout-column">
    <md-toolbar class="md-accent layout-row layout-align-start-center">
        <button md-button (click)="menu.toggleSidenav('left')" class="dc-sidenav-close md-icon-button">
            <md-icon aria-label="Menu">menu</md-icon>
        </button>
        <span flex class="text-display-1 md-accent md-hue-1">DevCtrl BETA</span>
    </md-toolbar>
    <div flex role="navigation" class="md-accent md-hue-1">
        <devctrl-menu></devctrl-menu>
    </div>
</div>

    <md-sidenav *ngIf="menu.narrowMode()"
                class="md-sidenav-left md-whiteframe-z2 layout-column">
        <md-toolbar layout="row"  layout-align="start center" class="md-accent">
            <button md-button (click)="menu.toggleSidenav('left')" class="dc-sidenav-close md-icon-button">
                <md-icon aria-label="Menu">menu</md-icon>
            </button>
            <span flex class="text-display-1 md-accent md-hue-1">DWI DevCtrl</span>
        </md-toolbar>
        <div flex role="navigation" class="md-accent md-hue-1">
            <devctrl-menu></devctrl-menu>
        </div>
    </md-sidenav>
    <div class="layout-column" flex>
        <devctrl-toolbar></devctrl-toolbar>
        <div *ngIf="menu.narrowMode()"
                    flex
                    id="content"
                    class="devctrl-main-content layout-column layout-margin">
            <router-outlet></router-outlet>
        </div>
        <div *ngIf="! menu.narrowMode()"
                class="layout-column layout-align-start-center layout-margin"
                    flex
                    id="content"
                    [style.background-img]="backgroundImg()">
            <section class="md-whiteframe-z1 devctrl-main-card" [ngClass]="cardClasses()">
                    <router-outlet></router-outlet> 
            </section>
        </div>
    </div>
`
})
export class AppComponent implements OnInit {
    menu : MenuService;

    constructor(public route : ActivatedRoute,
                private router : Router,
                private dataService: DataService,
                private menuService: MenuService) {
        this.menu = menuService;
    };

    ngOnInit() {
        console.log(`init AppComponent, url is ${this.route.snapshot.url.join('')}`);
        this.route.url.subscribe((url) => {
            let pathSegments = url.map((segment) => {
                return segment.path;
            });

            let path = pathSegments.join('/');

            console.log(`APpComponent: route is ${path} or ${this.router.url}`);

        });
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
