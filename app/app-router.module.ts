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
import {ControlDetailComponent} from "./controls/control-detail.component";
import {ControlResolver} from "./controls/control.resolver";
import {ClassroomFullscreenComponent} from "./fullscreen-classroom/classroom-fullscreen.component";


export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/rooms',
        pathMatch: 'full'
    },
    {
        path: 'index-jit.html',
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
        path: 'controls',
        children: [
            {
                path: '',
                redirectTo: '/config/controls',
                pathMatch: 'full'
            },
            {
                path: ':id',
                component: ControlDetailComponent,
                resolve: {
                    control: ControlResolver
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
    },
    {
        path: "pict-fullscreen",
        component: ClassroomFullscreenComponent,
        data: {
            fullscreen: true
        }
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
        EndpointResolver,
        ControlResolver
    ]
})
export class AppRoutingModule {}