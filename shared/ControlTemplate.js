"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DCSerializable_1 = require("./DCSerializable");
var ControlTemplate = (function (_super) {
    __extends(ControlTemplate, _super);
    function ControlTemplate(_id, data) {
        _super.call(this, _id);
        if (data) {
            this.loadData(data);
        }
    }
    ControlTemplate.prototype.loadData = function (data) {
        this.endpoint_id = data.endpoint_id;
        this.ctid = data.ctid;
        this.name = data.name;
        this.usertype = data.usertype;
        this.control_type = data.control_type;
        this.poll = data.poll;
        this.config = data.config;
        this.dataLoaded = true;
    };
    ControlTemplate.prototype.getDataObject = function () {
        return {
            _id: this._id,
            endpoint_id: this.endpoint_id,
            ctid: this.ctid,
            name: this.name,
            usertype: this.usertype,
            control_type: this.control_type,
            poll: this.poll,
            config: this.config
        };
    };
    return ControlTemplate;
}(DCSerializable_1.DCSerializable));
exports.ControlTemplate = ControlTemplate;
//# sourceMappingURL=ControlTemplate.js.map