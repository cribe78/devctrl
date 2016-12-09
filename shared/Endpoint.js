/**
 * Created by chris on 8/17/16.
 */
"use strict";
const DCSerializable_1 = require("./DCSerializable");
const EndpointType_1 = require("./EndpointType");
var EndpointStatus;
(function (EndpointStatus) {
    EndpointStatus[EndpointStatus["Online"] = 0] = "Online";
    EndpointStatus[EndpointStatus["Disabled"] = 1] = "Disabled";
    EndpointStatus[EndpointStatus["Offline"] = 2] = "Offline";
    EndpointStatus[EndpointStatus["Unknown"] = 3] = "Unknown";
})(EndpointStatus = exports.EndpointStatus || (exports.EndpointStatus = {}));
class Endpoint extends DCSerializable_1.DCSerializable {
    constructor(_id, data) {
        super(_id);
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
        this.defaultProperties = {
            status: EndpointStatus.Offline,
            ip: "",
            port: 0,
            enabled: false
        };
        if (data) {
            this.loadData(data);
        }
    }
    get address() {
        return this.ip;
    }
    set address(address) {
        this.ip = address;
    }
    get type() {
        return this._type;
    }
    set type(newType) {
        this.endpoint_type_id = newType._id;
        this._type = newType;
    }
    getDataObject() {
        return DCSerializable_1.DCSerializable.defaultDataObject(this);
    }
}
Endpoint.tableStr = "endpoints";
exports.Endpoint = Endpoint;
//# sourceMappingURL=Endpoint.js.map