/**
 * Created by chris on 8/17/16.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DCSerializable_1 = require("./DCSerializable");
var EndpointType_1 = require("./EndpointType");
(function (EndpointStatus) {
    EndpointStatus[EndpointStatus["Online"] = 0] = "Online";
    EndpointStatus[EndpointStatus["Disabled"] = 1] = "Disabled";
    EndpointStatus[EndpointStatus["Offline"] = 2] = "Offline";
    EndpointStatus[EndpointStatus["Unknown"] = 3] = "Unknown";
})(exports.EndpointStatus || (exports.EndpointStatus = {}));
var EndpointStatus = exports.EndpointStatus;
var Endpoint = (function (_super) {
    __extends(Endpoint, _super);
    function Endpoint(_id, data) {
        _super.call(this, _id);
        this.foreignKeys = [
            {
                type: EndpointType_1.EndpointType,
                fkObjProp: "type",
                fkIdProp: "endpoint_type_id",
                fkTable: EndpointType_1.EndpointType.tableStr
            }
        ];
        this.table = Endpoint.tableStr;
        this.requiredProperties = this.requiredProperties.concat([
            'endpoint_type_id',
            'status',
            'ip',
            'port',
            'enabled'
        ]);
        if (data) {
            this.loadData(data);
        }
    }
    Object.defineProperty(Endpoint.prototype, "address", {
        get: function () {
            return this.ip;
        },
        set: function (address) {
            this.ip = address;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Endpoint.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (newType) {
            this.endpoint_type_id = newType._id;
            this._type = newType;
        },
        enumerable: true,
        configurable: true
    });
    Endpoint.prototype.getDataObject = function () {
        return {
            _id: this._id,
            endpoint_type_id: this.endpoint_type_id,
            status: this.status,
            name: this.name,
            ip: this.ip,
            port: this.port,
            enabled: this.enabled
        };
    };
    Endpoint.tableStr = "endpoints";
    return Endpoint;
}(DCSerializable_1.DCSerializable));
exports.Endpoint = Endpoint;
//# sourceMappingURL=Endpoint.js.map