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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var data_service_1 = require("./data.service");
var core_1 = require("@angular/core");
var MenuService = (function () {
    //static $inject = ['$state', '$mdSidenav', '$mdMedia', 'DataService'];
    function MenuService($state, dataService) {
        this.$state = $state;
        this.dataService = dataService;
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
    }
    MenuService.prototype.backgroundImageStyle = function () {
        if (this.$state.current.name && this.$state.params.name) {
            var img = "url(/images/backgrounds/" + this.$state.current.name + "/" + this.$state.params.name + ".jpg)";
            return { 'background-image': img };
        }
        return {};
    };
    MenuService.prototype.cardClasses = function () {
        if (this.$state.current.data && this.$state.current.data.cardClasses) {
            return this.$state.current.data.cardClasses;
        }
        return '';
    };
    MenuService.prototype.go = function (state) {
        if (angular.isString(state)) {
            this.$state.go(state);
        }
        else {
            this.$state.go(state.name, state.params);
        }
    };
    MenuService.prototype.hideSidenavButtons = function () {
        if (this.narrowMode()) {
            return false;
        }
        return this.menuConfig.sidenavOpen;
    };
    MenuService.prototype.isFirstLevel = function () {
        return this.$state.current.name === "" || this.$state.get('^').name === "";
    };
    MenuService.prototype.isSidenavOpen = function () {
        return this.menuConfig.sidenavOpen;
    };
    MenuService.prototype.menuItems = function () {
        var states = this.$state.get();
        // Loop through once to identify top level states
        for (var key in states) {
            //angular.forEach(states, function(state, key) {
            var state = states[key];
            if (state.name == "") {
                continue;
            }
            state.isOpened = this.$state.includes(state);
            var parent_1 = this.$state.get('^', state);
            if (parent_1.name == "") {
                this.itemsObj[state.name] = state;
                if (!angular.isDefined(state.substates)) {
                    state.substatesObj = {};
                }
            }
            if (angular.isDefined(state.data.title)) {
                state.title = state.data.title;
            }
        }
        // Populate second level states
        for (var key in states) {
            //angular.forEach(states, function(state, key) {
            var state = states[key];
            if (state.name == "") {
                continue;
            }
            var parent_2 = this.$state.get('^', state);
            if (angular.isDefined(this.itemsObj[parent_2.name])) {
                if (angular.isDefined(state.data.listByName)) {
                    var records = this.dataService.getTable(state.data.listByName);
                    for (var id in records) {
                        var record = records[id];
                        if (!angular.isDefined(parent_2.substatesObj[record._id])) {
                            parent_2.substatesObj[record._id] = {
                                name: state.name,
                                params: {
                                    name: record.name,
                                    id: record._id
                                },
                                title: record.name
                            };
                        }
                        else {
                            parent_2.substatesObj[record._id].params.name = record.name;
                            parent_2.substatesObj[record._id].title = record.name;
                        }
                    }
                }
                else {
                    this.itemsObj[parent_2.name].substatesObj[state.name] = state;
                }
            }
        }
        this.items = [];
        for (var state in this.itemsObj) {
            var stateObj = this.itemsObj[state];
            this.items.push(stateObj);
            if (stateObj.substatesObj) {
                stateObj.substates = [];
                for (var substate in stateObj.substatesObj) {
                    stateObj.substates.push(stateObj.substatesObj[substate]);
                }
            }
        }
        return this.items;
    };
    MenuService.prototype.narrowMode = function () {
        return false;
        //return this.$mdMedia('max-width: 1000px');
    };
    MenuService.prototype.pageTitle = function () {
        return this.$state.current.title || this.$state.params.name;
    };
    MenuService.prototype.parentState = function () {
        return this.$state.get('^');
    };
    MenuService.prototype.states = function () {
        return this.$state.get();
    };
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
    __param(0, core_1.Inject('$state')), __param(1, core_1.Inject('DataService')),
    __metadata("design:paramtypes", [Object, data_service_1.DataService])
], MenuService);
exports.MenuService = MenuService;
//# sourceMappingURL=menu.service.js.map