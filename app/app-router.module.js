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
var rooms_component_1 = require("./rooms/rooms.component");
var endpoints_component_1 = require("./endpoints/endpoints.component");
var room_component_1 = require("./rooms/room.component");
var endpoint_component_1 = require("./endpoints/endpoint.component");
var config_data_component_1 = require("./config-data.component");
var table_wrapper_component_1 = require("./table-wrapper.component");
var room_resolver_1 = require("./rooms/room.resolver");
var endpoint_resolver_1 = require("./endpoints/endpoint.resolver");
exports.appRoutes = [
    {
        path: '',
        redirectTo: '/rooms',
        pathMatch: 'full'
    },
    {
        path: 'rooms',
        data: {
            title: "Locations"
        },
        children: [
            {
                path: '',
                component: rooms_component_1.RoomsComponent
            },
            {
                path: ':name',
                component: room_component_1.RoomComponent,
                resolve: {
                    room: room_resolver_1.RoomResolver
                }
            }
        ]
    },
    {
        path: 'devices',
        children: [
            {
                path: '',
                component: endpoints_component_1.EndpointsComponent,
                data: {
                    title: 'Devices'
                }
            },
            {
                path: ':id',
                component: endpoint_component_1.EndpointComponent,
                data: {
                    listByName: 'endpoints',
                    title: false
                },
                resolve: {
                    endpoint: endpoint_resolver_1.EndpointResolver
                }
            }
        ]
    },
    {
        path: 'config',
        children: [
            {
                path: '',
                component: config_data_component_1.ConfigDataComponent,
                data: {
                    title: "Data Tables"
                }
            },
            {
                path: ':name',
                component: table_wrapper_component_1.TableWrapperComponent,
                data: {
                    title: "Table Editor",
                    cardClasses: "card-wide"
                }
            }
        ]
    }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forRoot(exports.appRoutes)
        ],
        exports: [
            router_1.RouterModule
        ],
        providers: [
            room_resolver_1.RoomResolver,
            endpoint_resolver_1.EndpointResolver
        ]
    }),
    __metadata("design:paramtypes", [])
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-router.module.js.map