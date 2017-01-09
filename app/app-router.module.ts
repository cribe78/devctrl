import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RoomsComponent} from "./rooms/rooms.component";
import {EndpointsComponent} from "./endpoints/endpoints.component";
import {RoomComponent} from "./rooms/room.component";
import {EndpointComponent} from "./endpoints/endpoint.component";
import {ConfigComponent} from "./config.component";
import {ConfigDataComponent} from "./data-editor/config-data.component";
import {RoomResolver} from "./rooms/room.resolver";
import {EndpointResolver} from "./endpoints/endpoint.resolver";
import {TableComponent} from "./data-editor/table.component";


export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/rooms',
        pathMatch: 'full'
    },
    {
        path: 'rooms',
        data : {
            title: "Locations"
        },
        children: [
            {
                path: '',
                component: RoomsComponent
            },
            {
                path: ':name',
                component: RoomComponent,
                resolve: {
                    room: RoomResolver
                }
            }
        ]
    },
    {
        path: 'devices',
        children: [
            {
                path: '',
                component: EndpointsComponent,
                data : {
                    title: 'Devices'
                }
            },
            {
                path: ':id',
                component: EndpointComponent,
                data : {
                    listByName: 'endpoints',
                    title: false
                },
                resolve: {
                    endpoint: EndpointResolver
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
                component: ConfigDataComponent
            },
            {
                path: ':name',
                component: TableComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        RoomResolver,
        EndpointResolver
    ]
})
export class AppRoutingModule {}