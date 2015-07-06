goog.provide('DevCtrl.DataService.factory');

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
            //console.log("socket control data received");
        });


        return methods;
    }
];