"use strict";
var EndpointCommunicator = (function () {
    function EndpointCommunicator() {
        this.templatesByCtid = {};
        this.templates = {};
    }
    EndpointCommunicator.prototype.connect = function () { };
    ;
    EndpointCommunicator.prototype.setConfig = function (config) {
        this.config = config;
    };
    EndpointCommunicator.prototype.getControlTemplates = function () {
        return {};
    };
    EndpointCommunicator.prototype.setTemplates = function (templates) {
        this.templates = templates;
        for (var id in templates) {
            this.templatesByCtid[templates[id].ctid] = templates[id];
        }
    };
    EndpointCommunicator.listCommunicators = function () {
        //for (let comm in communicators ) {
        //console.log("Comm: " + comm);
        //}
    };
    return EndpointCommunicator;
}());
exports.EndpointCommunicator = EndpointCommunicator;
//# sourceMappingURL=EndpointCommunicator.js.map