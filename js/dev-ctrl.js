
// ../ng/StateConfig.js
DevCtrl = {};

DevCtrl.stateConfig = ['$stateProvider', '$locationProvider' , '$urlRouterProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $stateProvider
            .state('root', {
                'abstract': true,
                url: '',
                template: '<ui-view />'
            })
            .state('root.rooms', {
                url: '/rooms',
                templateUrl: 'ng/locations.html'
            })
            .state('root.room', {
                url: '/room/:name',
                templateUrl: 'ng/room.html',
                controller: 'RoomCtrl',
                controllerAs: 'room',
                resolve: DevCtrl.Room.Resolve
            })
            .state('root.config' , {
                'abstract': true,
                url: '/config',
                template: '<ui-view />'
            })
            .state('root.config.all', {
                url: '',
                templateUrl: 'ng/config.html'
            })
            .state('root.config.table', {
                url: '/:table',
                templateUrl: 'ng/tableeditor.html',
                controller: 'TableCtrl',
                controllerAs: 'table',
                resolve: DevCtrl.Table.Resolve
            });

        $urlRouterProvider
            .when("/", "/rooms");

        $locationProvider.html5Mode(true);
    }];
// ../ng/RoomCtrl.js
DevCtrl.Room = {};

DevCtrl.Room.Ctrl = ['$stateParams', 'DataService',
    function($stateParams, DataService) {
        var self = this;
        this.roomName = $stateParams.name;
        this.rooms = DataService.getTable('rooms');  // These tables are pre-resolved by the ui-router

        angular.forEach(this.rooms.listed, function(value) {
            if (value.fields['name'] == self.roomName) {
                self.obj = value;
                self.id = value.id;
            }
        });

        this.panels = this.obj.referenced.panels;

        // This function is here to prevent null reference errors
        this.panelControls = function(panel) {
            if (angular.isDefined(panel.referenced['panel_controls'])) {
                return panel.referenced['panel_controls'];
            }
        }

        this.togglePanel = function(panel) {
            if (! angular.isDefined(panel.opened)) {
                panel.opened = true;
            }
            else {
                panel.opened = ! panel.opened;
            }
        }

        this.isPanelOpen = function(panel) {
            var open = angular.isDefined(panel.opened) && panel.opened;
            return open;

        }
    }
];

DevCtrl.Room.Resolve = {
    // Load all controls.  Do something smarter with this if it starts slowing us down
    loadControls: function(DataService) {
        return DataService.getTablePromise('controls');
    },

    loadControlTemplates: function(DataService) {
        return DataService.getTablePromise('control_templates');
    },

    loadRooms : function(DataService) {
        return DataService.getTablePromise('rooms');
    },

    loadPanels : function(DataService) {
        return DataService.getTablePromise('panels');
    },

    loadPanelControls : function(DataService) {
        return DataService.getTablePromise('panel_controls');
    },

    loadControlSets : function(DataService) {
        return DataService.getTablePromise('control_sets');
    }
};
// ../ng/MainCtrl.js

DevCtrl.MainCtrl = ['$state', '$mdSidenav', 'DataService',
    function($state, $mdSidenav, DataService) {
        this.msg = "Hello World!";
        this.tiles = [
            {
                img: "/images/orc.png"
            },
            {
                img: "/images/pict.png"
            },
            {
                img: "/images/sage.png"
            }
        ];

        this.menu = DataService.getMenu();
        this.schema = DataService.getSchemas();

        this.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };

        this.go = function(state) {
            if (angular.isString(state)) {
                $state.go(state);
            }
            else {
                $state.go(state.name, state.params);
            }
        };

        this.dataModel = DataService.dataModel;
    }
];
// ../ng/MenuDirective.js
DevCtrl.Menu = {};

DevCtrl.Menu.Directive = function() {
    return {
        scope: true,
        bindToController: {
            items: '='
        },
        controller: function() {
        },
        controllerAs: 'menu',
        templateUrl: 'ng/menu.html'
    }
};
// ../ng/DataService.js
DevCtrl.DataService = {};

