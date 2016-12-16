"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var data_service_1 = require("./data.service");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var Endpoint_1 = require("../shared/Endpoint");
var Room_1 = require("../shared/Room");
var MenuService = (function () {
    function MenuService(route, router, dataService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.dataService = dataService;
        this.menuObj = {
            "rooms": {
                name: "Locations",
                route: ['rooms'],
                isOpened: false,
                children: []
            },
            "devices": {
                name: "Devices",
                route: ['devices'],
                isOpened: false,
                children: []
            },
            "config": {
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
        this.menuList = [this.menuObj['rooms'], this.menuObj['devices'], this.menuObj['config']];
        this.menuConfig = dataService.config.menu;
        this.items = [];
        this.itemsObj = {};
        this.toolbarSelect = {
            enabled: false,
            options: null,
            tableName: null,
            selected: null,
            destState: null
        };
        this.endpoints = this.dataService.getTable(Endpoint_1.Endpoint.tableStr);
        this.rooms = this.dataService.getTable(Room_1.Room.tableStr);
        route.url.subscribe(function (url) {
            _this.routeUrl = url;
            console.log("route changed: " + url[0].path);
        });
        route.data.subscribe(function (data) {
            _this.routeData = data;
        });
        route.params.subscribe(function (params) {
            _this.routeParams = params;
        });
    }
    MenuService.prototype.backgroundImageStyle = function () {
        //let path = (<string[]>this.route.url).join("/");
        //    var img = "url(/images/backgrounds/" + this.$state.current.name + "/" + this.$state.params.name + ".jpg)";
        //    return {'background-image': img};
        //}
        return {};
    };
    MenuService.prototype.go = function (state) {
        if (angular.isString(state)) {
            this.router.navigate([state]);
        }
        else if (angular.isArray(state)) {
            this.router.navigate(state);
        }
        else {
            this.router.navigate([state.name, state.params]);
        }
    };
    MenuService.prototype.hideSidenavButtons = function () {
        if (this.narrowMode()) {
            return false;
        }
        return this.menuConfig.sidenavOpen;
    };
    MenuService.prototype.isFirstLevel = function () {
        //return this.route.url.length == 1;
    };
    MenuService.prototype.isSidenavOpen = function () {
        return this.menuConfig.sidenavOpen;
    };
    MenuService.prototype.menuItems = function () {
        for (var _i = 0, _a = this.menuList; _i < _a.length; _i++) {
            var item = _a[_i];
            item.isOpened = false;
        }
        var levelOne = this.routeUrl[0].path;
        if (this.menuObj[levelOne]) {
            this.menuObj[levelOne]['isOpened'] = true;
        }
        this.menuObj.rooms.children = [];
        for (var roomId in this.rooms) {
            var roomMenu = {
                name: this.rooms[roomId].name,
                route: ['rooms', { name: this.rooms[roomId].name }]
            };
            this.menuObj.rooms.children.push(roomMenu);
        }
        this.menuObj.devices.children = [];
        for (var eId in this.endpoints) {
            var endpointMenu = {
                name: this.endpoints[eId].name,
                route: ['rooms', { id: eId }]
            };
            this.menuObj.devices.children.push(endpointMenu);
        }
        ;
        return this.menuList;
    };
    MenuService.prototype.narrowMode = function () {
        return false;
        //return this.$mdMedia('max-width: 1000px');
    };
    Object.defineProperty(MenuService.prototype, "pageTitle", {
        get: function () {
            return this._pageTitle;
        },
        set: function (val) {
            this._pageTitle = val;
        },
        enumerable: true,
        configurable: true
    });
    MenuService.prototype.toggleSidenav = function (position) {
        this.menuConfig.sidenavOpen = !this.menuConfig.sidenavOpen;
        this.dataService.updateConfig();
        if (this.narrowMode()) {
        }
    };
    MenuService.prototype.toolbarSelectTable = function (tableName, destState, selectedId) {
        var table = this.dataService.getTable(tableName);
        this.toolbarSelect.options = [];
        for (var id in table) {
            this.toolbarSelect.options.push({ id: id, name: table[id].name });
        }
        this.toolbarSelect.tableName = tableName;
        this.toolbarSelect.destState = destState;
        this.toolbarSelect.selected = selectedId;
        this.toolbarSelect.enabled = true;
    };
    MenuService.prototype.toolbarSelectUpdate = function () {
        var row = this.dataService.getRowRef(this.toolbarSelect.tableName, this.toolbarSelect.selected);
        this.go({
            name: this.toolbarSelect.destState,
            params: {
                id: this.toolbarSelect.selected,
                name: row.name
            }
        });
    };
    return MenuService;
}());
MenuService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        data_service_1.DataService])
], MenuService);
exports.MenuService = MenuService;
//# sourceMappingURL=menu.service.js.map