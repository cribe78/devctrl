"use strict";
var data_service_schema_1 = require("./ng1/data-service-schema");
var io = require("socket.io-client");
var record_controller_1 = require("./ng1/record.controller");
var CtrlLogCtrl_1 = require("./ng1/CtrlLogCtrl");
var DCDataModel_1 = require("../shared/DCDataModel");
var Endpoint_1 = require("../shared/Endpoint");
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
            lastLogonAttempt: 0,
            menu: {
                sidenavOpen: false
            }
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
        this.dataModel = new DCDataModel_1.DCDataModel();
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
        req[row.table] = [row.getDataObject()];
        this.socket.emit('add-data', req, function (response) {
            if (response.error) {
                _this.errorToast(response.error);
                return;
            }
            var newId = Object.keys(response.add[row.table])[0];
            console.log("new record " + newId + "added to " + row.table);
            _this.loadData(response);
            var record = _this.dataModel[row.table][newId];
            if (angular.isFunction(callback)) {
                callback(record);
            }
        });
    };
    DataService.prototype.deleteRow = function (row) {
        var _this = this;
        var resource = "api/data/" + row.table + "/" + row._id;
        // Check for foreign key constraints
        var referencedTable = "";
        angular.forEach(row.referenced, function (refs, refTable) {
            if (Object.keys(refs).length > 0) {
                //TODO: cannot delete value due to foreign key constraint
                referencedTable = refTable;
            }
        });
        if (referencedTable) {
            var msg = "Cannot delete " + row.table + " record due to foreign key constraint on " + referencedTable;
            this.errorToast({ error: msg });
            return;
        }
        this.$http.delete(resource)
            .then(function (data) { _this.loadData(data); }, function (data) { _this.errorToast(data); });
    };
    DataService.prototype.dialogClose = function () {
        this.$mdDialog.hide();
    };
    DataService.prototype.doAdminLogon = function (allowExpiration) {
        var _this = this;
        if (allowExpiration === void 0) { allowExpiration = false; }
        // First, check current login status
        if (this.userSession.login_expires > Date.now()) {
            var url = "/auth/admin_auth";
            this.$http.get(url).then(
            //Success
            function (response) {
                angular.merge(_this.userSession, response.data.session);
                // Refresh credentials before they expire
                var retryDelay = (_this.userSession.admin_auth_expires - Date.now()) - 2000;
                //let retryDelay = 60000;
                var retryMilli = Date.now() + retryDelay;
                var retryTime = new Date(retryMilli);
                var retryTimeStr = retryTime.toTimeString().substr(0, 17);
                if (retryMilli > _this.userSession.login_expires) {
                    console.log("not scheduling admin refresh, user session will be expired");
                    return;
                }
                if (retryDelay > 0) {
                    _this.adminLogonTimeout = _this.$timeout(function () {
                        _this.doAdminLogon(true);
                    }, retryDelay);
                    console.log("admin_auth successful, admin refresh scheduled for " + retryTimeStr);
                }
                else {
                    console.log("admin_auth successful, negative retry delay, what the hell does that mean?");
                }
            }, 
            //Failure
            function (response) {
                if (response.status == 401) {
                    _this.errorToast("You are not authorize to access admin functions");
                    //TODO: admin_auth_requested should be set on local storage
                    _this.userSession.admin_auth_requested = false;
                }
                else if (response.status == -1) {
                    if (!allowExpiration) {
                        console.log("XHR admin auth failed, attempting logon");
                        _this.doLogon(true, true);
                    }
                    else {
                        console.log("XHR admin auth failed, dropping admin privileges");
                    }
                }
                else {
                    _this.errorToast("Admin auth error: " + response.status);
                }
            });
        }
        else {
            var expireStr = (new Date(this.userSession.login_expires)).toTimeString().substr(0, 17);
            console.log("user session expired at " + expireStr + ", referring to doLogon");
            if (this.config.lastLogonAttempt) {
                var lastLogonStr = (new Date(this.config.lastLogonAttempt)).toTimeString().substr(0, 17);
                console.log("last logon attempt was at " + lastLogonStr);
            }
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
                if (timeSinceLogon < 10000) {
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
            // Set the name as an empty string, otherwise it will resolve
            // as "unknown [tablename]"
            if (!recordDefaults["name"]) {
                recordDefaults["name"] = '';
            }
            record = this.getNewRowRef(tableName, recordDefaults);
        }
        this.$mdDialog.show({
            targetEvent: $event,
            locals: {
                obj: record
            },
            controller: record_controller_1.RecordController,
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
            locals: {
                message: errorText
            },
            controllerAs: "toast",
            controller: 'RoomsCtrl',
            bindToController: true,
            position: 'top right',
            hideDelay: 0,
            template: "\n<md-toast>\n    {{toast.message}}\n    <md-button ng-click=\"toast.hideToast()\">OK</md-button>\n</md-toast>"
        });
    };
    DataService.prototype.generateEndpointConfig = function ($event, endpointId) {
        var _this = this;
        var endpoint = this.getRowRef(Endpoint_1.Endpoint.tableStr, endpointId);
        var endpointName = endpoint.name.toLowerCase();
        endpointName = endpointName.replace(/ /g, '-');
        var url = "/auth/create_endpoint_session?" + endpointName;
        this.$http.get(url).then(
        //Success
        function (response) {
            var alert = "\nmodule.exports = {\n    endpointId: \"" + endpointId + "\",\n    authId: \"" + response.data.session._id + "\"\n}               \n";
            _this.$mdDialog.show(_this.$mdDialog.alert()
                .title(endpointName + ".js")
                .textContent(alert)
                .targetEvent($event)
                .ok("Got it!"));
        }, function (response) {
            _this.errorToast("Unable to retrieve endpoint ncontrol config");
        });
    };
    DataService.prototype.getLog = function () {
        //TODO: Needs re-implementation in messenger
        /**
        return this.$http.get("log.php")
            .then(response => {
                if (angular.isDefined(response.data.applog)) {
                    this.dataModel.applog.length = 0;
                    angular.merge(this.dataModel.applog, response.data.applog);
                }
            })
        **/
    };
    // Get MongoDB data from the IO messenger
    DataService.prototype.getMData = function (table, params) {
        /**
        if (! this.userSession._id) {
            console.log("chaining getMData to getUserInfo");
            this.userInfoPromise = this.getUserInfo().then(() => {
                    this.getMData(table, params);
                }
            );

            return this.userInfoPromise;
        }
         **/
        var _this = this;
        var req = {
            table: table,
            params: params,
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
    DataService.prototype.getNewRowRef = function (tableName, newData) {
        if (newData === void 0) { newData = {}; }
        var ctor = this.dataModel.types[tableName];
        var newRow = new ctor("0");
        angular.merge(newRow, newData);
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
            throw new Error("error looking up record for undefined table");
        }
        if (!angular.isDefined(key) || key === null) {
            throw new Error("error looking up " + tableName + " record for undefined key");
        }
        /**
        if (! table.indexed[key]) {
            table.indexed[key] = {
                fields : {},
                foreign: {},
                id: key,
                loaded: false,
                referenced: {},
                tableName: tableName
            };
        }
         **/
        return this.dataModel.getTableItem(key, tableName);
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
            throw new Error("Error: getTableRef request for invalid table");
        }
        return this.dataModel[table];
    };
    DataService.prototype.getUserInfo = function () {
        var _this = this;
        var userInfoUrl = "/auth/user_session";
        if (typeof this.userInfoPromise == 'undefined') {
            this.userInfoPromise = this.$http.get(userInfoUrl)
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
                else if (_this.isAdminAuthorized()) {
                    // Setup periodic checks to renew admin auth
                    _this.doAdminLogon(true);
                }
            }, 
            //Failure
            function (response) {
                console.log("get user session failed with response code:" + response.status);
                //TODO: we should prevent the user from using the application at this point
            });
        }
        return this.userInfoPromise;
    };
    DataService.prototype.guid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    DataService.prototype.hideToast = function () {
        this.$mdToast.hide();
    };
    DataService.prototype.init = function () {
        var _this = this;
        if (this.initialized) {
            return;
        }
        var ioSocket = io(this.$location.protocol() + "://" + this.$location.host(), {
            //path: "/socket-dev.io",
            path: "/socket.io",
            transports: ["websocket"]
        });
        this.socket.init({ ioSocket: ioSocket });
        this.socket.on('control-data', function (data) {
            _this.loadData(data);
            //console.log("socket control data received");
        });
        this.socket.on('control-updates', function (data) {
            _this.loadControlUpdates(data);
        });
        this.socket.on('log-data', function (data) {
            //this.dataModel.applog.push(data);
        });
        this.socket.on('reconnect', function () {
            // Refresh endpoints, as they may have been disconnected from the messenger
            _this.getMData(Endpoint_1.Endpoint.tableStr, {});
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
                control.value = update.value;
            }
        }
    };
    DataService.prototype.loadData = function (data) {
        //try {
        this.dataModel.loadData(data);
        //}
        //catch (e) {
        //    console.error("loadData error: " + e.message);
        //}
    };
    DataService.prototype.revokeAdminAuth = function () {
        var _this = this;
        //TODO: this doesn't do anything unless the Apache auth session credentials
        // are also revoke
        this.userSession.admin_auth_expires = Date.now();
        if (this.adminLogonTimeout) {
            this.$timeout.cancel(this.adminLogonTimeout);
        }
        var url = "/auth/revoke_admin";
        this.$http.get(url).then(
        //Success
        function (response) {
            angular.merge(_this.userSession, response.data.session);
            console.log("revoke admin auth successful");
        }, 
        //Failure
        function (response) {
            _this.errorToast("Revoke Admin auth error: " + response.status);
        });
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
        if (this.pendingUpdates[control._id]) {
            this.$timeout.cancel(this.pendingUpdates[control._id]);
        }
        this.pendingUpdates[control._id] = this.$timeout(function () {
            var cuid = _this.guid();
            var updates = [
                {
                    _id: cuid,
                    name: control.name + " update",
                    control_id: control._id,
                    value: control.value,
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
            table: row.table,
            _id: row._id,
            "set": row.getDataObject()
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