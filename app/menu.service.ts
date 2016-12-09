import {DataService} from "./data.service";
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class MenuService {
    items : any[];
    itemsObj : { [index: string] : any};
    menuConfig;
    toolbarSelect;

    //static $inject = ['$state', '$mdSidenav', '$mdMedia', 'DataService'];
    constructor(@Inject('$state') public $state, private dataService: DataService) {
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
    }


    backgroundImageStyle() : any {
        if (this.$state.current.name && this.$state.params.name) {
            var img = "url(/images/backgrounds/" + this.$state.current.name + "/" + this.$state.params.name + ".jpg)";
            return {'background-image': img};
        }
        return {};
    }

    cardClasses() : string {
        if (this.$state.current.data && this.$state.current.data.cardClasses) {
            return this.$state.current.data.cardClasses;
        }

        return '';
    }

    go(state) {
        if (angular.isString(state)) {
            this.$state.go(state);
        }
        else {
            this.$state.go(state.name, state.params);
        }
    }

    hideSidenavButtons() {
        if (this.narrowMode()) {
            return false;
        }
        return this.menuConfig.sidenavOpen;
    }

    isFirstLevel() {
        return this.$state.current.name === "" || this.$state.get('^').name === "";
    }


    isSidenavOpen() {
        return this.menuConfig.sidenavOpen;
    }

    menuItems() {
        let states = this.$state.get();

        // Loop through once to identify top level states
        for (let key in states) {
            //angular.forEach(states, function(state, key) {
            let state = states[key];
            if (state.name == "") {
                continue;
            }

            state.isOpened = this.$state.includes(state);
            let parent = this.$state.get('^', state);

            if (parent.name == "") {
                this.itemsObj[state.name] = state;
                if (! angular.isDefined(state.substates)) {
                    state.substatesObj = {};
                }
            }

            if (angular.isDefined(state.data.title)) {
                state.title = state.data.title;
            }
        }

        // Populate second level states
        for (let key in states) {
            //angular.forEach(states, function(state, key) {
            let state = states[key];
            if (state.name == "") {
                continue;
            }

            let parent = this.$state.get('^', state);
            if (angular.isDefined(this.itemsObj[parent.name])) {
                if (angular.isDefined(state.data.listByName)) {
                    let records = this.dataService.getTable(state.data.listByName);

                    for (let id in records) {
                        let record = records[id];

                        if (! angular.isDefined(parent.substatesObj[record._id])) {
                            parent.substatesObj[record._id] = {
                                name: state.name,
                                params: {
                                    name: record.name,
                                    id : record._id
                                },
                                title: record.name
                            };
                        }
                        else {
                            parent.substatesObj[record._id].params.name  = record.name;
                            parent.substatesObj[record._id].title = record.name;
                        }
                    }
                }
                else {
                    this.itemsObj[parent.name].substatesObj[state.name] = state;
                }
            }
        }

        this.items = [];
        for (let state in this.itemsObj) {
            let stateObj = this.itemsObj[state];
            this.items.push(stateObj);
            if (stateObj.substatesObj) {
                stateObj.substates = [];
                for (let substate in stateObj.substatesObj) {
                    stateObj.substates.push(stateObj.substatesObj[substate]);
                }
            }
        }

        return this.items;
    }

    narrowMode() {
        return false;
        //return this.$mdMedia('max-width: 1000px');
    }

    pageTitle() {
        return this.$state.current.title || this.$state.params.name;
    }

    parentState() {
        return this.$state.get('^');
    }

    states() {
        return this.$state.get();
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
        this.go({
            name : this.toolbarSelect.destState,
            params : {
                id : this.toolbarSelect.selected,
                name : row.name
            }
        });
    }
}
