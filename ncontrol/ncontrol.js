"use strict";
var io = require("socket.io-client");
var Shared_1 = require("../shared/Shared");
var EndpointCommunicator_1 = require("./EndpointCommunicator");
var debugMod = require("debug"); // see https://www.npmjs.com/package/debug
var debug = debugMod('ncontrol');
var NControl = (function () {
    function NControl() {
        this.syncControlTemplatesPassNumber = 0;
        this.dataModel = new Shared_1.DCDataModel();
        this.dataModel.debug = debugMod("dataModel");
    }
    NControl.bootstrap = function () {
        return new NControl();
    };
    NControl.prototype.run = function (config) {
        var self = this;
        this.config = config;
        this.io = io.connect(config.wsUrl);
        this.io.on('connect', function () {
            debug("websocket client connected");
            //Get endpoint data
            self.getEndpointConfig();
            EndpointCommunicator_1.EndpointCommunicator.listCommunicators();
        });
        debug("testString is " + config.testString);
    };
    NControl.prototype.getControlTemplates = function () {
        var reqData = {
            table: Shared_1.ControlTemplate.tableStr,
            params: {
                endpoint_id: this.endpoint._id
            }
        };
        this.getData(reqData, this.launchCommunicator);
    };
    NControl.prototype.addData = function (reqData, then) {
        var self = this;
        this.io.emit('add-data', reqData, function (data) {
            if (data.error) {
                debug("add-data error: " + data.error);
            }
            else {
                self.dataModel.loadData(data);
            }
            then.call(self); // If the callback doesn't belong to this class, this could get weird
        });
    };
    NControl.prototype.getData = function (reqData, then) {
        var self = this;
        this.io.emit('get-data', reqData, function (data) {
            if (data.error) {
                debug("get-data error: " + data.error);
            }
            else {
                self.dataModel.loadData(data);
            }
            then.call(self); // If the callback doesn't belong to this class, this could get weird
        });
    };
    NControl.prototype.getEndpointConfig = function () {
        var self = this;
        self.endpoint = self.dataModel.getItem(self.config.endpointId, Shared_1.Endpoint.tableStr);
        var reqData = self.endpoint.itemRequestData();
        self.getData(reqData, self.getEndpointTypeConfig);
    };
    NControl.prototype.getEndpointTypeConfig = function () {
        if (!this.endpoint.dataLoaded) {
            debug("endpoint data is missing");
            return;
        }
        this.getData(this.endpoint.type.itemRequestData(), this.getControlTemplates);
    };
    NControl.prototype.launchCommunicator = function () {
        if (!this.endpoint.type.dataLoaded) {
            debug("endpointType data is missing");
        }
        var commClass = this.endpoint.type.communicatorClass;
        var requirePath = "./Communicators/" + commClass;
        this.communicator = require(requirePath);
        this.communicator.setConfig({ endpoint: this.endpoint });
        this.syncControlTemplates();
        this.communicator.connect();
    };
    NControl.prototype.syncControlTemplates = function () {
        this.syncControlTemplatesPassNumber++;
        if (this.syncControlTemplatesPassNumber > 2) {
            throw new Error("failed to sync control templates");
        }
        // Get ControlTemplates from communicator
        var controlTemplates = this.communicator.getControlTemplates();
        var newTemplates = [];
        var ctByCtid = {};
        for (var id in this.dataModel.control_templates) {
            var ct = this.dataModel.control_templates[id];
            ctByCtid[ct.ctid] = ct;
        }
        // Match communicator control templates to server control templates by ctid
        for (var ctid in controlTemplates) {
            if (!ctByCtid[ctid]) {
                newTemplates.push(controlTemplates[ctid]);
            }
        }
        // newTemplates is an array of templates to create
        // Create new ControlTemplates on server
        if (newTemplates.length > 0) {
            debug("adding new controls");
            this.addData({ control_templates: newTemplates }, this.syncControlTemplates);
            return;
        }
        debug("controlTemplates successfully synced!");
        // Pass completed ControlTemplate set to communicator
        this.communicator.setTemplates(this.dataModel.control_templates);
    };
    return NControl;
}());
var ncontrol = NControl.bootstrap();
module.exports = ncontrol;
//# sourceMappingURL=ncontrol.js.map