goog.provide('DevCtrl.MenuService.factory');

DevCtrl.MenuService.factory = ['$state', '$mdSidenav', '$mdMedia', 'DataService',
    function ($state, $mdSidenav, $mdMedia, DataService) {
        var items = {};

        var menuConfig = {
            sidenavOpen : false
        };

        if (angular.isObject(DataService.config.menu)) {
            menuConfig = DataService.config.menu;
        }
        else {
            DataService.config.menu = menuConfig;
        }

        var self = {
            backgroundImageStyle : function() {
                if (angular.isDefined($state.current.name) && angular.isDefined($state.params.name)) {
                    var img = "url(/images/backgrounds/" + $state.current.name + "/" + $state.params.name + ".jpg)";
                    return {'background-image': img};
                }
                return {};
            },
            go : function(state) {
                if (angular.isString(state)) {
                    $state.go(state);
                }
                else {
                    $state.go(state.name, state.params);
                }
            },
            pageTitle : function() {
                return $state.current.title || $state.params.name;
            },
            parentState : function() {
                return $state.get('^');
            },
            isFirstLevel : function() {
                return $state.current.name === "" || $state.get('^').name === "";
            },
            items : items,
            states : function () {
                return $state.get();
            },

            menuItems : function() {
                var states = $state.get();

                // Loop through once to identify top level states
                angular.forEach(states, function(state, key) {
                    if (state.name == "") {
                        return;
                    }

                    state.isOpened = $state.includes(state);

                    var parent = $state.get('^', state);

                    if (parent.name == "") {
                        self.items[state.name] = state;
                        if (! angular.isDefined(state.substates)) {
                            state.substates = {};
                        }
                    }

                    if (angular.isDefined(state.data.title)) {
                        state.title = state.data.title;
                    }
                });

                // Populate second level states
                angular.forEach(states, function(state, key) {
                    if (state.name == "") {
                        return;
                    }

                    var parent = $state.get('^', state);
                    if (angular.isDefined(self.items[parent.name])) {
                        if (angular.isDefined(state.data.listByName)) {
                            var records = DataService.getTable(state.data.listByName).listed;

                            angular.forEach(records, function(record) {
                                if (! angular.isDefined(parent.substates[record.id])) {
                                    parent.substates[record.id] = {
                                        name: state.name,
                                        params: {
                                            name: record.fields.name,
                                            id : record.id
                                        },
                                        title: record.fields.name
                                    };
                                }
                                else {
                                    parent.substates[record.id].params.name  = record.fields.name;
                                    parent.substates[record.id].title = record.fields.name;
                                }
                            });
                        }
                        else {
                            self.items[parent.name].substates[state.name] = state;
                        }
                    }
                });

                return self.items;
            },


            hideSidenavButton : function() {
                if (self.narrowMode()) {
                    return false;
                }
                return menuConfig.sidenavOpen;
            },

            isSidenavOpen: function() {
                return menuConfig.sidenavOpen;
            },

            toggleSidenav: function(position) {
                if (! angular.isDefined(menuConfig.sidenavOpen)) {
                    menuConfig.sidenavOpen = false;
                }

                menuConfig.sidenavOpen = ! menuConfig.sidenavOpen;
                DataService.updateConfig();

                if (self.narrowMode()) {
                    $mdSidenav(position).toggle();
                }
            },

            narrowMode : function() {
                return $mdMedia('max-width: 1000px');
            }
        };

        return self;
    }];