DevCtrl.DataService.factory = ['$http', '$mdToast', '$timeout', 'socketFactory',
    function($http, $mdToast, $timeout, socketFactory) {
        var dataModel = {};
        var schema = {};

        var ioSocket = io('https://devctrl.dwi.ufl.edu/');
        var messenger = socketFactory({ ioSocket: ioSocket});
        var pendingUpdates = {};

        /*
        * data row properties:
        *   id - primary key value
        *   fields - other columns as properties
        *   foreign - foreign key records
        *   loaded - has field data been loaded?
        *   referenced - other rows that reference this row
        */


        var methods = {
            messenger: messenger,
            dataModel : dataModel,
            addRow : function(row) {
                var self = this;

                $http.post("data.php", row)
                    .success(function(data) {
                        self.loadData(data);

                        angular.forEach(row, function(value, key) {
                            if (key != 'table') {
                                row[key] = null;
                            }
                        });
                    })
                    .error(function (data) {
                        self.errorToast(data);
                    })
            },

            deleteRow : function(row) {
                var self = this;
                var resource = "data.php/" + row.tableName + "/" + row.id;

                $http.delete(resource)
                    .success(function (data) {
                        self.loadData(data);
                    })
                    .error(function (data) {
                        self.errorToast(data);
                    });
            },

            errorToast: function(data) {
                var errorText = "An unknown error has occured"
                if (angular.isDefined(data.error)) {
                    errorText = data.error;
                }

                $mdToast.show($mdToast.simple().content(errorText));
            },

            getRowRef : function(tableName, key) {
                if (! angular.isDefined(tableName)) {
                    console.error("error looking up record for undefined table");
                    return {};
                }

                if (! angular.isDefined(key) || key === null) {
                    console.error("error looking up %s record for undefined key", tableName);
                    return {};
                }

                var table = this.getTableRef(tableName);

                if (angular.isString(schema[tableName].pk)) {
                    // Single key
                    if (! angular.isDefined(table.indexed[key])) {
                        table.indexed[key] = {
                            fields : {},
                            foreign: {},
                            id: key,
                            loaded: false,
                            referenced: {},
                            tableName: tableName
                        };
                        table.listed.push(table.indexed[key]);
                    }

                    return table.indexed[key];
                }
                else {
                    console.error("multi column keys not supported, table %s", tableName);
                }
            },



            getMenu : function() {
                var self = this;

                if (! angular.isDefined(dataModel.menu)) {
                    dataModel.menu = { items : {}};

                    $http.get('menu.php')
                        .success(function(data) {
                            if (angular.isDefined(data.menu.items)) {
                                console.log("test/menu.php loaded");
                                dataModel.menu.items = data.menu.items;
                            }
                            else {
                                console.log("test/menu.php did not return a valid menu object");
                            }
                        })
                        .error(function (data) {
                            self.errorToast(data);
                        })
                }

                return dataModel.menu;
            },

            getSchema : function(table) {
                var self = this;

                // The table argument is only used to determine if the schema has been loaded
                if (! angular.isDefined(schema[table])) {
                    self.getSchemaRef(table);

                    $http.get('schema.php')
                        .success(function(data) {
                            if (angular.isDefined(data.schema) ) {
                                angular.forEach(data.schema, function(value, tableName) {
                                    var tschema = self.getSchemaRef(tableName);
                                    angular.merge(tschema, value);

                                    if (angular.isDefined(tschema['foreign_keys'])) {
                                        angular.forEach(tschema['foreign_keys'], function(keyTable, keyName) {
                                            tschema.referenced[keyTable] = keyName;
                                        });
                                    }
                                })
                            }
                        })
                        .error(function (data) {
                            self.errorToast(data);
                        })
                }

                return schema[table];
            },

            getSchemaRef : function(tableName) {
                if (! angular.isDefined(schema[tableName])) {
                    schema[tableName] = {
                        referenced : {},
                        'foreign_keys' : {}
                    };
                }

                return schema[tableName];
            },

            getSchemas : function() {
                this.getSchema('controls');
                return schema;
            },
            getTable : function(table) {
                //console.log("DataService.getTable(" + table + ")");
                if (! angular.isDefined(dataModel[table])) {
                    this.getTableRef(table);
                    this.getTablePromise(table);
                }
                else if (! dataModel[table].loaded) {
                    dataModel[table].loaded = "pending";
                    this.getTablePromise(table);
                }

                return dataModel[table];
            },

            /**
             * Get a promise object representing an AJAX request for table data
             * @param table
             * @returns {*}
             */
            getTablePromise : function(table) {
                var self = this;
                if (angular.isDefined(table)) {
                    return $http.get('data.php?table=' + table)
                        .success(function (data) {
                            self.loadData(data);
                        })
                        .error(function (data) {
                            self.errorToast(data);
                        });
                }
                else {
                    console.error("error: attempt to fetch undefined table!");
                }
            },

            /**
             * Look up a table object by table name, instantiating the object if
             * necessary.
             * @param table
             * @returns {*}
             */
            getTableRef : function(table) {
                if (! angular.isDefined(dataModel[table])) {
                    dataModel[table] = {
                        listed: [],
                        indexed: {},
                        loaded : false
                    };
                }

                return dataModel[table];
            },

            loadData : function(data) {
                var self = this;

                if (angular.isDefined(data.update)) {
                    angular.forEach(data.update, function(tableData, tableName) {
                        angular.forEach(tableData, function(value, key) {
                            var row = self.getRowRef(tableName, key);
                            angular.merge(row.fields, value);
                        });
                    });
                }

                if (angular.isDefined(data.add)) {
                    angular.forEach(data.add, function(tableData, tableName) {
                        var tschema = self.getSchema(tableName);
                        var pk = tschema['pk'];
                        var fks = tschema['foreign_keys'];

                        angular.forEach(tableData, function(value, key) {
                            // Test if this is indexed on one or 2 columns
                            if (angular.isString(pk)) {
                                var row = self.getRowRef(tableName, key);
                                angular.merge(row.fields, value);
                                row.loaded = true;

                                // Set up foreign key object references
                                angular.forEach(fks, function(fkTable, fkField) {
                                    if (row.fields[fkField] !== null) {
                                        var fkRow = self.getRowRef(fkTable, row.fields[fkField]);
                                        if (!angular.isDefined(fkRow.referenced[tableName])) {
                                            fkRow.referenced[tableName] = {};
                                        }
                                        fkRow.referenced[tableName][row.id] = row;
                                        row.foreign[fkTable] = fkRow;
                                        row.foreign[fkField] = fkRow;
                                    }
                                    else {
                                        row.foreign[fkTable] = null;
                                        row.foreign[fkField] = null;
                                    }
                                });
                            }
                            else {
                                console.error("Error loading %s, multi-keyed records not supported", tableName);
                            }
                        });

                        dataModel[tableName].loaded = "loaded";
                    })
                }

                if (angular.isDefined(data.delete)) {
                    angular.forEach(data.delete, function(tableData, table) {
                        var pk = self.getSchema(table).pk;

                        angular.forEach(tableData, function(value, key) {
                            if (angular.isString(pk)) {
                                delete dataModel[table].indexed[key];
                            }
                            else {
                                angular.forEach(value, function(val2, key2) {
                                    delete dataModel[table].indexed[key][key2];
                                });
                            }
                        });

                        // Rebuild object list
                        dataModel[table].listed.length = 0;
                        angular.forEach(dataModel[table].indexed, function(value, key) {
                            if (angular.isString(pk)) {
                                dataModel[table].listed.push(value);
                            }
                            else {
                                angular.forEach(value, function(row) {
                                    dataModel[table].listed.push(row);
                                });
                            }
                        });
                    });
                }
            },


            updateControlValue : function(control) {
                var self = this;

                if (angular.isDefined(pendingUpdates[control.id])) {
                    $timeout.cancel(pendingUpdates[control.id]);
                }

                pendingUpdates[control.id] = $timeout(function(control, self) {
                    var resource = "control.php/" + control.id;
                    pendingDebounce = false;

                    $http.put(resource, control.fields)
                        .success(function(data) {
                            self.loadData(data);
                        })
                        .error(function (data) {
                            self.errorToast(data);
                        })
                }, 200, true, control, self);
            },

            // Use the debounce module to rate limit update requests
            // This function will execute the ajax request 100ms after it is called,
            // unless cancelled

            updateRow : function(row) {
                var self = this;
                var resource = "data.php/" + row.tableName + "/" + row.id;

                $http.put(resource, row.fields)
                    .success(function(data) {
                        self.loadData(data);
                    })
                    .error(function (data) {
                        self.errorToast(data);
                    });
            }
        };


        messenger.on('control-data', function(data) {
            methods.loadData(data);
            console.log("socket control data received");
        });


        return methods;
    }
];
// ../ng/EnumSelectDirective.js
DevCtrl.EnumSelect = {};

