/**
 * Created by chris on 8/17/16.
 */
"use strict";
(function (EndpointStatus) {
    EndpointStatus[EndpointStatus["Online"] = 0] = "Online";
    EndpointStatus[EndpointStatus["Disabled"] = 1] = "Disabled";
    EndpointStatus[EndpointStatus["Offline"] = 2] = "Offline";
    EndpointStatus[EndpointStatus["Unknown"] = 3] = "Unknown";
})(exports.EndpointStatus || (exports.EndpointStatus = {}));
var EndpointStatus = exports.EndpointStatus;
var Endpoint = (function () {
    function Endpoint(data) {
        this.type = data.type;
        this._id = data._id;
    }
    return Endpoint;
}());
exports.Endpoint = Endpoint;
//# sourceMappingURL=Endpoint.js.map