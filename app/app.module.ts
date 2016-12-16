import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { MaterialModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import 'hammerjs';

import { UpgradeModule } from '@angular/upgrade/static';
import {MenuComponent} from "./menu.component";
import {MenuService} from "./menu.service";
import {ToolbarComponentNg2} from "./ng1/toolbar.component";
import {AdminOnlyDirective} from "./admin-only.directive";
import {DataService} from "./data.service";
import {AppRoutingModule} from "./app-router.module";
import {RoomsComponent} from "./rooms.component";
import {EndpointsComponent} from "./endpoints.component";
import {EndpointStatusComponent} from "./endpoint-status.component";
import {PanelComponentNg2} from "./ng1/panel.component";
import {RoomComponent} from "./room.component";
import {ControlComponentNg2} from "./ng1/control.component";
import {EndpointComponent} from "./endpoint.component";
import {ConfigComponent} from "./config.component";
import {ConfigDataComponent} from "./config-data.component";
import {RecordComponent} from "./record.component";
import {FkAutocompleteComponentNg2} from "./ng1/fk-autocomplete.component";
import {AlertDialog} from "./alert-dialog.component";
import {RecordEditorService} from "./record-editor.service";
import {TableComponentNg2} from "./ng1/table.component";
import {TableWrapperComponent} from "./table-wrapper.component";
import {FormsModule} from "@angular/forms";
import {ObjectEditorComponentNg2} from "./ng1/object-editor.component";



@NgModule({
    imports:      [
        BrowserModule,
        MaterialModule.forRoot(),
        HttpModule,
        AppRoutingModule,
        FormsModule,
        UpgradeModule
    ],
    declarations: [ MenuComponent,
        AdminOnlyDirective,
        AlertDialog,
        AppComponent,
        ConfigComponent,
        ConfigDataComponent,
        EndpointComponent,
        EndpointsComponent,
        EndpointStatusComponent,
        RecordComponent,
        RoomComponent,
        RoomsComponent,
        TableWrapperComponent,
        FkAutocompleteComponentNg2,
        ObjectEditorComponentNg2,
        PanelComponentNg2,
        ControlComponentNg2,
        TableComponentNg2,
        ToolbarComponentNg2,
        ],
    entryComponents: [
        AppComponent,
        AlertDialog,
        MenuComponent,
        RecordComponent
    ],
    providers:    [
        DataService,
        MenuService,
        RecordEditorService
    ],
    //bootstrap:    [ AppComponent ]
})
export class AppModule {
    ngDoBootstrap() {};
}