DevCtrl.EnumSelect.Directive = ['DataService', function(DataService) {
    return {
        scope: {
            tableName: '=table',
            field: '=',
            selectModel: '='
        },
        bindToController: true,
        controller: function(DataService) {
            this.enums = DataService.getTable('enums');
            this.enumVals = DataService.getTable('enum_vals');
            this.schema = DataService.getSchema(this.tableName);

            this.enumId = function() {
                var myId = 0;
                var enumName = this.tableName + "." + this.field.name;

                angular.forEach(this.enums.indexed, function(obj, id) {
                    if (obj.fields.name == enumName) {
                        myId = id;
                    }
                });

                return myId;
            };


            this.options = function() {
                var eid = this.enumId();

                var ret = {};
                if (eid > 0) {
                    ret = this.enums.indexed[eid].referenced['enum_vals'];
                }

                return ret;
            }
        },
        controllerAs: 'enumSelect',
        templateUrl: 'ng/enum-select.html'
    }
}];
// ../ng/CtrlDirective.js
DevCtrl.Ctrl = {};

DevCtrl.Ctrl.Directive  = ['DataService', function(DataService) {
    return {
        scope: {
            panelControl: '='
        },
        bindToController: true,
        controller: function(DataService) {
            this.ctrl = this.panelControl.foreign.controls;
            this.template = this.ctrl.foreign['control_templates'];
            this.name = this.panelControl.fields.name;
            this.type = this.template.fields.usertype;

            this.enums = DataService.getTable('enums');
            this.enumVals = DataService.getTable('enum_vals');

            var self = this;

            this.normalizedValue = function() {
                // Normalize a numeric value to a scale of 0 - 100
                var rawVal = self.ctrl.fields.value;
                var max = self.template.fields.max;
                var min = self.template.fields.min;

                rawVal = rawVal < min ? min : rawVal;
                rawVal = rawVal > max ? max : rawVal;

                var normVal = (rawVal + ( 0 - min )) * ( max - min ) / ( 100 - 0);

                return normVal;
            };


            this.updateValue = function() {
                DataService.updateControlValue(self.ctrl);
            };

            this.selectMenuItem = function(val) {
                self.ctrl.fields.value = val;
                self.updateValue();
            };

            this.selectOptions = function() {
                var eid = self.ctrl.fields.enum_id;

                var ret = {};
                if (eid > 0) {
                    ret = self.enums.indexed[eid].referenced.enum_vals;
                }

                return ret;
            }
        },
        controllerAs: 'ctrl',
        templateUrl: 'ng/ctrl.html'
    }
}];
// ../ng/SwitchSetDirective.js
DevCtrl.SwitchSet = {};

