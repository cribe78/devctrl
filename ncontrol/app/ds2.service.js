"use strict";
var DataService2 = (function () {
    function DataService2($q) {
        this.$q = $q;
    }
    DataService2.prototype.init = function () {
        console.log("dataService2 initialized");
    };
    DataService2.$inject = ['$q'];
    return DataService2;
}());
exports.DataService2 = DataService2;
//# sourceMappingURL=ds2.service.js.map