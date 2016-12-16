import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RoomsComponent} from "./rooms.component";
import {EndpointsComponent} from "./endpoints.component";
import {RoomComponent} from "./room.component";
import {EndpointComponent} from "./endpoint.component";
import {ConfigComponent} from "./config.component";
import {ConfigDataComponent} from "./config-data.component";
import {TableWrapperComponent} from "./table-wrapper.component";


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
                component: RoomComponent
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
    ]
})
export class AppRoutingModule {}