DevCtrl.SwitchSet.Directive  = ['DataService', function(DataService) {
    return {
        scope: true,
        bindToController: {
            control: '='
        },
        controller: function(DataService) {
            var self = this;

            var slaves = {};
            var slaveNames = {};

            this.setAll = function(value) {
                angular.forEach(slaves, function(slave, id) {
                    slave.fields.value = value;
                    DataService.updateControlValue(slave);
                })
            };

            this.slaveControls = function() {
                angular.forEach(self.control.referenced.control_sets, function(cs, csid) {
                    slaveNames[cs.foreign.slave_control_id.id] = cs.fields.name;
                    slaves[cs.foreign.slave_control_id.id] = cs.foreign.slave_control_id;
                });

                return slaves;
            };

            this.slaveName = function(slave) {
                return slaveNames[slave.id];
            };

            this.updateCtrlValue = function(uctrl) {
                DataService.updateControlValue(uctrl);
            };
        },
        controllerAs: 'switchSet',
        templateUrl: 'ng/switch-set.html'
    }
}];

// ../ng/RecordCtrl.js
DevCtrl.Record = {};

DevCtrl.Record.Ctrl = ['DataService',
    function(DataService) {
        this.obj = this.table.data.indexed[this.id];
        this.schema = this.table.schema;

        var self = this;

        this.deleteRow = function() {
            DataService.deleteRow(self.obj);
            this.table.closeRecord();
        };

        this.updateRow = function() {
            DataService.updateRow(self.obj);
            this.table.closeRecord();
        }

        this.cloneRow = function() {
            var newRow = angular.copy(self.obj.fields);
            newRow.table = self.obj.tableName;

            DataService.addRow(newRow);
            this.table.closeRecord();
        }

        this.close = function() {
            this.table.closeRecord();
        }
    }
];

