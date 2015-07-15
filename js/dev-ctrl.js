
// ../ng/StateConfig.js
DevCtrl = {};

DevCtrl.stateConfig = ['$stateProvider', '$locationProvider' , '$urlRouterProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $stateProvider
            .state('rooms', {
                url: '/rooms',
                scope: true,
                controller: 'RoomsCtrl',
                controllerAs: 'rooms',
                templateUrl: 'ng/locations.html',
                resolve: DevCtrl.Common.Resolve,
                data : {
                    title: 'Locations'
                }
            })
            .state('rooms.room', {
                url: '/:name',
                templateUrl: 'ng/room.html',
                controller: 'RoomCtrl',
                controllerAs: 'room',
                data : {
                        listByName : 'rooms',
                        title : false
                }
            })
            .state('endpoints', {
                url: '/devices',
                templateUrl : 'ng/endpoints.html',
                resolve: DevCtrl.Common.Resolve,
                data : {
                    title : 'Devices'
                }
            })
            .state('endpoints.endpoint', {
                url: '/:id',
                templateUrl : 'ng/endpoint.html',
                controller: 'EndpointCtrl',
                controllerAs: 'endpoint',
                data : {
                    listByName : 'control_endpoints',
                    title : false
                }
            })
            .state('config' , {
                url: '/config',
                scope: true,
                templateUrl: 'ng/config.html',
                resolve : DevCtrl.Common.Resolve,
                data : {
                    title : 'Configuration'
                }
            })
            .state('config.data', {
                url: '/data',
                templateUrl: 'ng/data.html',
                data : {
                    title : 'Data Tables'
                }
            })
            .state('config.data.table', {
                url: '/:name',
                templateUrl: 'ng/tableeditor.html',
                controller: 'TableCtrl',
                controllerAs: 'table',
                resolve: DevCtrl.Table.Resolve,
                data : {
                    title : "Table Editor"
                }
            });

        $urlRouterProvider
            .when("/", "/rooms");

        $locationProvider.html5Mode(true);
    }];
// ../ng/CommonResolve.js
DevCtrl.Common = {};

DevCtrl.Common.Resolve = {
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
        };

        this.togglePanel = function(panel) {
            if (! angular.isDefined(panel.opened)) {
                panel.opened = true;
            }
            else {
                panel.opened = ! panel.opened;
            }
        };

        this.isPanelOpen = function(panel) {
            var open = angular.isDefined(panel.opened) && panel.opened;
            return open;

        };
    }
];

// ../ng/MainCtrl.js

DevCtrl.MainCtrl = ['$state', '$mdSidenav', 'DataService', 'MenuService',
    function($state, $mdSidenav, DataService, MenuService) {
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

        this.$state = $state;
        this.schema = DataService.schema;
        this.menu = MenuService;
        this.control_endpoints = DataService.getTable('control_endpoints');

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

        this.title = "DevCtrl";
        this.top = true;
    }
];
// ../ng/MenuDirective.js
DevCtrl.Menu = {};

DevCtrl.Menu.Directive = ['MenuService', '$state',
    function(MenuService, $state) {
        return {
            scope: true,
            bindToController: {},
            controller: function(MenuService, $state) {
                this.service = MenuService;
            },
            controllerAs: 'menu',
            templateUrl: 'ng/menu.html'
        }
    }
];
// ../ng/DataService.js
DevCtrl.DataService = {};

