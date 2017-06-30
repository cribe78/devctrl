"use strict";
/**
 * Created by chris on 8/17/16.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DCSerializable_1 = require("./DCSerializable");
var EndpointType_1 = require("./EndpointType");
var EndpointStatus;
(function (EndpointStatus) {
    EndpointStatus[EndpointStatus["Online"] = 0] = "Online";
    EndpointStatus[EndpointStatus["Disabled"] = 1] = "Disabled";
    EndpointStatus[EndpointStatus["Offline"] = 2] = "Offline";
    EndpointStatus[EndpointStatus["Unknown"] = 3] = "Unknown";
})(EndpointStatus = exports.EndpointStatus || (exports.EndpointStatus = {}));
var Endpoint = (function (_super) {
    __extends(Endpoint, _super);
    function Endpoint(_id, data) {
        var _this = _super.call(this, _id) || this;
        _this.foreignKeys = [
            {
                type: EndpointType_1.EndpointType,
                fkObjProp: "type",
                fkIdProp: "endpoint_type_id",
                fkTable: EndpointType_1.EndpointType.tableStr
            }
        ];
        _this.table = Endpoint.tableStr;
        _this.referenced = {
            'controls': {}
        };
        _this.requiredProperties = _this.requiredProperties.concat([
            'endpoint_type_id',
            'status',
            'ip',
            'port',
            'enabled',
            'commLogOptions'
        ]);
        _this.defaultProperties = {
            status: EndpointStatus.Offline,
            ip: "",
            port: 0,
            enabled: false,
            commLogOptions: "default"
        };
        if (data) {
            _this.loadData(data);
        }
        return _this;
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
    Object.defineProperty(Endpoint.prototype, "commLogOptions", {
        get: function () {
            return this._commLogOptions;
        },
        set: function (val) {
            this._commLogOptions = val;
            var optionsList = val.split(",");
            this.commLogOptionsObj = {};
            for (var _i = 0, optionsList_1 = optionsList; _i < optionsList_1.length; _i++) {
                var opt = optionsList_1[_i];
                this.commLogOptionsObj[opt] = true;
            }
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
        return DCSerializable_1.DCSerializable.defaultDataObject(this);
    };
    return Endpoint;
}(DCSerializable_1.DCSerializable));
Endpoint.tableStr = "endpoints";
exports.Endpoint = Endpoint;
//# sourceMappingURL=Endpoint.js.map