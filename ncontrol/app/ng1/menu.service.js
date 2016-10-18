"use strict";
var MenuService = (function () {
    function MenuService($state, $mdSidenav, $mdMedia, dataService) {
        this.$state = $state;
        this.$mdSidenav = $mdSidenav;
        this.$mdMedia = $mdMedia;
        this.dataService = dataService;
        this.menuConfig = dataService.config.menu;
        this.items = {};
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
                this.items[state.name] = state;
                if (!angular.isDefined(state.substates)) {
                    state.substates = {};
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
            if (angular.isDefined(this.items[parent_2.name])) {
                if (angular.isDefined(state.data.listByName)) {
                    var records = this.dataService.getTable(state.data.listByName);
                    for (var id in records) {
                        var record = records[id];
                        if (!angular.isDefined(parent_2.substates[record._id])) {
                            parent_2.substates[record._id] = {
                                name: state.name,
                                params: {
                                    name: record.name,
                                    id: record._id
                                },
                                title: record.name
                            };
                        }
                        else {
                            parent_2.substates[record._id].params.name = record.name;
                            parent_2.substates[record._id].title = record.name;
                        }
                    }
                }
                else {
                    this.items[parent_2.name].substates[state.name] = state;
                }
            }
        }
        return this.items;
    };
    MenuService.prototype.narrowMode = function () {
        return this.$mdMedia('max-width: 1000px');
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
            this.$mdSidenav(position).toggle();
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
    MenuService.$inject = ['$state', '$mdSidenav', '$mdMedia', 'DataService'];
    return MenuService;
}());
exports.MenuService = MenuService;
//# sourceMappingURL=menu.service.js.map