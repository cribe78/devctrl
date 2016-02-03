
// ../ng/AdminOnlyDirective.js
DevCtrl = {};
DevCtrl.AdminOnly = {};

/**
 * The devctrl-admin-only directive can be applied to elements to remove them from the DOM if admin mode
 * is not enabled
 * @type {*[]}
 */

DevCtrl.AdminOnly.Directive  = ['$compile', 'DataService', function($compile, DataService) {
        return {
            restrict: 'A',
            replace: false,
            terminal: true,
            priority: 1000,
            link: function(scope, element, attrs) {
                var invert = false;
                if (element.attr('devctrl-admin-only') == 'invert') {
                    invert = true;
                }

                element.removeAttr('devctrl-admin-only');
                element.attr('ng-if', 'adminEnabled()');

                scope.adminEnabled = function() {
                    var resp = DataService.isAdminAuthorized() && DataService.config.editEnabled;
                    if (invert) {
                        resp = !resp;
                    }

                    return resp;
                };

                $compile(element)(scope);
            }
        }
    }
];
// ../ng/CommonResolve.js
DevCtrl.Common = {};

DevCtrl.Common.Resolve = {
    resetToolbar : function(MenuService) {
        MenuService.toolbarSelect.enable = false;
    },

    loadSchema : function(DataService) {
        console.log("loadSchema called");
        return DataService.getSchemaPromise();
    },

    loadClients: function(DataService) {
        return DataService.getTablePromise('clients');
    },
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

    loadEndpointTypes : function(DataService) {
        return DataService.getTablePromise('endpoint_types');
    },

    loadControlEndpoints : function(DataService) {
        return DataService.getTablePromise('control_endpoints');
    },

    loadUserInfo : function(DataService) {
        return DataService.getAdminAuth();
    }
};
// ../ng/controls/Slider2dDirective.js
DevCtrl.Slider2d = {};

DevCtrl.Slider2d.Directive  = ['DataService', function(DataService) {
    return {
        scope: {
            control: '='
        },
        bindToController: true,
        controller: function(DataService) {
            var self = this;
            var _xValue;
            var _yValue;

            this.xValue = function(val) {
                if (angular.isDefined(val)) {
                    _xValue = val;
                    self.control.ctrl.fields.value = _xValue + "," + _yValue;
                }
                else {
                    this.setXYVals();
                }

                return _xValue;
            };

            this.yValue = function(val) {
                if (angular.isDefined(val)) {
                    _yValue = val;
                    self.control.ctrl.fields.value = _xValue + "," + _yValue;
                }
                else {
                    this.setXYVals();
                }

                return _yValue;
            };

            this.setXYVals = function() {
                var xyVals = self.control.ctrl.fields.value.split(",");
                _xValue = angular.isDefined(xyVals[0]) ? xyVals[0] : 0;
                _xValue = parseInt(_xValue);
                _yValue = angular.isDefined(xyVals[1]) ? xyVals[1] : 0;
                _yValue = parseInt(_yValue);
            };
            this.setXYVals();

            this.updateValue = function() {
                DataService.updateControlValue(self.control.ctrl);
            };
        },
        controllerAs: 'slider2d',
        templateUrl: 'ng/controls/slider2d-directive.html'
    }
}];
// ../ng/CtrlDirective.js
DevCtrl.Ctrl = {};

