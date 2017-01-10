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
var data_service_1 = require("../data.service");
var Room_1 = require("../../shared/Room");
var RoomResolver = (function () {
    function RoomResolver(ds, router) {
        this.ds = ds;
        this.router = router;
    }
    RoomResolver.prototype.resolve = function (route, state) {
        var _this = this;
        var name = route.params['name'];
        console.log("room resolver invoked");
        var roomsPromise = this.ds.getTablePromise(Room_1.Room.tableStr);
        return roomsPromise.then(function (loaded) {
            if (loaded) {
                var rooms = _this.ds.getTable(Room_1.Room.tableStr);
                if (rooms[name]) {
                    // We were given an id, reroute to name
                    console.log("rerouting from room " + name + " to " + rooms[name].name);
                    _this.router.navigate(['/rooms', rooms[name].name]);
                    return;
                }
                for (var id in rooms) {
                    if (rooms[id].name.toLowerCase() == name.toLowerCase()) {
                        console.log("RoomResolver resolved " + name);
                        return rooms[id];
                    }
                }
                console.log("RoomResolver: Room " + name + " not found");
            }
            else {
                console.log("RoomResolver: rooms not loaded");
                _this.router.navigate(['/rooms']);
            }
        });
    };
    return RoomResolver;
}());
RoomResolver = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [data_service_1.DataService, router_1.Router])
], RoomResolver);
exports.RoomResolver = RoomResolver;
//# sourceMappingURL=room.resolver.js.map