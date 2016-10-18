import {DataService} from "../data.service";
export class MenuService {
    items;
    menuConfig;
    toolbarSelect;

    static $inject = ['$state', '$mdSidenav', '$mdMedia', 'DataService'];
    constructor(public $state, public $mdSidenav, public $mdMedia, private dataService: DataService) {
        this.menuConfig = dataService.config.menu;
        this.items = {};
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
                this.items[state.name] = state;
                if (! angular.isDefined(state.substates)) {
                    state.substates = {};
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
            if (angular.isDefined(this.items[parent.name])) {
                if (angular.isDefined(state.data.listByName)) {
                    let records = this.dataService.getTable(state.data.listByName);

                    for (let id in records) {
                        let record = records[id];

                        if (! angular.isDefined(parent.substates[record._id])) {
                            parent.substates[record._id] = {
                                name: state.name,
                                params: {
                                    name: record.name,
                                    id : record._id
                                },
                                title: record.name
                            };
                        }
                        else {
                            parent.substates[record._id].params.name  = record.name;
                            parent.substates[record._id].title = record.name;
                        }
                    }
                }
                else {
                    this.items[parent.name].substates[state.name] = state;
                }
            }
        }

        return this.items;
    }

    narrowMode() {
        return this.$mdMedia('max-width: 1000px');
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
            this.$mdSidenav(position).toggle();
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