DevCtrl.Ctrl.Directive  = ['DataService', 'MenuService', function(DataService, MenuService) {
    return {
        scope: {
            panelControl: '=',
            controlId: '='
        },
        bindToController: true,
        controller: function(DataService, MenuService) {
            this.menu = MenuService;

            this.panelContext = angular.isDefined(this.panelControl);
            if (this.panelContext) {
                this.ctrl = this.panelControl.foreign.controls;
                this.name = this.panelControl.fields.name;
            }
            else {
                this.ctrl = DataService.getTable('controls').indexed[this.controlId];
                this.name = this.ctrl.fields.name;
            }

            this.ctrlName = function() {
                if (this.panelContext && this.panelControl.fields.name !== '') {
                    return this.panelControl.fields.name;
                }
                else if (this.ctrl.fields.name != '') {
                    return this.ctrl.fields.name;
                }
                else {
                    return this.ctrl.foreign.control_templates.fields.name;
                }
            };

            this.template = this.ctrl.foreign['control_templates'];

            this.config = function(key) {
                if (angular.isObject(this.ctrl.fields.config) && angular.isDefined(this.ctrl.fields.config[key])) {
                    return this.ctrl.fields.config[key];
                }

                if (angular.isObject(this.template.fields.config) && angular.isDefined(this.template.fields.config[key])) {
                    return this.template.fields.config[key];
                }
            };

            this.intConfig = function(key) {
                var strConfig = self.config(key);

                return parseInt(strConfig);
            };

            this.appConfig = DataService.config;
            this.type = this.template.fields.usertype;

            this.enums = DataService.getTable('enums');
            this.enumVals = DataService.getTable('enum_vals');

            var self = this;

            this.normalizedValue = function() {
                // Normalize a numeric value to a scale of 0 - 100
                var rawVal = self.ctrl.fields.value;
                var max = self.intConfig('max');
                var min = self.intConfig('min');

                rawVal = rawVal < min ? min : rawVal;
                rawVal = rawVal > max ? max : rawVal;

                var normVal = (rawVal + ( 0 - min )) * ( max - min ) / ( 100 - 0);

                return normVal;
            };


            this.updateValue = function(val) {
                DataService.updateControlValue(self.ctrl);
            };

            this.editOptions = function($event) {
                DataService.editEnum($event, null, self.ctrl, {
                    title: "Edit " + self.name + " options"
                });
            };

            this.editTemplateOptions = function($event) {
                DataService.editEnum($event, null, self.template, {
                    title: "Edit " + self.ctrlName() + " options"
                });
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
                else if (self.template.fields.enum_id > 0) {
                    ret = self.template.foreign.enums.referenced.enum_vals;
                }

                return ret;
            };

            this.selectValueName = function() {
                var opts = self.selectOptions();
                var value = self.ctrl.fields.value;

                var ret = '';
                angular.forEach(opts, function(optObj) {
                        if (optObj.fields.value == value) {
                            ret = optObj.fields.name;
                        }
                });

                return ret;
            };

            this.showLog = function($event) {
                DataService.showControlLog($event, self.ctrl);
            };


            this.editPanelControl = function($event) {
                DataService.editRecord($event, self.panelControl.id, 'panel_controls');
            };

            this.editControl = function($event) {
                DataService.editRecord($event, self.ctrl.id, 'controls');
            };

            this.editTemplate = function($event) {
                DataService.editRecord($event, self.template.id, 'control_templates');
            };
        },
        controllerAs: 'ctrl',
        templateUrl: 'ng/ctrl.html'
    }
}];
// ../ng/CtrlLogCtrl.js
DevCtrl.CtrlLog = {};

DevCtrl.CtrlLog.Ctrl = ['DataService',
    function(DataService) {
        var self = this;

        this.logs = this.ctrl.referenced.control_log;

        this.close = function() {
            DataService.dialogClose();
        };
    }
];
// ../ng/DataService.js
DevCtrl.DataService = {};

