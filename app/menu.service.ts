import {DataService} from "./data.service";
import { Injectable, Inject } from '@angular/core';
import {  Router, ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { appRoutes } from "./app-router.module";
import {IndexedDataSet} from "../shared/DCDataModel";
import {Endpoint} from "../shared/Endpoint";
import {Room} from "../shared/Room";

@Injectable()
export class MenuService {
    items : any[];
    itemsObj : { [index: string] : any};
    private _pageTitle;
    menuConfig;
    toolbarSelect;
    endpoints : IndexedDataSet<Endpoint>;
    rooms : IndexedDataSet<Room>;
    menuObj = {
        "rooms" : {
            name: "Locations",
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
                    route: ['config', 'data']
                }
            ]
        }
    };
    menuList = [this.menuObj['rooms'], this.menuObj['devices'], this.menuObj['config']];
    routeUrl : UrlSegment[];
    routeData;
    routeParams;

    constructor(private route : ActivatedRoute,
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

        route.url.subscribe((url) => {
            this.routeUrl = url;

            console.log(`route changed: ${url[0].path}`);
        });

        route.data.subscribe((data) => {
            this.routeData = data;
        });

        route.params.subscribe((params) => {
            this.routeParams = params;
        });

    }


    backgroundImageStyle() : any {
        //let path = (<string[]>this.route.url).join("/");
        //    var img = "url(/images/backgrounds/" + this.$state.current.name + "/" + this.$state.params.name + ".jpg)";
        //    return {'background-image': img};
        //}
        return {};
    }

    go(state) {
        if (angular.isString(state)) {
            this.router.navigate([state]);
        }
        else if (angular.isArray(state)) {
            this.router.navigate(state);
        }
        else {
            this.router.navigate([state.name, state.params]);
        }
    }

    hideSidenavButtons() {
        if (this.narrowMode()) {
            return false;
        }
        return this.menuConfig.sidenavOpen;
    }

    isFirstLevel() {
        //return this.route.url.length == 1;
    }


    isSidenavOpen() {
        return this.menuConfig.sidenavOpen;
    }

    menuItems() {

        for (let item of this.menuList) {
            item.isOpened = false;
        }

        let levelOne = this.routeUrl[0].path;

        if (this.menuObj[levelOne]) {
            this.menuObj[levelOne]['isOpened'] = true;
        }

        this.menuObj.rooms.children = [];
        for (let roomId in this.rooms) {
            let roomMenu = {
                name: this.rooms[roomId].name,
                route: ['rooms', { name: this.rooms[roomId].name }]
            };

            this.menuObj.rooms.children.push(roomMenu);
        }

        this.menuObj.devices.children = [];
        for (let eId in this.endpoints) {
            let endpointMenu = {
                name: this.endpoints[eId].name,
                route: ['rooms', { id: eId}]
            };

            this.menuObj.devices.children.push(endpointMenu);
        };

        return this.menuList;
    }

    narrowMode() {
        return false;
        //return this.$mdMedia('max-width: 1000px');
    }

    get pageTitle() {
        return this._pageTitle;
    }

    set pageTitle(val) {
        this._pageTitle = val;
    }

    toggleSidenav(position) {
        this.menuConfig.sidenavOpen = ! this.menuConfig.sidenavOpen;
        this.dataService.updateConfig();

        if (this.narrowMode()) {
            //this.$mdSidenav(position).toggle();
        }
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

    toolbarSelectUpdate() {
        let row = this.dataService.getRowRef(this.toolbarSelect.tableName, this.toolbarSelect.selected);

        let dest = [this.toolbarSelect.selected];
        if (Array.isArray(this.toolbarSelect.destState)) {
            dest = this.toolbarSelect.destState;
            dest.push(this.toolbarSelect.selected);
        }

        this.go(dest);
    }
}
