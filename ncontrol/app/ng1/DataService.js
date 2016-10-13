"use strict";
exports.DataServiceFactory = ['$window', '$http', '$mdToast', '$timeout',
    '$q', 'socket', '$mdDialog', '$location',
    'DataService2',
    function ($window, $http, $mdToast, $timeout, $q, socket, $mdDialog, $location, DataService2) {
        DataService2.init();
        var schema = DataService2.schema;
        var dataModel = DataService2.dataModel;
        var self = {
            config: DataService2.config,
            dataModel: dataModel,
            userSession: DataService2.userSession,
            schema: schema,
            getMProm: null,
            addRow: function (row, callback) { DataService2.addRow(row, callback); },
            dialogClose: function () { DataService2.dialogClose(); },
            deleteRow: function (row) { DataService2.deleteRow(row); },
            doAdminLogon: function () { DataService2.doAdminLogon(); },
            doLogon: function (admin_auth_check, force_login) {
                if (admin_auth_check === void 0) { admin_auth_check = false; }
                if (force_login === void 0) { force_login = false; }
                DataService2.doLogon(admin_auth_check, force_login);
            },
            editEnum: function ($event, myEnum, enumRefRecord, options) { DataService2.editEnum($event, myEnum, enumRefRecord, options); },
            editRecord: function ($event, id, tableName, recordDefaults) { DataService2.editRecord($event, id, tableName, recordDefaults); },
            editRecordClose: function () { DataService2.editRecordClose(); },
            errorToast: function (data) { DataService2.errorToast(data); },
            getLog: function () { DataService2.getLog(); },
            getMData: function (table, params) { return DataService2.getMData(table, params); },
            getNewRowRef: function (tableName) { return DataService2.getNewRowRef(tableName); },
            getRowRef: function (tableName, key) { return DataService2.getRowRef(tableName, key); },
            getSchema: function (table) { return DataService2.getSchema(table); },
            getTable: function (table) { return DataService2.getTable(table); },
            getTablePromise: function (table) { return DataService2.getTablePromise(table); },
            getTableRef: function (table) { DataService2.getTableRef(table); },
            getUserInfo: function () { DataService2.getUserInfo(); },
            isAdminAuthorized: function () { return DataService2.isAdminAuthorized(); },
            loadData: function (data) { return DataService2.loadData(data); },
            revokeAdminAuth: function () { },
            showControlLog: function ($event, ctrl) { DataService2.showControlLog($event, ctrl); },
            updateConfig: function () { DataService2.updateConfig(); },
            updateControlValue: function (control) { DataService2.updateControlValue(control); },
            updateRow: function (row) { DataService2.updateRow(row); }
        };
        return self;
    }
];
//# sourceMappingURL=DataService.js.map