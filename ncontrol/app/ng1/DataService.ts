
import {RecordCtrl} from "./RecordCtrl";
import {EnumEditorCtrl} from "./EnumEditorCtrl";
import {CtrlLogCtrl} from "./CtrlLogCtrl";
import {UserSession} from "../../shared/UserSession";

import {SocketService} from "../socket";
import {DataService2} from "../ds2.service";

export let DataServiceFactory = ['$window', '$http', '$mdToast', '$timeout',
    '$q', 'socket', '$mdDialog', '$location',
    'DataService2',
    function($window, $http, $mdToast, $timeout, $q,
             socket : SocketService, $mdDialog, $location, DataService2 : DataService2) {
        DataService2.init();
        let schema = DataService2.schema;
        let dataModel = DataService2.dataModel;

        var self = {
            config : DataService2.config,
            dataModel : dataModel,
            userSession: DataService2.userSession,
            schema : schema,
            getMProm : null,
            addRow : (row, callback) => {DataService2.addRow(row, callback)},
            dialogClose : function() {DataService2.dialogClose()},
            deleteRow : row => {DataService2.deleteRow(row)},
            doAdminLogon : () => { DataService2.doAdminLogon() },
            doLogon : function(admin_auth_check: boolean = false, force_login: boolean = false) { DataService2.doLogon(admin_auth_check, force_login) },
            editEnum : function($event, myEnum, enumRefRecord, options) { DataService2.editEnum($event, myEnum, enumRefRecord, options) },
            editRecord : function($event, id, tableName, recordDefaults) { DataService2.editRecord($event, id, tableName, recordDefaults) },
            editRecordClose : function() { DataService2.editRecordClose() },
            errorToast: function(data) { DataService2.errorToast(data) },
            getLog : function() { DataService2.getLog() },
            getMData : (table, params) => {return DataService2.getMData(table, params)},
            getNewRowRef : function(tableName) { return DataService2.getNewRowRef(tableName)},
            getRowRef : function(tableName: string, key: string) { return DataService2.getRowRef(tableName, key) },
            getSchema : table => {return DataService2.getSchema(table)},
            getTable : table => { return DataService2.getTable(table)},
            getTablePromise : table => {return DataService2.getTablePromise(table)},
            getTableRef : table => {DataService2.getTableRef(table)},
            getUserInfo : function() { DataService2.getUserInfo() },
            isAdminAuthorized: function() { return DataService2.isAdminAuthorized(); },
            loadData : data => {return DataService2.loadData(data) },
            revokeAdminAuth : function() {},
            showControlLog : function($event, ctrl) {DataService2.showControlLog($event,ctrl)},
            updateConfig : () => { DataService2.updateConfig() },
            updateControlValue : control => {DataService2.updateControlValue(control)},
            updateRow : row => {DataService2.updateRow(row)}
        };

        return self;
    }
];