"use strict";
var data_service_schema_1 = require("./ng1/data-service-schema");
var DataService2 = (function () {
    function DataService2($window, $http, $mdToast, $timeout, $q, socketFactory, $mdDialog, $location) {
        this.$window = $window;
        this.$http = $http;
        this.$mdToast = $mdToast;
        this.$timeout = $timeout;
        this.$q = $q;
        this.socketFactory = socketFactory;
        this.$mdDialog = $mdDialog;
        this.$location = $location;
        this.schema = data_service_schema_1.dataServiceSchema;
    }
    DataService2.prototype.init = function () {
        console.log("dataService2 initialized");
    };
    DataService2.$inject = ['$window', '$http', '$mdToast', '$timeout', '$q', 'socketFactory', '$mdDialog', '$location'];
    return DataService2;
}());
exports.DataService2 = DataService2;
//# sourceMappingURL=ds2.service.js.map