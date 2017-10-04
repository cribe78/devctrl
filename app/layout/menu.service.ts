import {DataService} from "../data.service";
import { Injectable, Inject } from '@angular/core';
import {  Router, ActivatedRoute, Params, UrlSegment, NavigationEnd, NavigationStart } from '@angular/router';
import { appRoutes } from "../app-router.module";
import {IndexedDataSet} from "../shared/DCDataModel";
import {Endpoint} from "../shared/Endpoint";
import {Room} from "../shared/Room";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';

export interface MSMenuItem {
    name: string;
    route: string[];
    isOpened : boolean;
    children?: MSMenuItem[];
}


@Injectable()
export class MenuService {
    items : any[];
    itemsObj : { [index: string] : any};
    private _pageTitle;
    parentName = "";
    parentRoute = [];
    menuConfig;
    toolbarSelect;
    private _routeData : any = {};
    endpoints : IndexedDataSet<Endpoint>;
    rooms : IndexedDataSet<Room>;
    //TODO: clean this up once the new static menu goes into production
    menuObj : { [index: string]: MSMenuItem } = {
        "rooms" : {
            name: "Rooms",
            route: ['rooms'],
            isOpened: false,
            children: []
        }
    };

    static TOPLEVEL_ROOMS = "rooms";
    static TOPLEVEL_DEVICES = "devices";
    static TOPLEVEL_CONFIG = "config";
    menuList : MSMenuItem[] = [this.menuObj['rooms']]; //, this.menuObj['devices'], this.menuObj['config']];
    _currentTopLevel : string;

    constructor(
                private router : Router,
                private dataService: DataService,
                private route : ActivatedRoute) {
        this.menuConfig = dataService.config.menu;
        this.items = [];
        this.itemsObj = {};
        this.toolbarSelect = {
            enabled : false,
            options: null,
            tableName: null,
            selected: null,
            destState: null
        };

        this.endpoints = this.dataService.getTable(Endpoint.tableStr) as IndexedDataSet<Endpoint>;
        this.rooms = this.dataService.getTable(Room.tableStr) as IndexedDataSet<Room>;

        // Reset routeData on navigation
        router.events.filter( event => event instanceof NavigationStart)
            .subscribe((event) => {
                console.log("clear route data");
                this._routeData = {};
            });
    }


    backgroundImageStyle() : any {
        //let path = (<string[]>this.route.url).join("/");
        //    var img = "url(/images/backgrounds/" + this.$state.current.name + "/" + this.$state.params.name + ".jpg)";
        //    return {'background-image': img};
        //}
        return {};
    }

    set currentTopLevel(val : string) {
        this._currentTopLevel = val;

        if (this.menuObj[val]) {
            this.openTopLevel(this.menuObj[val]);
        }
    }

    get fullscreen() : boolean {
        return !! this._routeData.fullscreen;
    }

    set routeData(val : any) {
        console.log("setting route data");
        this._routeData = val;
    }

    get routeData() {
        return this._routeData;
    }


    go(state) {
        if (typeof state == 'string') {
            this.router.navigate([state]);
        }
        else if (Array.isArray(state)) {
            this.router.navigate(state);
        }
        else {
            this.router.navigate([state.name, state.params]);
        }
    }

    goToParent() {
        this.router.navigate(this.parentRoute);
    }

    hideSidenavButtons() {
        if (this.narrowMode()) {
            return false;
        }
        return !! this.menuConfig.sidenavOpen;
    }

    isFirstLevel() {
        //return this.route.url.length == 1;
    }


    isSidenavOpen() {
        return this.menuConfig.sidenavOpen && ! this._routeData.fullscreen;
    }

    menuItems() {

        this.menuObj['rooms'].children = [];
        for (let roomId in this.rooms) {
            let roomMenu = {
                name: this.rooms[roomId].name,
                route: ['rooms', this.rooms[roomId].name],
                isOpened: false
            };

            this.menuObj['rooms'].children.push(roomMenu);
        }

        return this.menuList;
    }

    narrowMode() {
        return false;
        //return this.$mdMedia('max-width: 1000px');
    }

    openTopLevel(item: MSMenuItem) {
        for (let mitem of this.menuList) {
            if (mitem.name !== item.name) {
                mitem.isOpened = false;
            }
            else {
                mitem.isOpened = true;
            }
        }
    }

    get pageTitle() {
        return this._pageTitle;
    }

    set pageTitle(val) {
        this._pageTitle = val;
    }

    toggleSidenav() {
        this.menuConfig.sidenavOpen = ! this.menuConfig.sidenavOpen;
        this.dataService.updateConfig();
    }

    toggleTopLevel($event, item : MSMenuItem) {
        $event.stopPropagation();

        if (! item.isOpened) {
            this.openTopLevel((item));
        }
        else {
            item.isOpened = false;
        }
    }
}
