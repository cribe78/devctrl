"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var rooms_component_1 = require("./rooms/rooms.component");
var endpoints_component_1 = require("./endpoints/endpoints.component");
var room_component_1 = require("./rooms/room.component");
var endpoint_component_1 = require("./endpoints/endpoint.component");
var config_data_component_1 = require("./data-editor/config-data.component");
var room_resolver_1 = require("./rooms/room.resolver");
var endpoint_resolver_1 = require("./endpoints/endpoint.resolver");
var table_component_1 = require("./data-editor/table.component");
var control_detail_component_1 = require("./controls/control-detail.component");
var control_resolver_1 = require("./controls/control.resolver");
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
        path: 'controls',
        children: [
            {
                path: '',
                redirectTo: '/config/controls',
                pathMatch: 'full'
            },
            {
                path: ':id',
                component: control_detail_component_1.ControlDetailComponent,
                resolve: {
                    control: control_resolver_1.ControlResolver
                }
            }
        ]
    },
    {
        path: 'config',
        children: [
            {
                path: '',
                redirectTo: '/config/data',
                pathMatch: 'full'
            },
            {
                path: 'data',
                component: config_data_component_1.ConfigDataComponent
            },
            {
                path: ':name',
                component: table_component_1.TableComponent
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
            endpoint_resolver_1.EndpointResolver,
            control_resolver_1.ControlResolver
        ]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-router.module.js.map