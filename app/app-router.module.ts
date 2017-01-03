import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RoomsComponent} from "./rooms/rooms.component";
import {EndpointsComponent} from "./endpoints.component";
import {RoomComponent} from "./rooms/room.component";
import {EndpointComponent} from "./endpoint.component";
import {ConfigComponent} from "./config.component";
import {ConfigDataComponent} from "./config-data.component";
import {TableWrapperComponent} from "./table-wrapper.component";
import {RoomResolver} from "./rooms/room.resolver";
import {EndpointResolver} from "./endpoint.resolver";


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
                component: ConfigDataComponent,
                data: {
                    title: "Data Tables"
                }
            },
            {
                path: ':name',
                component: TableWrapperComponent,
                data: {
                    title: "Table Editor",
                    cardClasses: "card-wide"
                }
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