DevCtrl.DataService.factory = ['$window', '$http', '$mdToast', '$timeout', 'socketFactory', '$mdDialog', '$location',
    function($window, $http, $mdToast, $timeout, socketFactory, $mdDialog, $location) {
        var dataModel = {
            user : {
                username: null,
                admin: false,
                client_id : 0
            },
            applog : []
        };
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

        //TODO: make this configurable
        var ioSocket = io('http://raspberrypi.local/');
        var messenger = socketFactory({ ioSocket: ioSocket});
        var pendingUpdates = {};
        var tablePromises = {};

        var clientConfig = {
            editEnabled: true
        };

        if (typeof($window.localStorage) !== 'undefined') {
            var localConfig = $window.localStorage.config;
            if (angular.isString(localConfig)) {
                clientConfig = JSON.parse(localConfig);
            }
            else {
                $window.localStorage.config = JSON.stringify(clientConfig);
            }
        }
        /*
        * data row properties:
        *   id - primary key value
        *   fields - other columns as properties
        *   foreign - foreign key records
        *   loaded - has field data been loaded?
        *   referenced - other rows that reference this row
        */


        var self = {
            config : clientConfig,
            messenger: messenger,
            dataModel : dataModel,
            schema : schema,
            addRow : function(row, callback) {
                $http.post("data.php", row)
                    .then(
                        function(response) {
                            var newId = Object.keys(response.data.add[row.tableName])[0];
                            console.log("new record " + newId + "added to " + row.tableName);

                            self.loadData(response.data);

                            var record = dataModel[row.tableName].indexed[newId];

                            angular.forEach(row, function(value, key) {
                                if (key != 'table') {
                                    row[key] = null;
                                }
                            });

                            if (angular.isFunction(callback)) {
                                callback(record);
                            }
                        },
                        function (response) {
                            self.errorToast(response.data);
                        }
                )
            },

            deleteRow : function(row) {
                var resource = "data.php/" + row.tableName + "/" + row.id;

                // Check for foreign key constraints
                var referencedTable = false;
                angular.forEach(row.referenced, function(refs, refTable) {
                    if (Object.keys(refs).length > 0) {
                        //TODO: cannot delete value due to foreign key constraint
                        referencedTable = refTable;
                    }
                });

                if (referencedTable) {
                    var msg = "Cannot delete " + row.tableName + " record due to foreign key constraint on " + referencedTable;

                    self.errorToast({error: msg});
                    return;
                }

                $http.delete(resource)
                    .success(function (data) {
                        self.loadData(data);
                    })
                    .error(function (data) {
                        self.errorToast(data);
                    });
            },

            editEnum : function($event, myEnum, enumRefRecord, options) {
                if (! angular.isObject(options)) {
                    options = {};
                }

                $mdDialog.show({
                    targetEvent: $event,
                    locals: {
                        myEnum: myEnum,
                        enumRefRecord: enumRefRecord,
                        options: options
                    },
                    controller: DevCtrl.EnumEditor.Ctrl,
                    controllerAs: 'editor',
                    bindToController: true,
                    templateUrl: 'ng/enum-editor.html',
                    clickOutsideToClose: true,
                    hasBackdrop : false
                });
            },

            editRecord : function($event, id, tableName, recordDefaults) {
                var record;
                if (id !== "0") {
                    record = self.getRowRef(tableName, id);
                }
                else {
                    record = self.getNewRowRef(tableName);

                    if (angular.isObject(recordDefaults)) {
                        angular.merge(record.fields, recordDefaults);
                    }
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
                //TODO: delete unused new record
                $mdDialog.hide();
            },

            errorToast: function(data) {
                var errorText = "An unknown error has occured"
                if (angular.isDefined(data.error)) {
                    errorText = data.error;
                }


                //$mdToast.show($mdToast.simple().content(errorText));
                $mdToast.show({
                    templateUrl: "ng/error-toast.html",
                    locals: {
                        message: errorText
                    },
                    controllerAs: "toast",
                    controller: 'RoomsCtrl',
                    bindToController: true,
                    position: 'top right',
                    hideDelay: 3000
                })
            },

            getAdminAuth : function(doLogin) {
                var url = "admin_auth.php";
                if (doLogin) {
                    var location = $location.path();
                    url = "admin_auth.php?logon=1&location=" + location;
                }

                return $http.get(url)
                    .then(function(response) {
                        if (angular.isDefined(response.data.user)) {
                            angular.merge(dataModel.user, response.data.user);
                        }
                        else {
                            console.log("admin_auth did not return an admin status");
                        }
                    }, function (response) {
                        if (response.status == '401') {
                            if (doLogin && angular.isDefined(response.data.location)) {
                                window.location = response.data.location;
                            }
                            else {
                                if (angular.isDefined(response.data.user)) {
                                    angular.merge(dataModel.user, response.data.user);
                                }

                                self.errorToast(response.data);
                            }
                        }
                    })
            },

            // Get the application log entries
            getLog : function() {
                return $http.get("log.php")
                    .then(function(response) {
                        if (angular.isDefined(response.data.applog)) {
                            dataModel.applog.length = 0;
                            angular.merge(dataModel.applog, response.data.applog);
                        }
                    })
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

            getSchemaPromise : function() {
                if (! schemaLoaded) {
                    return schemaPromise;
                }
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
                    tablePromises[table] = $http.get('data.php?table=' + table)
                        .then(
                            function (response) {
                                self.loadData(response.data);

                                if (schemaLoaded) {
                                    return dataModel[table];
                                }
                                return schemaPromise.then(
                                    function() {
                                        return dataModel[table];
                                    }
                                );
                            },
                            function (response) {
                                self.errorToast(response.data);
                            }
                        );
                    return tablePromises[table];
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

            isAdminAuthorized: function() {
                return dataModel.user.admin;
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

                    return schemaPromise;
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
                            // Remove references
                            var record = dataModel[table].indexed[key];

                            angular.forEach(record.foreign, function(referenced, refID) {
                                if (angular.isDefined(referenced.referenced[table][key])) {
                                    delete referenced.referenced[table][key];
                                }
                            });

                            delete dataModel[table].indexed[key];
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


            revokeAdminAuth : function() {
                $http.get('admin_auth_revoke.php')
                .then(function(response) {
                    if (angular.isDefined(response.data.user)) {
                        angular.merge(dataModel.user, response.data.user);
                    }
                    else {
                        console.log("revoke admin_auth did not return user info");
                    }
                }, function (response) {
                    self.errorToast(response.data);
                })
            },

            updateConfig : function() {
                if (typeof($window.localStorage) !== 'undefined') {
                    $window.localStorage.config = JSON.stringify(self.config);
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

        messenger.on('log-data', function(data) {
            self.dataModel.applog.push(data);
        });


        return self;
    }
];
// ../ng/EndpointCtrl.js
DevCtrl.Endpoint = {};

DevCtrl.Endpoint.Ctrl = ['$stateParams', 'DataService', 'MenuService',
    function($stateParams, DataService, MenuService) {
        var self = this;
        this.endpointId = $stateParams.id;
        this.endpoints = DataService.getTable('control_endpoints');
        this.obj = this.endpoints.indexed[this.endpointId];

        // The toolbar title uses this
        $stateParams.name = this.obj.fields.name;

        // This function is here to prevent null reference errors
        this.controls = this.obj.referenced['controls'];

        MenuService.toolbarSelectTable("control_endpoints", "endpoints.endpoint", self.obj.id);

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

        this.addTemplate = function($event) {
            DataService.editRecord($event, '0', 'control_templates',
                {
                    'endpoint_type_id' : self.obj.fields.endpoint_type_id
                }
            );
        };

        this.editEndpoint = function($event) {
            DataService.editRecord($event, this.endpointId, 'control_endpoints');
        };
    }
];


// ../ng/EndpointStatusDirective.js
DevCtrl.EndpointStatus = {};

DevCtrl.EndpointStatus.Directive  = ['DataService', function(DataService) {
    return {
        scope: {
            endpointId: '='
        },
        bindToController: true,
        controller: function(DataService) {
            var self = this;
            this.endpoint = DataService.getRowRef('control_endpoints', this.endpointId);

            this.status = function() {
                if (! self.endpoint.fields.enabled) {
                    return "disabled";
                }
                else if (self.endpoint.fields.status == '' || self.endpoint.fields.status == null) {
                    return "unknown";
                }

                return self.endpoint.fields.status;
            };

            this.statusIcon = function() {
                var status = self.status();

                if (status == "online") {
                    return "sync"
                }
                if (status == "disconnected") {
                    return "sync_problem";
                }
                if (status == "disabled") {
                    return "sync_disabled";
                }

                return "help";
            };

            this.statusIconClasses = function() {
                var status = self.status();

                if (status == "disabled") {
                    return "md-disabled";
                }

                if (status == "disconnected") {
                    return "md-warn";
                }

                return "md-primary md-hue-2";
            }
        },
        controllerAs: 'endpointStatus',
        templateUrl: 'ng/endpoint-status.html'
    }
}];
// ../ng/EnumEditorCtrl.js
DevCtrl.EnumEditor = {};


DevCtrl.EnumEditor.Ctrl = ['$mdDialog', 'DataService',
    function($mdDialog, DataService) {
        var self = this;
        this.enums = DataService.getTable("enums");
        this.enumVals = DataService.getTable("enum_vals");

        this.newEnumValue = DataService.getNewRowRef("enum_vals");
        this.isAddingEnum = false;

        this.title = function() {
            if (angular.isString(self.options.title)) {
                return self.options.title;
            }

            return "Edit " + self.myEnum.fields.name + " values";
        };

        this.isEnumSelectable = function() {
            return angular.isObject(self.enumRefRecord);
        };


        this.updateEnumValue = function(enumValue) {
            DataService.updateRow(enumValue);
        };

        this.addEnumValue = function() {
            self.newEnumValue.fields.enum_id = self.myEnum.id;
            self.newEnumValue.fields.enabled = 1;
            DataService.addRow(self.newEnumValue);
            self.newEnumValue = DataService.getNewRowRef("enum_vals");
        };

        this.newEnumCallback = function(enumObj) {
            self.enumRefRecord.fields.enum_id = enumObj.id;
            self.updateEnum();
        };

        this.deleteEnumValue = function(enumValue) {
            DataService.deleteRow(enumValue);
        };

        this.updateEnum = function() {
            if (self.enumRefRecord.fields.enum_id == 0) {
                self.isAddingEnum = true;
            }
            else {
                self.myEnum = self.enums.indexed[self.enumRefRecord.fields.enum_id];
                DataService.updateRow(self.enumRefRecord);
            }
        };

        this.addNewEnum = function() {
            self.newEnum = DataService.getNewRowRef("enums");
            self.newEnum.fields.name = self.newEnumName;
            DataService.addRow(self.newEnum, self.newEnumCallback);
            self.newEnumName = '';
            self.isAddingEnum = false;
        };

        if (this.isEnumSelectable) {
            self.myEnum = self.enums.indexed[self.enumRefRecord.fields.enum_id];
        };

        this.close = function() {
            $mdDialog.hide();
        };

    }];
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
// ../ng/FkSelectDirective.js
DevCtrl.FkSelect = {};

DevCtrl.FkSelect.Directive = ['DataService', function(DataService) {
    return {
        scope: {
            tableName: '=table',
            field: '=',
            selectModel: '=',
            fkOnChange: '=',
            addNewOption: '='
        },
        bindToController: true,
        controller: function(DataService) {
            var self = this;
            this.options = DataService.getTable(this.tableName);
            this.schema = DataService.getSchema(this.tableName);

            this.updateValue = function() {
                if (angular.isFunction(self.fkOnChange)) {
                    self.fkOnChange();
                }
            }
        },
        controllerAs: 'fkSelect',
        templateUrl: 'ng/fk-select.html'
    }
}];
// ../ng/LogCtrl.js
DevCtrl.Log = {};

DevCtrl.Log.Ctrl = ['DataService',
    function(DataService) {
        this.applog = DataService.dataModel.applog;
    }
];

DevCtrl.Log.Resolve = {
    loadLog: ['DataService', function(DataService) {
        return DataService.getLog();
    }]
};
// ../ng/MainCtrl.js

DevCtrl.MainCtrl = ['$state', '$mdMedia', 'DataService', 'MenuService',
    function($state, $mdMedia, DataService, MenuService) {
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
        this.$mdMedia = $mdMedia;
        this.control_endpoints = DataService.getTable('control_endpoints');
        this.config = DataService.config;
        this.user = DataService.dataModel.user;

        this.updateConfig = function() {
            DataService.updateConfig();
        };


        this.go = function(state) {
            if (angular.isString(state)) {
                $state.go(state);
            }
            else {
                $state.go(state.name, state.params);
            }
        };

        this.addEndpoint = function($event) {
            DataService.editRecord($event, '0', "control_endpoints");
        };

        this.addEndpointType = function($event) {
            DataService.editRecord($event, '0', "endpoint_types");
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
// ../ng/MenuService.js
DevCtrl.MenuService = {};

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

        var toolbarSelect = { enabled : false };

        var self = {
            toolbarSelect : toolbarSelect,

            toolbarSelectTable : function(tableName, destState, selectedId) {
                var table = DataService.getTable(tableName);
                toolbarSelect.options = table.listed.map(function(row) {
                    var option = {
                        value : row.id,
                        name : row.fields.name
                    };

                    return option;
                });

                toolbarSelect.tableName = tableName;
                toolbarSelect.destState = destState;
                toolbarSelect.selected = selectedId;
                toolbarSelect.enabled = true;
            },

            toolbarSelectUpdate : function() {
                var row = DataService.getRowRef(toolbarSelect.tableName, toolbarSelect.selected);
                self.go({
                    name : toolbarSelect.destState,
                    params : {
                        id : toolbarSelect.selected,
                        name : row.fields.name
                    }
                });
            },

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
// ../ng/ObjectEditorDirective.js
DevCtrl.ObjectEditor = {};

DevCtrl.ObjectEditor.Directive  = [ function() {
    return {
        scope: {
            object: '='
        },
        bindToController: true,
        controller: function() {
            var self = this;

            if (! angular.isDefined(this.object) || this.object == null || angular.isArray(this.object)) {
                this.object = {};
            }

            this.addItem = function(key, value) {
                if (angular.isDefined(this.newKey) && angular.isDefined(this.newVal)) {
                    this.object[this.newKey] = this.newVal;
                }

                this.newKey = undefined;
                this.newVal = undefined;

                angular.element('#oe-new-key').focus();
            }
        },
        controllerAs: 'obj',
        templateUrl: 'ng/object-editor.html'
    }
}];
// ../ng/PanelControlSelectorCtrl.js
DevCtrl.PanelControlSelector = {};

DevCtrl.PanelControlSelector.Ctrl = ['$mdDialog', 'DataService',
    function($mdDialog, DataService) {
        var self = this;
        this.endpointTypes = DataService.getTable("endpoint_types");
        this.endpoints = DataService.getTable("control_endpoints");
        this.controls = DataService.getTable("controls");
        this.control_templates = DataService.getTable("control_templates");

        this.newPanelControl = DataService.getNewRowRef("panel_controls");
        this.newPanelControl.fields.panel_id = this.panelId;

        this.endpointTypesSelected = [];
        this.endpointsSelected = [];
        this.endpointsSelected = '0';

        this.getControlName = function(row) {
            var ret = row.fields.name;

            if (row.fields.name == '') {
                ret = row.foreign.control_templates.fields.name;
            }

            return ret;
        };

        this.getEndpointTypes = function() {
            return this.endpointTypes.indexed;
        };

        this.getEndpoints = function() {
            return this.endpoints.indexed;
        };

        this.controlList = {};
        this.getControls = function() {

            angular.forEach(self.controls.indexed, function(control) {
                var loadControl = false;
                var loadAll = true;

                if (angular.isArray(self.endpointsSelected) && self.endpointsSelected.length > 0) {
                    loadAll = false;
                    var ctrlEp = control.fields.control_endpoint_id;

                    angular.forEach(self.endpointsSelected, function(endpointId) {
                        if (endpointId == ctrlEp) {
                            loadControl = true;
                        }
                    })

                }
                else if (self.endpointSelected !== '0') {
                    loadAll = false;
                    if (self.endpointSelected == control.foreign.control_endpoint_id.id) {
                        loadControl = true;
                    }
                }
                else if (angular.isArray(self.endpointTypesSelected) && self.endpointTypesSelected.length > 0) {
                    loadAll = false;
                    var ctrlEpType = control.foreign.control_endpoints.fields.endpoint_type_id;

                    angular.forEach(self.endpointTypesSelected, function(typeId) {
                        if (ctrlEpType == typeId) {
                            loadControl = true;
                        }
                    });
                }


                if (loadControl || loadAll) {
                    self.controlList[control.id] = control;
                }
                else {
                    delete self.controlList[control.id];
                }
            });

            return self.controlList;
        };

        this.endpointList = {};
        this.getEndpoints = function() {
            angular.forEach(self.endpoints.indexed, function(endpoint) {
                var loadEndpoint = false;
                var loadAll = true;
                if (angular.isArray(self.endpointTypesSelected) && self.endpointTypesSelected.length > 0) {
                    loadAll = false;
                    var epType = endpoint.fields.endpoint_type_id;

                    angular.forEach(self.endpointTypesSelected, function(typeId) {
                        if (epType == typeId) {
                            loadEndpoint = true;
                        }
                    });
                }

                if (loadEndpoint || loadAll) {
                    self.endpointList[endpoint.id] = endpoint;
                }
                else {
                    delete self.endpointList[endpoint.id];
                }
            });

            return self.endpointList;
        }

        this.clearEndpointTypes = function() {
            self.endpointTypesSelected = undefined;
        };

        this.clearEndpoints = function() {
            self.endpointsSelected = undefined;
        };

        this.addPanelControl = function() {
            DataService.addRow(self.newPanelControl);
            $mdDialog.hide();
        }

        this.cancelAdd = function() {
            $mdDialog.hide();
        }

    }
];

// ../ng/PanelDirective.js
DevCtrl.Panel = {};

DevCtrl.Panel.Directive  = ['$mdDialog', 'MenuService', 'DataService', function($mdDialog, MenuService, DataService) {
    return {
        scope: true,
        bindToController : {
            panelObj: '='
        },
        controller: function($mdDialog, MenuService, DataService) {
            var self = this;
            this.fields = this.panelObj.fields;
            this.menu = MenuService;

            this.addControl = function($event) {
                $mdDialog.show({
                    targetEvent: $event,
                    locals: {
                        panelId: this.panelObj.id
                    },
                    controller: DevCtrl.PanelControlSelector.Ctrl,
                    controllerAs: 'selector',
                    bindToController: true,
                    templateUrl: 'ng/panel-control-selector.html',
                    clickOutsideToClose: true,
                    hasBackdrop : false
                });
            };

            this.editPanel = function($event) {
                DataService.editRecord($event, this.panelObj.id, this.panelObj.tableName);
            };

            this.setAllSwitches = function(val) {
                angular.forEach(self.panelObj.referenced.panel_controls, function(pcontrol) {
                    var control = pcontrol.foreign.controls;

                    if (control.foreign.control_templates.fields.usertype == 'switch') {
                        control.fields.value = val;
                        DataService.updateControlValue(control);
                    }
                });
            };

            this.getRoomEndpoints = function(grouping) {
                var roomEndpoints = {};
                var ignoreGrouping = ! angular.isDefined(grouping);
                var room = self.panelObj.foreign.rooms;
                var panels = room.referenced.panels;

                angular.forEach(panels, function(panel, panelId) {
                    if (ignoreGrouping || panel.fields.grouping == grouping) {
                        var panelControls = panel.referenced.panel_controls;
                        angular.forEach(panelControls, function(panelControl, panelControlId) {
                            var endpoint = panelControl.foreign.controls.foreign.control_endpoints;
                            if (! angular.isDefined(roomEndpoints[endpoint.id])) {
                                roomEndpoints[endpoint.id] = endpoint;
                            }
                        });
                    }
                });

                return roomEndpoints;
            };

        },
        controllerAs: 'panel',
        templateUrl: 'ng/panel.html'
    }
}];
// ../ng/RecordCtrl.js
DevCtrl.Record = {};

DevCtrl.Record.Ctrl = ['DataService',
    function(DataService) {
        this.newRow = this.obj.id === '0';
        this.schema = DataService.getSchema(this.obj.tableName);
        this.editStack = [];

        var self = this;

        this.addRow = function() {
            DataService.addRow(self.obj);
            self.close(true);
        };

        this.deleteRow = function() {
            DataService.deleteRow(self.obj);
            self.close(true);
        };

        this.editOtherRow = function(row) {
            self.editStack.push(self.obj);
            self.obj = row;
            self.schema = DataService.getSchema(row.tableName);
        };

        this.updateRow = function() {
            DataService.updateRow(self.obj);
            self.close(true);
        };

        this.cloneRow = function() {
            var newRow = DataService.getNewRowRef(self.obj.tableName);
            newRow.fields = self.obj.fields;

            DataService.addRow(newRow, function(newRec) {
                self.obj = newRec;
                if (angular.isDefined(self.obj.fields.name)) {
                    self.obj.fields.name = "";
                }
            });
        };

        this.close = function(popStack) {
            if (popStack && self.editStack.length > 0) {
                self.obj = self.editStack.pop();
                self.schema = DataService.getSchema(self.obj.tableName);
            }
            else {
                DataService.editRecordClose();
            }
        }
    }
];

// ../ng/RoomCtrl.js
DevCtrl.Room = {};

DevCtrl.Room.Ctrl = ['$stateParams', 'DataService', 'MenuService',
    function($stateParams, DataService, MenuService) {
        var self = this;
        this.menu = MenuService;
        this.rooms = DataService.getTable('rooms');  // These tables are pre-resolved by the ui-router

        if (angular.isDefined(this.rooms.indexed[$stateParams.id])) {
            this.obj = this.rooms.indexed[$stateParams.id];
            this.id = $stateParams.id;
            $stateParams.name = this.obj.fields.name;
        }
        else {
            angular.forEach(this.rooms.listed, function (value) {
                if (value.fields['name'] == $stateParams.name) {
                    self.obj = value;
                    self.id = value.id;
                }
            });
        }

        this.menu.toolbarSelectTable("rooms", "rooms.room", self.id);

        this.panels = this.obj.referenced.panels;

        this.addPanel = function($event) {
            DataService.editRecord($event, '0', 'panels',
                {
                    'room_id' : self.id
                }
            );
        };

        this.config = DataService.config;
        var roomConfig = {};
        if (! angular.isObject(this.config.rooms)) {
            this.config.rooms = {};
        }
        if (! angular.isObject(this.config.rooms[self.id])) {
            this.config.rooms[this.id] = {
                groups: {}
            }
        }

        roomConfig = this.config.rooms[this.id];

        this.getGroups = function() {
            var deleteGroups = {};
            angular.forEach(roomConfig.groups, function(group, groupName) {
                deleteGroups[groupName] = true;
            });


            angular.forEach(self.panels, function(panel) {
                if (! angular.isDefined(roomConfig.groups[panel.fields.grouping])) {
                    roomConfig.groups[panel.fields.grouping] = {
                        opened: false
                    };
                    deleteGroups[panel.fields.grouping] = false;
                }
                else {
                    deleteGroups[panel.fields.grouping] = false;
                }
            });

            angular.forEach(deleteGroups, function(group, groupName) {
                if (group) {
                    delete roomConfig.groups[groupName];
                }
            });

            return roomConfig.groups;
        };

        this.getRoomEndpoints = function(grouping) {
            var roomEndpoints = {};
            var ignoreGrouping = ! angular.isDefined(grouping);
            var room = self.obj;
            var panels = room.referenced.panels;

            angular.forEach(panels, function(panel, panelId) {
                if (ignoreGrouping || panel.fields.grouping == grouping) {
                    var panelControls = panel.referenced.panel_controls;
                    angular.forEach(panelControls, function(panelControl, panelControlId) {
                        var endpoint = panelControl.foreign.controls.foreign.control_endpoints;
                        if (! angular.isDefined(roomEndpoints[endpoint.id])) {
                            roomEndpoints[endpoint.id] = endpoint;
                        }
                    });
                }
            });

            return roomEndpoints;
        };

        // This function is here to prevent null reference errors
        this.panelControls = function(panel) {
            if (angular.isDefined(panel.referenced['panel_controls'])) {
                return panel.referenced['panel_controls'];
            }
        };

        this.toggleGroup = function(group) {
            group.opened = ! group.opened;

            DataService.updateConfig();
        };
    }
];

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

// ../ng/StateConfig.js

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
            .state('config.log', {
                url: '/log',
                templateUrl: 'ng/log.html',
                controller: 'LogCtrl',
                controllerAs: 'log',
                resolve: DevCtrl.Log.Resolve,
                data: {
                    title : "Log Viewer"
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
        };

        this.updateRow = function($event, row) {
            DataService.updateRow(row);
        };

    }
];

DevCtrl.Table.Resolve = {
    tableName: ['$stateParams', function ($stateParams) {
        return $stateParams.table;
    }]
};
// ../ng/ToolbarDirective.js
DevCtrl.Toolbar = {};

DevCtrl.Toolbar.Directive  = ['$mdMedia', '$state', 'MenuService', 'DataService', function($mdMedia, $state, MenuService, DataService) {
    return {
        scope: true,
        bindToController : {
            title: '='
        },
        controller: function($state, MenuService, DataService) {
            var self = this;
            this.menu = MenuService;
            this.user = DataService.dataModel.user;
            this.config = DataService.config;
            this.$mdMedia = $mdMedia;

            this.client = function() {
                return DataService.getRowRef("clients", self.user.client_id);
            };


            this.pageTitle = function() {
                if (angular.isDefined(self.title)) {
                    return self.title;
                }

                return $state.current.title || $state.params.name;
            };

            this.adminLogin = function() {
                DataService.getAdminAuth(true);
            };

            this.editClient = function($event) {
                DataService.editRecord($event, self.user.client_id, "clients");
            };


            this.revokeAdmin = function() {
                DataService.revokeAdminAuth();
            };

            this.updateConfig = function() {
                DataService.updateConfig();
            };

        },
        controllerAs: 'toolbar',
        templateUrl: 'ng/toolbar.html'
    }
}];
// ../ng/DevCtrlApp.js

DevCtrl.App = angular.module('DevCtrlApp', ['ui.router', 'ngMaterial', 'btford.socket-io', 'angular-toArrayFilter'])
    .factory('DataService', DevCtrl.DataService.factory)
    .factory('MenuService', DevCtrl.MenuService.factory)
    .directive('ctrl', DevCtrl.Ctrl.Directive)
    .directive('coeMenu', DevCtrl.Menu.Directive)
    .directive('devctrlPanel', DevCtrl.Panel.Directive)
    .directive('fkSelect', DevCtrl.FkSelect.Directive)
    .directive('enumSelect', DevCtrl.EnumSelect.Directive)
    .directive('devctrlSlider2d', DevCtrl.Slider2d.Directive)
    .directive('devctrlObjectEditor', DevCtrl.ObjectEditor.Directive)
    .directive('devctrlAdminOnly', DevCtrl.AdminOnly.Directive)
    .directive('devctrlEndpointStatus', DevCtrl.EndpointStatus.Directive)
    .directive('devctrlToolbar', DevCtrl.Toolbar.Directive)
    .controller('MainCtrl', DevCtrl.MainCtrl)
    .controller('EnumEditorCtrl', DevCtrl.EnumEditor.Ctrl)
    .controller('PanelControlSelectorCtrl', DevCtrl.PanelControlSelector.Ctrl)
    .controller('EndpointCtrl', DevCtrl.Endpoint.Ctrl)
    .controller('LogCtrl', DevCtrl.Log.Ctrl)
    .controller('CtrlLog', DevCtrl.CtrlLog.Ctrl)
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



