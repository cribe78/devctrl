"use strict";
var data_service_schema_1 = require("./ng1/data-service-schema");
var io = require("socket.io-client");
var RecordCtrl_1 = require("./ng1/RecordCtrl");
var CtrlLogCtrl_1 = require("./ng1/CtrlLogCtrl");
var DataService = (function () {
    function DataService($window, $http, $mdToast, $timeout, $q, socket, $mdDialog, $location) {
        this.$window = $window;
        this.$http = $http;
        this.$mdToast = $mdToast;
        this.$timeout = $timeout;
        this.$q = $q;
        this.socket = socket;
        this.$mdDialog = $mdDialog;
        this.$location = $location;
        this.initialized = false;
        this.pendingUpdates = [];
        this.tablePromises = {};
        this.config = {
            editEnabled: true,
            lastLogonAttempt: 0
        };
        this.schema = data_service_schema_1.dataServiceSchema;
        for (var table in this.schema) {
            var tschema = this.schema[table];
            if (tschema.foreign_keys) {
                tschema['referenced'] = {};
                for (var keyName in tschema.foreign_keys) {
                    tschema.referenced[tschema.foreign_keys[keyName]] = keyName;
                }
            }
        }
        this.userSession = {
            _id: '',
            username: null,
            login_expires: 0,
            auth: false,
            admin_auth: false,
            admin_auth_expires: 0
        };
        this.dataModel = {
            applog: [],
            menu: { items: {} }
        };
        for (var table in this.schema) {
            this.dataModel[table] = {
                listed: [],
                indexed: {},
                loaded: false
            };
        }
        if (typeof ($window.localStorage) !== 'undefined') {
            var localConfig = $window.localStorage.config;
            if (angular.isString(localConfig)) {
                this.config = JSON.parse(localConfig);
            }
            else {
                $window.localStorage.config = JSON.stringify(this.config);
            }
        }
    }
    DataService.prototype.addRow = function (row, callback) {
        var _this = this;
        var req = {};
        req[row.tableName] = [row.fields];
        this.socket.emit('add-data', req, function (response) {
            if (response.error) {
                _this.errorToast(response.error);
                return;
            }
            var newId = Object.keys(response.add[row.tableName])[0];
            console.log("new record " + newId + "added to " + row.tableName);
            _this.loadData(response);
            var record = _this.dataModel[row.tableName].indexed[newId];
            /**
            angular.forEach(row, function(value, key) {
                if (key != 'tableName') {
                    row[key] = null;
                }
            });
             **/
            if (angular.isFunction(callback)) {
                callback(record);
            }
        });
    };
    DataService.prototype.deleteRow = function (row) {
        var _this = this;
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
            this.errorToast({ error: msg });
            return;
        }
        this.$http.delete(resource)
            .then(function (data) { _this.loadData(data); }, function (data) { _this.errorToast(data); });
    };
    DataService.prototype.dialogClose = function () {
        this.$mdDialog.hide();
    };
    DataService.prototype.doAdminLogon = function () {
        var _this = this;
        // First, check current login status
        if (this.userSession.login_expires > Date.now()) {
            var url = "/auth/admin_auth";
            this.$http.get(url).then(
            //Success
            function (response) {
                angular.merge(_this.userSession, response.data.session);
                console.log("admin_auth successful");
            }, 
            //Failure
            function (response) {
                if (response.status == 401) {
                    _this.errorToast("You are not authorize to access admin functions");
                    //TODO: admin_auth_requested should be set on local storage
                    _this.userSession.admin_auth_requested = false;
                }
                else if (response.status == -1) {
                    console.log("XHR admin auth failed, attempting logon");
                    _this.doLogon(true, true);
                }
                else {
                    _this.errorToast("Admin auth error: " + response.status);
                }
            });
        }
        else {
            this.doLogon(true);
        }
    };
    DataService.prototype.doLogon = function (admin_auth_check, force_login) {
        if (admin_auth_check === void 0) { admin_auth_check = false; }
        if (force_login === void 0) { force_login = false; }
        if (force_login || this.userSession.login_expires < Date.now()) {
            // Circuit breaker for login loops
            if (this.config.lastLogonAttempt) {
                var timeSinceLogon = Date.now() - this.config.lastLogonAttempt;
                if (timeSinceLogon < 10) {
                    this.errorToast("Login loop detected.  Not processing logon request");
                    return;
                }
            }
            this.config.lastLogonAttempt = Date.now();
            this.updateConfig();
            var location_1 = this.$location.path();
            var newLocation = "/auth/do_logon?";
            if (admin_auth_check) {
                newLocation = newLocation + "admin_auth_requested=1&";
            }
            console.log("doLogon: admin_auth_requested = " + admin_auth_check);
            newLocation = newLocation + "location=" + location_1;
            window.location.href = newLocation;
        }
    };
    DataService.prototype.editRecord = function ($event, id, tableName, recordDefaults) {
        if (recordDefaults === void 0) { recordDefaults = {}; }
        var record;
        if (id !== "0") {
            record = this.getRowRef(tableName, id);
        }
        else {
            record = this.getNewRowRef(tableName);
            angular.merge(record.fields, recordDefaults);
        }
        this.$mdDialog.show({
            targetEvent: $event,
            locals: {
                obj: record
            },
            controller: RecordCtrl_1.RecordCtrl,
            controllerAs: 'record',
            bindToController: true,
            templateUrl: 'app/ng1/record.html',
            clickOutsideToClose: true,
            hasBackdrop: false
        });
    };
    DataService.prototype.editRecordClose = function () {
        //TODO: delete unused new record
        this.$mdDialog.hide();
    };
    DataService.prototype.errorToast = function (data) {
        var errorText = "An unknown error has occured";
        if (data.error) {
            errorText = data.error;
        }
        else if (angular.isString(data)) {
            errorText = data;
        }
        console.log(errorText);
        //$mdToast.show($mdToast.simple().content(errorText));
        this.$mdToast.show({
            templateUrl: "app/ng1/error-toast.html",
            locals: {
                message: errorText
            },
            controllerAs: "toast",
            controller: 'RoomsCtrl',
            bindToController: true,
            position: 'top right',
            hideDelay: 3000
        });
    };
    DataService.prototype.getLog = function () {
        var _this = this;
        //TODO: Needs re-implementation in messenger
        return this.$http.get("log.php")
            .then(function (response) {
            if (angular.isDefined(response.data.applog)) {
                _this.dataModel.applog.length = 0;
                angular.merge(_this.dataModel.applog, response.data.applog);
            }
        });
    };
    // Get MongoDB data from the IO messenger
    DataService.prototype.getMData = function (table, params) {
        var _this = this;
        var req = {
            table: table,
            params: params
        };
        var getMProm = this.$q(function (resolve, reject) {
            _this.socket.emit('get-data', req, function (data) {
                console.log("data received:" + data);
                if (data.error) {
                    reject(data.error);
                    return;
                }
                _this.loadData(data);
                resolve(true);
            });
        });
        return getMProm;
    };
    DataService.prototype.getNewRowRef = function (tableName) {
        var newRow = {
            id: '0',
            referenced: {},
            tableName: tableName,
            fields: {}
        };
        var tSchema = this.getSchema(tableName);
        for (var field in tSchema.fields) {
            newRow.fields[field] = '';
        }
        return newRow;
    };
    /*
     * data row properties:
     *   id - primary key value
     *   fields - other columns as properties
     *   foreign - foreign key records
     *   loaded - has field data been loaded?
     *   referenced - other rows that reference this row
     */
    DataService.prototype.getRowRef = function (tableName, key) {
        if (!tableName) {
            console.error("error looking up record for undefined table");
            return {};
        }
        if (!angular.isDefined(key) || key === null) {
            console.error("error looking up %s record for undefined key", tableName);
            return {};
        }
        var table = this.getTableRef(tableName);
        if (!table.indexed[key]) {
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
    };
    DataService.prototype.getSchema = function (table) {
        return this.schema[table];
    };
    DataService.prototype.getTable = function (table) {
        if (!this.tablePromises[table]) {
            this.tablePromises[table] = this.getTablePromise(table);
        }
        return this.dataModel[table];
    };
    /**
     * Get a promise object representing a request for table data
     * @param table
     * @returns {*}
     */
    DataService.prototype.getTablePromise = function (table) {
        var _this = this;
        if (!this.initialized) {
            this.init();
        }
        if (!table) {
            console.error("error: attempt to fetch undefined table!");
            return {};
        }
        if (this.tablePromises[table]) {
            return this.tablePromises[table];
        }
        this.tablePromises[table] = this.getMData(table, {})
            .then(function () {
            return _this.dataModel[table];
        }, function () {
            _this.errorToast("getMData " + table + " problem");
        });
        return this.tablePromises[table];
    };
    /**
     * Look up a table object by table name, instantiating the object if
     * necessary.
     * @param table
     * @returns {*}
     */
    DataService.prototype.getTableRef = function (table) {
        if (!this.dataModel[table]) {
            console.log("Error: getTableRef request for invalid table");
            return {};
        }
        return this.dataModel[table];
    };
    DataService.prototype.getUserInfo = function () {
        var _this = this;
        var userInfoUrl = "/auth/user_session";
        return this.$http.get(userInfoUrl)
            .then(
        //Success
        function (response) {
            angular.merge(_this.userSession, response.data.session);
            // If we are logged in, check for admin auth
            if (_this.userSession.admin_auth_requested) {
                console.log("getUserInfo doAdminLogon");
                _this.doAdminLogon();
            }
            else if (!_this.userSession.auth) {
                // User is not authorized application and should be directed to log on
                console.log("getUserInfo doLogon");
                _this.doLogon();
            }
        }, 
        //Failure
        function (response) {
            console.log("get user session failed with response code:" + response.status);
        });
    };
    DataService.prototype.guid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    DataService.prototype.init = function () {
        var _this = this;
        if (this.initialized) {
            return;
        }
        var ioSocket = io(this.$location.protocol() + "://" + this.$location.host());
        this.socket.init({ ioSocket: ioSocket });
        this.socket.on('control-data', function (data) {
            _this.loadData(data);
            //console.log("socket control data received");
        });
        this.socket.on('control-updates', function (data) {
            _this.loadControlUpdates(data);
        });
        this.socket.on('log-data', function (data) {
            _this.dataModel.applog.push(data);
        });
        console.log("dataService2 initialized");
        this.initialized = true;
    };
    DataService.prototype.isAdminAuthorized = function () {
        return this.userSession.admin_auth && (this.userSession.admin_auth_expires > Date.now());
    };
    /*
     * loadControlUpdates is process separately from loadData, as loadControlUpdates is
     * much more limited in the scope of changes to the data model
     */
    DataService.prototype.loadControlUpdates = function (updates) {
        for (var _i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
            var update = updates_1[_i];
            if (update.status == "observed" || update.status == "executed") {
                var control = this.getRowRef("controls", update.control_id);
                control.fields.value = update.value;
            }
        }
    };
    DataService.prototype.loadData = function (data) {
        var _this = this;
        // Treat update as a synonym for add
        if (data.update) {
            if (data.add) {
                angular.merge(data.add, data.update);
            }
            else {
                data.add = data.update;
            }
        }
        if (data.add) {
            for (var table in data.add) {
                //angular.forEach(data.add, function(tableData, tableName) {
                var tschema = this.getSchema(table);
                var fks = tschema['foreign_keys'] || {};
                var tableData = data.add[table];
                for (var key in tableData) {
                    //angular.forEach(tableData, function(value, key) {
                    var row = this.getRowRef(table, key);
                    angular.merge(row.fields, tableData[key]);
                    row.loaded = true;
                    // Set up foreign key object references
                    for (var fkField in fks) {
                        //angular.forEach(fks, function(fkTable, fkField) {
                        var fkTable = fks[fkField];
                        if (row.fields[fkField] && row.fields[fkField] !== null) {
                            var fkRow = this.getRowRef(fkTable, row.fields[fkField]);
                            if (!fkRow.referenced[table]) {
                                fkRow.referenced[table] = {};
                            }
                            fkRow.referenced[table][row.id] = row;
                            row.foreign[fkTable] = fkRow;
                            row.foreign[fkField] = fkRow;
                        }
                        else {
                            row.foreign[fkTable] = null;
                            row.foreign[fkField] = null;
                        }
                    }
                }
            }
        }
        if (angular.isDefined(data.delete)) {
            // Remove references
            var table_1 = data.delete.table;
            var key_1 = data.delete._id;
            var record = this.dataModel[table_1].indexed[key_1];
            if (!angular.isDefined(record)) {
                return;
            }
            angular.forEach(record.foreign, function (referenced, refID) {
                if (angular.isDefined(referenced.referenced[table_1][key_1])) {
                    delete referenced.referenced[table_1][key_1];
                }
            });
            delete this.dataModel[table_1].indexed[key_1];
            // Rebuild object list
            this.dataModel[table_1].listed.length = 0;
            angular.forEach(this.dataModel[table_1].indexed, function (value, key) {
                _this.dataModel[table_1].listed.push(value);
            });
        }
    };
    DataService.prototype.revokeAdminAuth = function () {
        //TODO: this doesn't do anything unless the Apache auth session credentials
        // are also revoke
        this.userSession.admin_auth_expires = Date.now();
    };
    DataService.prototype.showControlLog = function ($event, ctrl) {
        var _this = this;
        var qParams = {
            'control_id': ctrl.id
        };
        this.getMData('control_log', qParams).then(function () {
            _this.$mdDialog.show({
                targetEvent: $event,
                locals: {
                    ctrl: ctrl
                },
                controller: CtrlLogCtrl_1.CtrlLogCtrl,
                controllerAs: 'ctrlLog',
                bindToController: true,
                templateUrl: 'app/ng1/ctrl-log.html',
                clickOutsideToClose: true,
                hasBackdrop: false,
            });
        }, function (error) {
            _this.errorToast(error);
        });
    };
    DataService.prototype.publishStatusUpdate = function (message) {
        this.socket.emit('status-update', { message: message });
    };
    DataService.prototype.updateConfig = function () {
        if (typeof (this.$window.localStorage) !== 'undefined') {
            this.$window.localStorage.config = JSON.stringify(this.config);
        }
    };
    DataService.prototype.updateControlValue = function (control) {
        var _this = this;
        if (this.pendingUpdates[control.id]) {
            this.$timeout.cancel(this.pendingUpdates[control.id]);
        }
        this.pendingUpdates[control.id] = this.$timeout(function () {
            var cuid = _this.guid();
            var updates = [
                {
                    _id: cuid,
                    control_id: control.id,
                    value: control.fields.value,
                    type: "user",
                    status: "requested",
                    source: _this.userSession._id
                }
            ];
            _this.socket.emit('control-updates', updates);
            return false;
        }, 100, false);
    };
    DataService.prototype.updateRow = function (row) {
        var _this = this;
        var reqData = {
            table: row.tableName,
            _id: row.id,
            "set": row.fields
        };
        this.socket.emit('update-data', reqData, function (data) {
            console.log("data updated:" + data);
            _this.loadData(data);
        });
    };
    DataService.$inject = ['$window', '$http', '$mdToast', '$timeout', '$q', 'socket', '$mdDialog', '$location'];
    return DataService;
}());
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map