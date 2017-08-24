import {DataService} from "../data.service";
import { Injectable, Inject } from '@angular/core';
import {  Router, ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { appRoutes } from "../app-router.module";
import {IndexedDataSet} from "../shared/DCDataModel";
import {Endpoint} from "../shared/Endpoint";
import {Room} from "../shared/Room";

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
    endpoints : IndexedDataSet<Endpoint>;
    rooms : IndexedDataSet<Room>;
    //TODO: clean this up once the new static menu goes into production
    menuObj : { [index: string]: MSMenuItem } = {
        "rooms" : {
            name: "Rooms",
            route: ['rooms'],
            isOpened: false,
            children: []
        },
        "devices" : {
            name: "Devices",
            route: ['devices'],
            isOpened: false,
            children: []
        },
        "config" : {
            name: "Config",
            route: ['config'],
            isOpened: false,
            children: [
                {
                    name: "Data Tables",
                    route: ['config', 'data'],
                    isOpened: false
                }
            ]
        }
    };

    static TOPLEVEL_ROOMS = "rooms";
    static TOPLEVEL_DEVICES = "devices";
    static TOPLEVEL_CONFIG = "config";
    menuList : MSMenuItem[] = [this.menuObj['rooms']]; //, this.menuObj['devices'], this.menuObj['config']];
    _currentTopLevel : string;
    _openTopLevel : string;
    routeData;
    routeParams;
    //private router : Router;

    constructor(
                private router : Router,
                private dataService: DataService) {
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
        return this.menuConfig.sidenavOpen;
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

        /**
        this.menuObj['devices'].children = [];
        for (let eId in this.endpoints) {
            let endpointMenu = {
                name: this.endpoints[eId].name,
                route: ['devices', eId],
                isOpened: false
            };

            this.menuObj['devices'].children.push(endpointMenu);
        };
         **/

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

    toolbarSelectDisable() {
        this.toolbarSelect.enabled = false;
    }

    toolbarSelectTable(tableName, destState, selectedId) {
        let table = this.dataService.getTable(tableName);
        this.toolbarSelect.options = [];

        for (let id in table) {
            this.toolbarSelect.options.push({ id: id, name: table[id].name});
        }

        this.toolbarSelect.tableName = tableName;
        this.toolbarSelect.destState = destState;
        this.toolbarSelect.selected = selectedId;
        this.toolbarSelect.enabled = true;
    }

    toolbarSelectUpdate(event) {
        let row = this.dataService.getRowRef(this.toolbarSelect.tableName, this.toolbarSelect.selected);

        let dest = [this.toolbarSelect.selected];
        if (Array.isArray(this.toolbarSelect.destState)) {
            dest = this.toolbarSelect.destState;
            dest.push(this.toolbarSelect.selected);
        }

        this.go(dest);
    }
}
