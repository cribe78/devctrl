"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var data_service_1 = require("./data.service");
var Endpoint_1 = require("../shared/Endpoint");
var EndpointResolver = (function () {
    function EndpointResolver(ds, router) {
        this.ds = ds;
        this.router = router;
    }
    EndpointResolver.prototype.resolve = function (route, state) {
        var _this = this;
        var id = route.params['id'];
        var endpointsPromise = this.ds.getTablePromise(Endpoint_1.Endpoint.tableStr);
        return endpointsPromise.then(function (loaded) {
            if (loaded) {
                var endpoints = _this.ds.getTable(Endpoint_1.Endpoint.tableStr);
                console.log("EndpointResolver resolved " + endpoints[id].name);
                return endpoints[id];
            }
            else {
                console.log("EndpointResolver: endpoints not loaded");
                _this.router.navigate(['/endpoints']);
            }
        });
    };
    return EndpointResolver;
}());
EndpointResolver = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [data_service_1.DataService, router_1.Router])
], EndpointResolver);
exports.EndpointResolver = EndpointResolver;
//# sourceMappingURL=endpoint.resolver.js.map