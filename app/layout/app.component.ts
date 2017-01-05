import { Component, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {MenuService} from "./menu.service";
import {  ActivatedRoute, Router } from '@angular/router';
import {MediaService} from "./media.service";
import {LayoutService} from "./layout.service";


@Component({
    selector: 'devctrl-app',
    template: `
<body fxLayout="column">
    <devctrl-toolbar></devctrl-toolbar>    
    <md-sidenav-container>
        <md-sidenav class="dc-sidenav"
                    [opened]="menu.isSidenavOpen()"
                    [mode]="sidenavMode()">
            <devctrl-menu></devctrl-menu>
        </md-sidenav>
        <router-outlet></router-outlet>
    </md-sidenav-container>
</body>
`
})
export class AppComponent implements OnInit {
    menu : MenuService;

    constructor(public route : ActivatedRoute,
                private router : Router,
                private dataService: DataService,
                private menuService: MenuService,
                private ls: LayoutService) {
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

    sidenavMode() {
        if (this.ls.mobile) {
            return 'over';
        }

        return 'side';
    }

    updateConfig() {
        this.dataService.updateConfig();
    }
}
