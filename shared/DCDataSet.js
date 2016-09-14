/*
DCDataSet

DCDataSet type objects are used for exchanging data between the various components of the DevCtrl application.
 */
"use strict";
var DCDataSet = (function () {
    function DCDataSet(data) {
        this.data = data;
    }
    ;
    DCDataSet.prototype.endpoint = function (id) {
        if (this.data.endpoints && this.data.endpoints[id]) {
            return this.data.endpoints[id];
        }
    };
    return DCDataSet;
}());
exports.DCDataSet = DCDataSet;
//# sourceMappingURL=DCDataSet.js.map