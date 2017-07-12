import {dataServiceSchema} from "./data-service-schema";
import {UserSession} from "../shared/UserSession";
import * as io from "socket.io-client";
import {IDCDataRequest, IDCDataUpdate, DCSerializable, DCSerializableData} from "../shared/DCSerializable";
import {ControlUpdateData} from "../shared/ControlUpdate";
import {DCDataModel, IndexedDataSet} from "../shared/DCDataModel";
import {Control} from "../shared/Control";
import {Endpoint} from "../shared/Endpoint";
import { Injectable, Inject } from "@angular/core";
import { Headers, Http } from '@angular/http';
import { MdSnackBar, MdDialog } from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {AlertDialog} from "./alert-dialog.component";
import {EndpointType} from "../shared/EndpointType";
import {OptionSet} from "../shared/OptionSet";
import {Panel} from "../shared/Panel";
import {PanelControl} from "../shared/PanelControl";
import {Room} from "../shared/Room";
import {ActionTrigger} from "../shared/ActionTrigger";
import {ActionLog} from "../shared/ActionLog";

@Injectable()
export class DataService {
    socket: SocketIOClient.Socket;
    schema;
    //private http : Http;
    userSession : UserSession;
    private initialized = false;
    private dataModel : DCDataModel;
    pendingUpdates : Promise<void>[] = [];
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
    logs : ActionLog[] = [];


