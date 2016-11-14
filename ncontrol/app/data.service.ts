import {dataServiceSchema} from "./ng1/data-service-schema";
import {SocketService} from "./socket";
import {UserSession} from "../shared/UserSession";
import * as io from "socket.io-client";
import {IDCDataRequest, IDCDataUpdate, DCSerializable, DCSerializableData} from "../shared/DCSerializable";
import {RecordController} from "./ng1/record.controller";
import {ControlUpdateData} from "../shared/ControlUpdate";
import IPromise = angular.IPromise;
import {CtrlLogCtrl} from "./ng1/CtrlLogCtrl";
import {DCDataModel, IndexedDataSet} from "../shared/DCDataModel";
import {Control} from "../shared/Control";
import {Endpoint} from "../shared/Endpoint";

export class DataService {
    schema;
    userSession : UserSession;
    private initialized = false;
    private dataModel : DCDataModel;
    pendingUpdates : IPromise<void>[] = [];
    userInfoPromise;
    adminLogonTimeout;
    tablePromises = {};
    config = {
        editEnabled: true,
        lastLogonAttempt: 0,
        menu : {
            sidenavOpen : false
        }
    };

    static $inject = ['$window', '$http', '$mdToast', '$timeout', '$q', 'socket', '$mdDialog', '$location'];