DevCtrl.DataService.factory = ['$http', '$mdToast', '$timeout', 'socketFactory', '$mdDialog',
    function($http, $mdToast, $timeout, socketFactory, $mdDialog) {
        var dataModel = {};
        var schema = {};
        var schemaLoaded = false;

        var schemaPromise = $http.get('schema.php')
            .success(function(data) {
                if (angular.isDefined(data.schema) ) {
                    angular.forEach(data.schema, function(value, tableName) {
                        var tschema = self.getSchema(tableName);
                        angular.merge(tschema, value);

                        if (angular.isDefined(tschema['foreign_keys'])) {
                            angular.forEach(tschema['foreign_keys'], function(keyTable, keyName) {
                                tschema.referenced[keyTable] = keyName;
                            });
                        }
                    })
                }

                schemaLoaded = true;
            })
            .error(function (data) {
                self.errorToast(data);
            });


        var ioSocket = io('https://devctrl.dwi.ufl.edu/');
        var messenger = socketFactory({ ioSocket: ioSocket});
        var pendingUpdates = {};
        var tablePromises = {};

        /*
        * data row properties:
        *   id - primary key value
        *   fields - other columns as properties
        *   foreign - foreign key records
        *   loaded - has field data been loaded?
        *   referenced - other rows that reference this row
        */


        var self = {
            messenger: messenger,
            dataModel : dataModel,
            schema : schema,
            addRow : function(row) {
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
                var resource = "data.php/" + row.tableName + "/" + row.id;

                $http.delete(resource)
                    .success(function (data) {
                        self.loadData(data);
                    })
                    .error(function (data) {
                        self.errorToast(data);
                    });
            },

            editRecord : function($event, id, tableName) {
                var record;
                if (id !== "0") {
                    record = self.getRowRef(tableName, id);
                }
                else {
                    record = self.getNewRowRef(tableName);
                }

                $mdDialog.show({
                    targetEvent: $event,
                    locals: {
                        obj: record
                    },
                    controller: DevCtrl.Record.Ctrl,
                    controllerAs: 'record',
                    bindToController: true,
                    templateUrl: 'ng/record.html',
                    clickOutsideToClose: true,
                    hasBackdrop : false
                });
            },

            editRecordClose : function() {
                $mdDialog.hide();
            },

            errorToast: function(data) {
                var errorText = "An unknown error has occured"
                if (angular.isDefined(data.error)) {
                    errorText = data.error;
                }

                $mdToast.show($mdToast.simple().content(errorText));
            },

            getNewRowRef : function(tableName) {
                var newRow = {
                    id : '0',
                    referenced : {},
                    tableName : tableName,
                    fields : {}
                };
                var tSchema = self.getSchema(tableName);

                angular.forEach(tSchema.fields, function(value, name) {
                    newRow.fields[name] = '';
                });

                return newRow;
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
                if (! schema.loaded) {
                    // The table argument is only used to determine if the schema has been loaded
                    if (! angular.isDefined(schema[table])) {
                        schema[table] = {
                            referenced : {},
                            'foreign_keys' : {}
                        };
                    }
                }

                return schema[table];
            },

            getTable : function(table) {
                //console.log("DataService.getTable(" + table + ")");
                if (! angular.isDefined(dataModel[table])) {
                    this.getTableRef(table);
                    tablePromises[table] = this.getTablePromise(table);
                }
                else if (! angular.isDefined(tablePromises[table])) {
                    tablePromises[table] = this.getTablePromise(table);
                }

                return dataModel[table];
            },

            /**
             * Get a promise object representing an AJAX request for table data
             * @param table
             * @returns {*}
             */
            getTablePromise : function(table) {
                if (angular.isDefined(tablePromises[table])) {
                    return tablePromises[table];
                }

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
                if (schemaLoaded) {
                    //console.log("loading data");
                    self.loadDataKernel(data);
                } else {
                    //console.log("deferring data loading");
                    schemaPromise = schemaPromise.then( function() {
                        //console.log("loading deffered data");
                        self.loadDataKernel(data);
                    });
                }
            },

            loadDataKernel : function(data) {
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
            self.loadData(data);
            //console.log("socket control data received");
        });


        return self;
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
            panelControl: '=',
            controlId: '='
        },
        bindToController: true,
        controller: function(DataService) {
            if (angular.isDefined(this.panelControl)) {
                this.ctrl = this.panelControl.foreign.controls;
                this.name = this.panelControl.fields.name;
            }
            else {
                this.ctrl = DataService.getTable('controls').indexed[this.controlId];
                this.name = this.ctrl.fields.name;
            }
            this.template = this.ctrl.foreign['control_templates'];

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
        this.newRow = this.obj.id === '0';
        this.schema = DataService.getSchema(this.obj.tableName);

        var self = this;

        this.addRow = function() {
            DataService.addRow(self.obj);
            DataService.editRecordClose();
        };

        this.deleteRow = function() {
            DataService.deleteRow(self.obj);
            DataService.editRecordClose();
        };

        this.updateRow = function() {
            DataService.updateRow(self.obj);
            DataService.editRecordClose();
        };

        this.cloneRow = function() {
            var newRow = angular.copy(self.obj);

            DataService.addRow(newRow);
            DataService.editRecordClose();
        };

        this.close = function() {
            DataService.editRecordClose();
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
// ../ng/MenuService.js
DevCtrl.MenuService = {};

DevCtrl.MenuService.factory = ['$state', 'DataService',
    function ($state, DataService) {
        var items = {};


        var self = {
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
            }
        };

        return self;
    }];
// ../ng/EndpointCtrl.js
DevCtrl.Endpoint = {};

DevCtrl.Endpoint.Ctrl = ['$stateParams', 'DataService',
    function($stateParams, DataService) {
        var self = this;
        this.endpointId = $stateParams.id;
        this.endpoints = DataService.getTable('control_endpoints');
        this.obj = this.endpoints.indexed[this.endpointId];

        // The toolbar title uses this
        $stateParams.name = this.obj.fields.name;

        // This function is here to prevent null reference errors
        this.controls = this.obj.referenced['controls'];

        this.togglePanel = function(panel) {
            if (! angular.isDefined(panel.opened)) {
                panel.opened = true;
            }
            else {
                panel.opened = ! panel.opened;
            }
        };

        this.isPanelOpen = function(panel) {
            var open = angular.isDefined(panel.opened) && panel.opened;
            return open;

        };
    }
];


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

DevCtrl.Table.Ctrl = ['$scope', '$stateParams',  'DataService',
    function($scope, $stateParams, DataService) {
        var self = this;

        this.tableName = $stateParams.name;
        this.data = DataService.getTable(this.tableName);
        this.schema = DataService.getSchema(this.tableName);
        this.newRow = { table: this.tableName };

        DataService.messenger.emit('status-update', {
           message: "table " + this.tableName + " loaded"
        });

        this.sortColumn = 'id';
        this.sortReversed = false;

        this.setSortColumn = function(field) {
          if ( 'fields.' + field.name === this.sortColumn ) {
              this.sortReversed = !this.sortReversed;
          }  else {
              this.sortColumn = 'fields.' + field.name;
              this.sortReversed = false;
          }
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

        this.addRow = function($event) {
            DataService.editRecord($event, '0', self.tableName);
        };

        this.openRecord = function($event, id) {
            DataService.editRecord($event, id, self.tableName);
        }

        this.updateRow = function($event, row) {
            DataService.updateRow(row);
        }

    }
];

DevCtrl.Table.Resolve = {
    tableName: ['$stateParams', function ($stateParams) {
        return $stateParams.table;
    }]
};
// ../ng/RoomsCtrl.js
DevCtrl.Rooms = {};

DevCtrl.Rooms.Ctrl = ['DataService',
    function(DataService) {
        this.list = DataService.getTable('rooms').listed;

        this.imageUrl = function(room) {
            return "/images/" + room.fields.name + ".png";
        }

    }
];

// ../ng/DevCtrlApp.js

DevCtrl.App = angular.module('DevCtrlApp', ['ui.router', 'ngMaterial', 'btford.socket-io'])
    .factory('DataService', DevCtrl.DataService.factory)
    .factory('MenuService', DevCtrl.MenuService.factory)
    .directive('ctrl', DevCtrl.Ctrl.Directive)
    .directive('coeMenu', DevCtrl.Menu.Directive)
    .directive('fkSelect', DevCtrl.FkSelect.Directive)
    .directive('enumSelect', DevCtrl.EnumSelect.Directive)
    .directive('switchSet', DevCtrl.SwitchSet.Directive)
    .controller('MainCtrl', DevCtrl.MainCtrl)
    .controller('EndpointCtrl', DevCtrl.Endpoint.Ctrl)
    .controller('TableCtrl', DevCtrl.Table.Ctrl)
    .controller('RecordCtrl', DevCtrl.Record.Ctrl)
    .controller('RoomCtrl', DevCtrl.Room.Ctrl)
    .controller('RoomsCtrl', DevCtrl.Rooms.Ctrl)
    .config(DevCtrl.stateConfig)

//state change debugging
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