    constructor(
                private http : Http,
                private snackBar : MdSnackBar,
                private mdDialog : MdDialog) {
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

        if (typeof(window.localStorage) !== 'undefined') {
            let localConfig = window.localStorage['config'];
            if (typeof localConfig == 'string') {
                this.config = JSON.parse(localConfig);
            }
            else {
                window.localStorage['config'] = JSON.stringify(this.config);
            }
        }
        else {
            console.log("window.localStorage not available");
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

            if (typeof callback == 'function') {
                callback(record);
            }
        });
    }


    deleteRow(row : DCSerializable) {
        let resource = "api/data/" + row.table + "/" + row._id;

        // Check for foreign key constraints
        let referencedTable = "";
        for(let ref in row.referenced) {
            if (Object.keys(row.referenced[ref]).length > 0) {
                referencedTable = ref;
            }
        }

        if (referencedTable) {
            let msg = "Cannot delete " + row.table + " record due to foreign key constraint on " + referencedTable;

            this.errorToast({error: msg});
            return;
        }

        this.http.delete(resource).toPromise()
            .then(
                data => { this.loadData(data.json()) },
                data => { this.errorToast(data.json()) }
            );
    }

    dialogClose() {
        this.mdDialog.closeAll();
    }

    doAdminLogon(allowExpiration : boolean = false) {
        // First, check current login status
        if (this.userSession.login_expires > Date.now()) {
            let url = "/auth/admin/get_auth";
            this.http.get(url).toPromise().then(
                //Success
                response => {
                    Object.assign(this.userSession, response.json().session);

                    // Refresh credentials before they expire
                    let retryDelay = (this.userSession.admin_auth_expires - Date.now()) - 2000;
                    //let retryDelay = 60000;
                    let retryMilli = Date.now() + retryDelay;
                    let retryTime = new Date(retryMilli);
                    let retryTimeStr = retryTime.toTimeString().substr(0, 17);


                    if (retryMilli > this.userSession.login_expires) {
                        console.log("not scheduling admin refresh, user session will be expired");
                        return;
                    }

                    if (retryDelay > 0) {
                        this.adminLogonTimeout = setTimeout(() => {
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
                    else if (response.status == -1 || response.status == 0) {
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
            let expireStr = (new Date(this.userSession.login_expires)).toTimeString().substr(0, 17);
            console.log(`user session expired at ${expireStr}, referring to doLogon`);
            if (this.config.lastLogonAttempt) {
                let lastLogonStr = (new Date(this.config.lastLogonAttempt)).toTimeString().substr(0, 17);
                console.log(`last logon attempt was at ${lastLogonStr}`);
            }

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

            let location = window.location.pathname;
            let newLocation = "/auth/do_logon?";

            if (admin_auth_check) {
                newLocation = newLocation + "admin_auth_requested=1&";
            }

            console.log("doLogon: admin_auth_requested = " + admin_auth_check);

            newLocation = newLocation + "location=" + location;
            window.location.href = newLocation;
        }
    }


    errorToast(data) {
        let errorText = "An unknown error has occured"
        if (data.error) {
            errorText = data.error;
        }
        else if (typeof data == 'string') {
            errorText = data;
        }

        console.log(errorText);

        //$mdToast.show($mdToast.simple().content(errorText));

        this.snackBar.open(errorText, "OK");
    }

    generateEndpointConfig($event, endpointId : string) {
        let endpoint = this.getRowRef(Endpoint.tableStr, endpointId);
        let endpointName = endpoint.name.toLowerCase();
        endpointName = endpointName.replace(/ /g, '-');

        let url = `/auth/admin/create_endpoint_session?${endpointName}`;
        this.http.get(url).toPromise().then(
            //Success
            response => {
                let alert = `
module.exports = {
    endpointId: "${endpointId}",
    authId: "${response.json().session._id}"
}               
                `;

                let ref = this.mdDialog.open(AlertDialog);
                ref.componentInstance.title = `${endpointName}.js`;
                ref.componentInstance.content = alert;
                ref.componentInstance.ok = "Got It!";
            },
            response => {
                this.errorToast("Unable to retrieve endpoint ncontrol config");
            }
        );
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

        let getMProm =  new Promise((resolve, reject) => {
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
        newRow.loadDefaults();
        Object.assign(newRow, newData);

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

        if (! key || key === null) {
            throw new Error(`error looking up ${tableName} record for undefined key`);
        }

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
    //TODO: remove this function
    getTableRef(table: string) : IndexedDataSet<DCSerializable> {
        if (! this.dataModel[table]) {
            throw new Error("Error: getTableRef request for invalid table");
        }
        return this.dataModel[table];
    }


    getUserInfo() {
        let userInfoUrl = "/auth/user_session";
        if (typeof this.userInfoPromise == 'undefined') {
            this.userInfoPromise = this.http.get(userInfoUrl).toPromise()
                .then(
                    //Success
                    response => {
                        Object.assign(this.userSession, response.json().session);

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

    hideToast() {
        //this.$mdToast.hide();
    }

    init() {
        if (this.initialized) {
            return;
        }

        this.socket = io.connect(window.location.protocol + "//" + window.location.host,
            {
                //path: "/socket-dev.io",
                path: "/socket.io",
                transports: ["websocket"]
            }
        );

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
            console.log("reconnect, fetching data");
            this.getMData(Endpoint.tableStr, {});
        });

        this.socket.on('connect', () => {
            // Just load everything
            this.getUserInfo().then(() => {
                this.getMData(Control.tableStr, {});
                this.getMData(Endpoint.tableStr, {});
                this.getMData(EndpointType.tableStr, {});
                this.getMData(OptionSet.tableStr, {});
                this.getMData(Panel.tableStr, {});
                this.getMData(PanelControl.tableStr, {});
                this.getMData(Room.tableStr, {});
                this.getMData(ActionTrigger.tableStr, {});
            });
        });

        this.getUserInfo();
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
        try {
            this.dataModel.loadData(data);
        }
        catch (e) {
            console.error("loadData error: " + e.message);
        }
    }

    logAction(message: string, typeFlags: string[] = [], referenceList: string[] = []) {
        let id = this.guid();
        let action = new ActionLog(id,
            {
                _id: id,
                name : message,
                timestamp: Date.now(),
                typeFlags: typeFlags,
                referenceList: referenceList,
                user_session_id: this.userSession._id
            }
        );

        this.logs.unshift(action); // Use unshift to make it easier to view recent logs first

        console.log(`action logged: ${message}`);
    }

    revokeAdminAuth() {
        //TODO: this doesn't do anything unless the Apache auth session credentials
        // are also revoke
        this.userSession.admin_auth_expires = Date.now();

        if (this.adminLogonTimeout) {
            clearTimeout(this.adminLogonTimeout);
        }

        let url = "/auth/revoke_admin";
        this.http.get(url).toPromise().then(
            //Success
            response => {
                Object.assign(this.userSession, response.json().session);
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

            },
            (error) => {
                this.errorToast(error);
            }
        );
    }

    sortedArray(table : string, sortProp : string = 'name') : DCSerializable[] {
        return this.dataModel.sortedArray(table, sortProp);
    }

    publishStatusUpdate(message: string) {
        this.socket.emit('status-update', { message: message});
    }

    updateConfig() {
        if (typeof(window.localStorage) !== 'undefined') {
            window.localStorage['config'] = JSON.stringify(this.config);
        }
    }

    updateControlValue(control : Control) {
        if (this.pendingUpdates[control._id]) {
            clearTimeout(this.pendingUpdates[control._id]);
        }

        this.pendingUpdates[control._id] = setTimeout(() => {
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

            console.log(`control-update issued. ${control.name} : ${control.value}`);
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