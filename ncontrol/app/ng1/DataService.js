"use strict";
var RecordCtrl_1 = require("./RecordCtrl");
var EnumEditorCtrl_1 = require("./EnumEditorCtrl");
var CtrlLogCtrl_1 = require("./CtrlLogCtrl");
exports.DataServiceFactory = ['$window', '$http', '$mdToast', '$timeout', '$q', 'socketFactory', '$mdDialog', '$location',
    function ($window, $http, $mdToast, $timeout, $q, socketFactory, $mdDialog, $location) {
        var dataModel = {
            applog: [],
            menu: { items: {} }
        };
        var userSession = {
            _id: '',
            username: null,
            login_expires: 0,
            auth: false,
            admin_auth: false,
            admin_auth_expires: 0
        };
        var schema = { loaded: false };
        var schemaLoaded = false;
        var schemaPromise = $http.get('schema.php')
            .success(function (data) {
            if (angular.isDefined(data.schema)) {
                angular.forEach(data.schema, function (value, tableName) {
                    var tschema = self.getSchema(tableName);
                    angular.merge(tschema, value);
                    if (angular.isDefined(tschema['foreign_keys'])) {
                        angular.forEach(tschema['foreign_keys'], function (keyTable, keyName) {
                            tschema.referenced[keyTable] = keyName;
                        });
                    }
                });
            }
            schemaLoaded = true;
        })
            .error(function (data) {
            self.errorToast(data);
        });
        //TODO: make this configurable
        var ioSocket = io($location.protocol() + "://" + $location.host());
        var messenger = socketFactory({ ioSocket: ioSocket });
        var pendingUpdates = {};
        var tablePromises = {};
        var clientConfig = {
            editEnabled: true,
            lastLogonAttempt: 0
        };
        if (typeof ($window.localStorage) !== 'undefined') {
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
            config: clientConfig,
            messenger: messenger,
            dataModel: dataModel,
            userSession: userSession,
            schema: schema,
            getMProm: null,
            addRow: function (row, callback) {
                var req = {};
                req[row.tableName] = [row.fields];
                messenger.emit('add-data', req, function (response) {
                    if (response.error) {
                        self.errorToast(response.error);
                        return;
                    }
                    var newId = Object.keys(response.data.add[row.tableName])[0];
                    console.log("new record " + newId + "added to " + row.tableName);
                    self.loadData(response.data);
                    var record = dataModel[row.tableName].indexed[newId];
                    angular.forEach(row, function (value, key) {
                        if (key != 'tableName') {
                            row[key] = null;
                        }
                    });
                    if (angular.isFunction(callback)) {
                        callback(record);
                    }
                });
            },
            dialogClose: function () {
                $mdDialog.hide();
            },
            deleteRow: function (row) {
                var resource = "api/data/" + row.tableName + "/" + row.id;
                // Check for foreign key constraints
                var referencedTable = false;
                angular.forEach(row.referenced, function (refs, refTable) {
                    if (Object.keys(refs).length > 0) {
                        //TODO: cannot delete value due to foreign key constraint
                        referencedTable = refTable;
                    }
                });
                if (referencedTable) {
                    var msg = "Cannot delete " + row.tableName + " record due to foreign key constraint on " + referencedTable;
                    self.errorToast({ error: msg });
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
            doAdminLogon: function () {
                // First, check current login status
                if (self.userSession.login_expires > Date.now()) {
                    var url = "/auth/admin_auth";
                    $http.get(url).then(
                    //Success
                    function (response) {
                        angular.merge(self.userSession, response.data.session);
                    }, 
                    //Failure
                    function (response) {
                        if (response.status == 401) {
                            self.errorToast("You are not authorize to access admin functions");
                        }
                        else {
                            self.errorToast("Admin auth error: " + response.status);
                        }
                    });
                }
                else {
                    self.doLogon(true);
                }
            },
            doLogon: function (admin_auth_check) {
                if (admin_auth_check === void 0) { admin_auth_check = false; }
                if (userSession.login_expires < Date.now()) {
                    // Circuit breaker for login loops
                    if (self.config.lastLogonAttempt) {
                        var timeSinceLogon = Date.now() - self.config.lastLogonAttempt;
                        if (timeSinceLogon < 10) {
                            self.errorToast("Login loop detected.  Not processing logon request");
                            return;
                        }
                    }
                    self.config.lastLogonAttempt = Date.now();
                    self.updateConfig();
                    var location_1 = $location.path();
                    var newLocation = "/auth/do_logon?";
                    if (admin_auth_check) {
                        newLocation = newLocation + "admin_auth_requested=1&";
                    }
                    newLocation = newLocation + "location=" + location_1;
                    window.location.href = newLocation;
                }
            },
            editEnum: function ($event, myEnum, enumRefRecord, options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                $mdDialog.show({
                    targetEvent: $event,
                    locals: {
                        myEnum: myEnum,
                        enumRefRecord: enumRefRecord,
                        options: options
                    },
                    controller: EnumEditorCtrl_1.EnumEditorCtrl,
                    controllerAs: 'editor',
                    bindToController: true,
                    templateUrl: 'ng/enum-editor.html',
                    clickOutsideToClose: true,
                    hasBackdrop: false
                });
            },
            editRecord: function ($event, id, tableName, recordDefaults) {
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
                    controller: RecordCtrl_1.RecordCtrl,
                    controllerAs: 'record',
                    bindToController: true,
                    templateUrl: 'ng/record.html',
                    clickOutsideToClose: true,
                    hasBackdrop: false
                });
            },
            editRecordClose: function () {
                //TODO: delete unused new record
                $mdDialog.hide();
            },
            errorToast: function (data) {
                var errorText = "An unknown error has occured";
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
                });
            },
            // Get the application log entries
            getLog: function () {
                return $http.get("log.php")
                    .then(function (response) {
                    if (angular.isDefined(response.data.applog)) {
                        dataModel.applog.length = 0;
                        angular.merge(dataModel.applog, response.data.applog);
                    }
                });
            },
            // Get MongoDB data from the IO messenger
            getMData: function (table, params) {
                var reqData = {
                    table: table,
                    params: params
                };
                self.getMProm = $q(function (resolve, reject) {
                    messenger.emit('get-data', reqData, function (data) {
                        console.log("data received:" + data);
                        self.loadData(data);
                        resolve(true);
                    });
                });
                return self.getMProm;
            },
            getNewRowRef: function (tableName) {
                var newRow = {
                    id: '0',
                    referenced: {},
                    tableName: tableName,
                    fields: {}
                };
                var tSchema = self.getSchema(tableName);
                angular.forEach(tSchema.fields, function (value, name) {
                    newRow.fields[value.name] = '';
                });
                return newRow;
            },
            getRowRef: function (tableName, key) {
                if (!angular.isDefined(tableName)) {
                    console.error("error looking up record for undefined table");
                    return {};
                }
                if (!angular.isDefined(key) || key === null) {
                    console.error("error looking up %s record for undefined key", tableName);
                    return {};
                }
                var table = this.getTableRef(tableName);
                if (!angular.isDefined(table.indexed[key])) {
                    table.indexed[key] = {
                        fields: {},
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
            getMenu: function () {
                if (!angular.isDefined(dataModel.menu)) {
                    dataModel.menu = { items: {} };
                    $http.get('menu.php')
                        .success(function (data) {
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
                    });
                }
                return dataModel.menu;
            },
            getSchema: function (table) {
                if (!schema.loaded) {
                    // The table argument is only used to determine if the schema has been loaded
                    if (!angular.isDefined(schema[table])) {
                        schema[table] = {
                            referenced: {},
                            'foreign_keys': {}
                        };
                    }
                }
                return schema[table];
            },
            getSchemaPromise: function () {
                if (!schemaLoaded) {
                    return schemaPromise;
                }
            },
            getTable: function (table) {
                //console.log("DataService.getTable(" + table + ")");
                if (!angular.isDefined(dataModel[table])) {
                    this.getTableRef(table);
                    tablePromises[table] = this.getTablePromise(table);
                }
                else if (!angular.isDefined(tablePromises[table])) {
                    tablePromises[table] = this.getTablePromise(table);
                }
                return dataModel[table];
            },
            /**
             * Get a promise object representing an AJAX request for table data
             * @param table
             * @returns {*}
             */
            getTablePromise: function (table) {
                if (angular.isDefined(tablePromises[table])) {
                    return tablePromises[table];
                }
                if (angular.isDefined(table)) {
                    tablePromises[table] = self.getMData(table, {})
                        .then(function () {
                        if (schemaLoaded) {
                            return dataModel[table];
                        }
                        return schemaPromise.then(function () {
                            return dataModel[table];
                        });
                    }, function () {
                        self.errorToast("getMData " + table + " problem");
                    });
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
            getTableRef: function (table) {
                if (!angular.isDefined(dataModel[table])) {
                    dataModel[table] = {
                        listed: [],
                        indexed: {},
                        loaded: false
                    };
                }
                return dataModel[table];
            },
            getUserInfo: function () {
                var userInfoUrl = "/auth/user_session";
                return $http.get(userInfoUrl)
                    .then(function (response) {
                    angular.merge(self.userSession, response.data.session);
                    // If we are logged in, check for admin auth
                    if (self.userSession.admin_auth_requested) {
                        self.doAdminLogon();
                    }
                    else if (!self.userSession.auth) {
                        // User is not authorized application and should be directed to log on
                        self.doLogon();
                    }
                }, function (response) {
                    console.log("get user session failed with response code:" + response.status);
                });
            },
            guid: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },
            isAdminAuthorized: function () {
                return userSession.admin_auth && (userSession.admin_auth_expires > Date.now());
            },
            /*
             * loadControlUpdates is process separately from loadData, as loadControlUpdates is
             * much more limited in the scope of changes to the data model
             */
            loadControlUpdates: function (updates) {
                var i;
                for (i = 0; i < updates.length; i++) {
                    var update = updates[i];
                    if (update.status == "observed" || update.status == "executed") {
                        var control = self.getRowRef("controls", update.control_id);
                        control.fields.value = update.value;
                    }
                }
            },
            loadData: function (data) {
                if (schemaLoaded) {
                    //console.log("loading data");
                    self.loadDataKernel(data);
                }
                else {
                    //console.log("deferring data loading");
                    schemaPromise = schemaPromise.then(function () {
                        //console.log("loading deffered data");
                        self.loadDataKernel(data);
                    });
                    return schemaPromise;
                }
            },
            loadDataKernel: function (data) {
                // Treat update as a synonym for add
                if (angular.isDefined(data.update)) {
                    if (angular.isDefined(data.add)) {
                        angular.merge(data.add, data.update);
                    }
                    else {
                        data.add = data.update;
                    }
                }
                if (angular.isDefined(data.add)) {
                    angular.forEach(data.add, function (tableData, tableName) {
                        var tschema = self.getSchema(tableName);
                        var fks = tschema['foreign_keys'];
                        angular.forEach(tableData, function (value, key) {
                            var row = self.getRowRef(tableName, key);
                            angular.merge(row.fields, value);
                            row.loaded = true;
                            // Set up foreign key object references
                            angular.forEach(fks, function (fkTable, fkField) {
                                if (angular.isDefined(row.fields[fkField]) && row.fields[fkField] !== null) {
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
                        });
                    });
                }
                if (angular.isDefined(data.delete)) {
                    angular.forEach(data.delete, function (tableData, table) {
                        angular.forEach(tableData, function (value, key) {
                            // Remove references
                            var record = dataModel[table].indexed[key];
                            angular.forEach(record.foreign, function (referenced, refID) {
                                if (angular.isDefined(referenced.referenced[table][key])) {
                                    delete referenced.referenced[table][key];
                                }
                            });
                            delete dataModel[table].indexed[key];
                        });
                        // Rebuild object list
                        dataModel[table].listed.length = 0;
                        angular.forEach(dataModel[table].indexed, function (value, key) {
                            dataModel[table].listed.push(value);
                        });
                    });
                }
            },
            revokeAdminAuth: function () {
                //TODO: this doesn't do anything unless the Apache auth session credentials
                // are also revoked
                self.userSession.admin_auth_expires = Date.now();
            },
            showControlLog: function ($event, ctrl) {
                var qParams = {
                    'control_id': ctrl.id
                };
                self.getMData('control_log', qParams).then(function () {
                    $mdDialog.show({
                        targetEvent: $event,
                        locals: {
                            ctrl: ctrl
                        },
                        controller: CtrlLogCtrl_1.CtrlLogCtrl,
                        controllerAs: 'ctrlLog',
                        bindToController: true,
                        templateUrl: 'ng/ctrl-log.html',
                        clickOutsideToClose: true,
                        hasBackdrop: false,
                    });
                });
            },
            updateConfig: function () {
                if (typeof ($window.localStorage) !== 'undefined') {
                    $window.localStorage.config = JSON.stringify(self.config);
                }
            },
            updateControlValue: function (control) {
                if (angular.isDefined(pendingUpdates[control.id])) {
                    $timeout.cancel(pendingUpdates[control.id]);
                }
                pendingUpdates[control.id] = $timeout(function (control, self) {
                    var cuid = self.guid();
                    var updates = [
                        {
                            _id: cuid,
                            control_id: control.id,
                            value: control.fields.value,
                            type: "user",
                            status: "requested",
                            source: self.dataModel.client_id
                        }
                    ];
                    messenger.emit('control-updates', updates);
                }, 200, true, control, self);
            },
            // Use the debounce module to rate limit update requests
            // This function will execute the ajax request 100ms after it is called,
            // unless cancelled
            updateRow: function (row) {
                var reqData = {
                    table: row.tableName,
                    _id: row.id,
                    "set": row.fields
                };
                messenger.emit('update-data', reqData, function (data) {
                    console.log("data updated:" + data);
                    self.loadData(data);
                });
            }
        };
        messenger.on('control-data', function (data) {
            self.loadData(data);
            //console.log("socket control data received");
        });
        messenger.on('control-updates', function (data) {
            self.loadControlUpdates(data);
        });
        messenger.on('log-data', function (data) {
            self.dataModel.applog.push(data);
        });
        return self;
    }
];
//# sourceMappingURL=DataService.js.map