    constructor(private $window,
                private $http,
                private $mdToast,
                private $timeout,
                private $q,
                private socket : SocketService,
                private $mdDialog,
                private $location) {
        this.schema = dataServiceSchema;

        for (let table in this.schema) {
            let tschema = this.schema[table];
            if (tschema.foreign_keys) {
                tschema['referenced'] = {};
                for (let keyName in tschema.foreign_keys) {
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

        this.dataModel = new DCDataModel();

        if (typeof($window.localStorage) !== 'undefined') {
            var localConfig = $window.localStorage.config;
            if (angular.isString(localConfig)) {
                this.config = JSON.parse(localConfig);
            }
            else {
                $window.localStorage.config = JSON.stringify(this.config);
            }
        }
    }

    addRow(row : DCSerializable, callback) {
        let req = {};
        req[row.table] = [row.getDataObject()];
        this.socket.emit('add-data', req, (response) => {
            if (response.error) {
                this.errorToast(response.error);
                return;
            }

            let newId = Object.keys(response.add[row.table])[0];
            console.log("new record " + newId + "added to " + row.table);

            this.loadData(response);

            let record = this.dataModel[row.table][newId];

            if (angular.isFunction(callback)) {
                callback(record);
            }
        });
    }

    deleteRow(row : DCSerializable) {
        let resource = "api/data/" + row.table + "/" + row._id;

        // Check for foreign key constraints
        let referencedTable = "";
        angular.forEach(row.referenced, function(refs, refTable) {
            if (Object.keys(refs).length > 0) {
                //TODO: cannot delete value due to foreign key constraint
                referencedTable = refTable;
            }
        });

        if (referencedTable) {
            let msg = "Cannot delete " + row.table + " record due to foreign key constraint on " + referencedTable;

            this.errorToast({error: msg});
            return;
        }

        this.$http.delete(resource)
            .then(
                data => { this.loadData(data) },
                data => { this.errorToast(data) }
            );
    }

    dialogClose() {
        this.$mdDialog.hide();
    }

    doAdminLogon(allowExpiration : boolean = false) {
        // First, check current login status
        if (this.userSession.login_expires > Date.now()) {
            let url = "/auth/admin_auth";
            this.$http.get(url).then(
                //Success
                response => {
                    angular.merge(this.userSession, response.data.session);

                    // Refresh credentials before they expire
                    let retryDelay = (this.userSession.admin_auth_expires - Date.now()) - 2000;
                    //let retryDelay = 60000;
                    let retryTime = new Date(Date.now() + retryDelay);
                    let retryTimeStr = retryTime.toTimeString().substr(0, 17);

                    if (retryDelay > 0) {
                        this.adminLogonTimeout = this.$timeout(() => {
                                this.doAdminLogon(true);
                            },
                            retryDelay
                        );

                        console.log(`admin_auth successful, admin refresh scheduled for ${retryTimeStr}`);
                    }
                    else {
                        console.log("admin_auth successful, negative retry delay, what the hell does that mean?");
                    }
                },
                //Failure
                response => {
                    if (response.status == 401) {
                        this.errorToast("You are not authorize to access admin functions");

                        //TODO: admin_auth_requested should be set on local storage
                        this.userSession.admin_auth_requested = false;
                    }
                    else if (response.status == -1) {
                        if (! allowExpiration) {
                            console.log("XHR admin auth failed, attempting logon");
                            this.doLogon(true, true);
                        }
                        else {
                            console.log("XHR admin auth failed, dropping admin privileges")
                        }
                    }
                    else {
                        this.errorToast("Admin auth error: " + response.status);
                    }
                }
            )
        }
        else {
            this.doLogon(true);
        }
    }

    doLogon(admin_auth_check: boolean = false, force_login: boolean = false) {
        if (force_login || this.userSession.login_expires < Date.now()) {
            // Circuit breaker for login loops
            if (this.config.lastLogonAttempt) {
                let timeSinceLogon = Date.now() - this.config.lastLogonAttempt;
                if (timeSinceLogon < 10000) {
                    this.errorToast("Login loop detected.  Not processing logon request");
                    return;
                }
            }

            this.config.lastLogonAttempt = Date.now();
            this.updateConfig();

            let location = this.$location.path();
            let newLocation = "/auth/do_logon?";

            if (admin_auth_check) {
                newLocation = newLocation + "admin_auth_requested=1&";
            }

            console.log("doLogon: admin_auth_requested = " + admin_auth_check);

            newLocation = newLocation + "location=" + location;
            window.location.href = newLocation;
        }
    }


    editRecord($event, id: string, tableName: string, recordDefaults = {}) {
        let record;

        if (id !== "0") {
            record = this.getRowRef(tableName, id);
        }
        else {
            record = this.getNewRowRef(tableName, recordDefaults);
        }

        this.$mdDialog.show({
            targetEvent: $event,
            locals: {
                obj: record
            },
            controller: RecordController,
            controllerAs: 'record',
            bindToController: true,
            templateUrl: 'app/ng1/record.html',
            clickOutsideToClose: true,
            hasBackdrop : false
        });
    }


    editRecordClose() {
        //TODO: delete unused new record
        this.$mdDialog.hide();
    }


    errorToast(data) {
        let errorText = "An unknown error has occured"
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
    }

    getLog() {
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
    }

    // Get MongoDB data from the IO messenger
    getMData(table: string, params) {
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


        let req : IDCDataRequest = {
            table: table,
            params: params,
        };

        let getMProm =  this.$q((resolve, reject) => {
            this.socket.emit('get-data', req, (data) => {
                console.log("data received:" + data);

                if (data.error) {
                    reject(data.error);
                    return;
                }

                this.loadData(data);
                resolve(true);
            });
        });

        return getMProm;
    }

    getNewRowRef(tableName: string, newData = {}) {
        let ctor = this.dataModel.types[tableName];

        let newRow = new ctor("0");
        angular.merge(newRow, newData);

        return newRow;
    }

    /*
     * data row properties:
     *   id - primary key value
     *   fields - other columns as properties
     *   foreign - foreign key records
     *   loaded - has field data been loaded?
     *   referenced - other rows that reference this row
     */

    getRowRef(tableName: string, key: string) : DCSerializable {
        if (! tableName) {
            throw new Error("error looking up record for undefined table");
        }

        if (! angular.isDefined(key) || key === null) {
            throw new Error(`error looking up ${tableName} record for undefined key`);
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
    }


    getSchema(table: string) {
        return this.schema[table];
    }

    getTable(table: string) : IndexedDataSet<DCSerializable> {
        if (! this.tablePromises[table]) {
            this.tablePromises[table] = this.getTablePromise(table);
        }

        return this.dataModel[table];
    }

    /**
     * Get a promise object representing a request for table data
     * @param table
     * @returns {*}
     */
    getTablePromise(table: string) {
        if (! this.initialized) {
            this.init();
        }

        if (! table) {
            console.error("error: attempt to fetch undefined table!");
            return {};
        }

        if (this.tablePromises[table]) {
            return this.tablePromises[table];
        }

        this.tablePromises[table] = this.getMData(table, {})
            .then(
                () => {
                    return this.dataModel[table];
                },
                () => {
                    this.errorToast("getMData " + table + " problem");
                }
            );

        return this.tablePromises[table];
    }

    /**
     * Look up a table object by table name, instantiating the object if
     * necessary.
     * @param table
     * @returns {*}
     */
    getTableRef(table: string) : IndexedDataSet<DCSerializable> {
        if (! this.dataModel[table]) {
            throw new Error("Error: getTableRef request for invalid table");
        }
        return this.dataModel[table];
    }


    getUserInfo() {
        let userInfoUrl = "/auth/user_session";
        if (typeof this.userInfoPromise == 'undefined') {
            this.userInfoPromise = this.$http.get(userInfoUrl)
                .then(
                    //Success
                    response => {
                        angular.merge(this.userSession, response.data.session);

                        // If we are logged in, check for admin auth
                        if (this.userSession.admin_auth_requested) {
                            console.log("getUserInfo doAdminLogon");
                            this.doAdminLogon();
                        }
                        else if (!this.userSession.auth) {
                            // User is not authorized application and should be directed to log on
                            console.log("getUserInfo doLogon");
                            this.doLogon();
                        }
                        else if (this.isAdminAuthorized()) {
                            // Setup periodic checks to renew admin auth
                            this.doAdminLogon(true);
                        }
                    },
                    //Failure
                    response => {
                        console.log("get user session failed with response code:" + response.status);
                        //TODO: we should prevent the user from using the application at this point
                    }
                );
        }

        return this.userInfoPromise;
    }

    guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random()*16|0;
            let v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    init() {
        if (this.initialized) {
            return;
        }

        let ioSocket = io(this.$location.protocol() + "://" + this.$location.host(),
            {
                //path: "/socket-dev.io",
                path: "/socket.io",
                transports: ["websocket"]

            }
        );
        this.socket.init({ ioSocket: ioSocket});

        this.socket.on('control-data', data => {
            this.loadData(data);
            //console.log("socket control data received");
        });

        this.socket.on('control-updates', data => {
            this.loadControlUpdates(data);
        });

        this.socket.on('log-data', data => {
            //this.dataModel.applog.push(data);
        });

        this.socket.on('reconnect', () => {
            // Refresh endpoints, as they may have been disconnected from the messenger
            this.getMData(Endpoint.tableStr, {});
        });


        console.log("dataService2 initialized");
        this.initialized = true;
    }


    isAdminAuthorized() {
        return this.userSession.admin_auth && (this.userSession.admin_auth_expires > Date.now());
    }


    /*
     * loadControlUpdates is process separately from loadData, as loadControlUpdates is
     * much more limited in the scope of changes to the data model
     */
    loadControlUpdates(updates: ControlUpdateData[]) {
        for (let update of updates) {
            if (update.status == "observed" || update.status == "executed") {
                let control = <Control>this.getRowRef("controls", update.control_id);
                control.value = update.value;
            }
        }
    }

    loadData(data) {
        //try {
            this.dataModel.loadData(data);
        //}
        //catch (e) {
        //    console.error("loadData error: " + e.message);
        //}
    }

    revokeAdminAuth() {
        //TODO: this doesn't do anything unless the Apache auth session credentials
        // are also revoke
        this.userSession.admin_auth_expires = Date.now();

        if (this.adminLogonTimeout) {
            this.$timeout.cancel(this.adminLogonTimeout);
        }

        let url = "/auth/revoke_admin";
        this.$http.get(url).then(
            //Success
            response => {
                angular.merge(this.userSession, response.data.session);
                console.log("revoke admin auth successful");
            },
            //Failure
            response => {
                this.errorToast("Revoke Admin auth error: " + response.status);

            }
        )
    }

    showControlLog($event,ctrl) {
        var qParams = {
            'control_id' : ctrl.id
        };

        this.getMData('control_log', qParams).then(
            () => {
                this.$mdDialog.show({
                    targetEvent: $event,
                    locals: {
                        ctrl: ctrl
                    },
                    controller: CtrlLogCtrl,
                    controllerAs: 'ctrlLog',
                    bindToController: true,
                    templateUrl: 'app/ng1/ctrl-log.html',
                    clickOutsideToClose: true,
                    hasBackdrop : false,
                });
            },
            (error) => {
                this.errorToast(error);
            }
        );
    }

    publishStatusUpdate(message: string) {
        this.socket.emit('status-update', { message: message});
    }

    updateConfig() {
        if (typeof(this.$window.localStorage) !== 'undefined') {
            this.$window.localStorage.config = JSON.stringify(this.config);
        }
    }

    updateControlValue(control : Control) {
        if (this.pendingUpdates[control._id]) {
            this.$timeout.cancel(this.pendingUpdates[control._id]);
        }

        this.pendingUpdates[control._id] = this.$timeout(() => {
            let cuid = this.guid();
            let updates : ControlUpdateData[] = [
                {
                    _id: cuid,
                    name: control.name + " update",
                    control_id: control._id,
                    value: control.value,
                    type: "user",
                    status: "requested",
                    source: this.userSession._id
                }
            ];

            this.socket.emit('control-updates', updates);
            return false;
        }, 100, false);
    }


    updateRow(row : DCSerializable) {
        let reqData : IDCDataUpdate = {
            table: row.table,
            _id : row._id,
            "set" : row.getDataObject()
        };

        this.socket.emit('update-data', reqData, data => {
            console.log("data updated:" + data);
            this.loadData(data);
        });
    }
}