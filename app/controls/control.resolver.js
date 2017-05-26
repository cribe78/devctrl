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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var data_service_1 = require("../data.service");
var Control_1 = require("../../shared/Control");
var ControlResolver = (function () {
    function ControlResolver(ds, router) {
        this.ds = ds;
        this.router = router;
    }
    ControlResolver.prototype.resolve = function (route, state) {
        var _this = this;
        var id = route.params['id'];
        var controlsPromise = this.ds.getTablePromise(Control_1.Control.tableStr);
        return controlsPromise.then(function (loaded) {
            if (loaded) {
                var controls = _this.ds.getTable(Control_1.Control.tableStr);
                console.log("ControlResolver resolved " + controls[id].name);
                return controls[id];
            }
            else {
                console.log("ControlsResolver: controls not loaded");
                _this.router.navigate(['/controls']);
            }
        });
    };
    return ControlResolver;
}());
ControlResolver = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [data_service_1.DataService, router_1.Router])
], ControlResolver);
exports.ControlResolver = ControlResolver;
//# sourceMappingURL=control.resolver.js.map