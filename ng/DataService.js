goog.provide('DevCtrl.DataService.factory');

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
        var ioSocket = io($location.protocol() + "://" + $location.host());
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