DevCtrl.Record.Resolve = {
    loadTable : ['tableName', 'DataService',
        function(tableName, DataService) {
            return DataService.getTablePromise(tableName);
        }
    ]
}
// ../ng/FkSelectDirective.js
DevCtrl.FkSelect = {};

DevCtrl.FkSelect.Directive = ['DataService', function(DataService) {
    return {
        scope: {
            tableName: '=table',
            field: '=',
            selectModel: '='
        },
        bindToController: true,
        controller: function(DataService) {
            this.options = DataService.getTable(this.tableName);
            this.schema = DataService.getSchema(this.tableName);
        },
        controllerAs: 'fkSelect',
        templateUrl: 'ng/fk-select.html'
    }
}];
// ../ng/TableCtrl.js
DevCtrl.Table = {};

DevCtrl.Table.Ctrl = ['$scope', '$stateParams', '$mdDialog', 'DataService',
    function($scope, $stateParams, $mdDialog, DataService) {
        this.tableName = $stateParams.table;
        this.data = DataService.getTable(this.tableName);
        this.schema = DataService.getSchema(this.tableName);
        this.newRow = { table: this.tableName };

        DataService.messenger.emit('status-update', {
           message: "table " + this.tableName + " loaded"
        });

        this.addRow = function() {
            DataService.addRow(this.newRow);
        };

        this.deleteRow = function(row) {
            row.table = this.tableName;
            DataService.deleteRow(row);
        };

        this.fkDisplayVal = function(field, row) {
            var fkTable = this.schema.foreign_keys[field.name];
            var fkSchema = DataService.getSchema(fkTable);

            if (! angular.isDefined(row.foreign[field.name])) {
                return '';
            }

            var foreign = row.foreign[field.name];

            if (foreign == null) {
                return 'NULL';
            }

            var val = foreign.id;
            if (angular.isDefined(foreign.fields[fkSchema.fk_name])) {
                val = foreign.fields[fkSchema.fk_name];
            }

            return val;
        };

        var self = this;

        this.openRecord = function($event, id) {
            $mdDialog.show({
                targetEvent: $event,
                locals: {
                    id: id,
                    table: self
                },
                controller: DevCtrl.Record.Ctrl,
                controllerAs: 'record',
                bindToController: true,
                templateUrl: 'ng/record.html',
                clickOutsideToClose: true,
                hasBackdrop : false
            });
        }

        this.closeRecord = function() {
            $mdDialog.hide();
        }
    }
];

DevCtrl.Table.Resolve = {
    tableName: ['$stateParams', function ($stateParams) {
        return $stateParams.table;
    }]
};
// ../ng/DevCtrlApp.js

DevCtrl.App = angular.module('DevCtrlApp', ['ui.router', 'ngMaterial', 'btford.socket-io'])
    .factory('DataService', DevCtrl.DataService.factory)
    .directive('ctrl', DevCtrl.Ctrl.Directive)
    .directive('coeMenu', DevCtrl.Menu.Directive)
    .directive('fkSelect', DevCtrl.FkSelect.Directive)
    .directive('enumSelect', DevCtrl.EnumSelect.Directive)
    .directive('switchSet', DevCtrl.SwitchSet.Directive)
    .controller('MainCtrl', DevCtrl.MainCtrl)
    .controller('TableCtrl', DevCtrl.Table.Ctrl)
    .controller('RecordCtrl', DevCtrl.Record.Ctrl)
    .controller('RoomCtrl', DevCtrl.Room.Ctrl)
    .config(DevCtrl.stateConfig)


    .run (['$rootScope', function($rootScope) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
            console.log('$stateChangeError - fired when an error occurs during transition.');
            console.log(arguments);
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
        });

        $rootScope.$on('$viewContentLoaded', function (event) {
            console.log('$viewContentLoaded - fired after dom rendered', event);
        });

        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
            console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
            console.log(unfoundState, fromState, fromParams);
        })
    }]);



