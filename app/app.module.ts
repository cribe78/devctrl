import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { MaterialModule, MdSnackBarModule, MdDialogModule} from '@angular/material';
import { HttpModule } from '@angular/http';
import 'hammerjs';

import { UpgradeModule } from '@angular/upgrade/static';
import {MenuComponent} from "./menu.component";
import {MenuService} from "./menu.service";
import {ToolbarComponent} from "./toolbar.component";
import {AdminOnlyDirective} from "./admin-only.directive";
import {DataService} from "./data.service";
import {AppRoutingModule} from "./app-router.module";
import {EndpointsComponent} from "./endpoints.component";
import {EndpointStatusComponent} from "./endpoint-status.component";
import {EndpointComponent} from "./endpoint.component";
import {ConfigComponent} from "./config.component";
import {ConfigDataComponent} from "./config-data.component";
import {RecordComponent} from "./data-editor/record.component";
import {FkAutocompleteComponent} from "./fk-autocomplete.component";
import {AlertDialog} from "./alert-dialog.component";
import {RecordEditorService} from "./data-editor/record-editor.service";
import {TableComponent} from "./table.component";
import {TableWrapperComponent} from "./table-wrapper.component";
import {FormsModule} from "@angular/forms";
//import {ObjectEditorComponentNg2} from "./ng1/object-editor.component";
import {ControlsModule} from "./controls/controls.module";
import {RoomComponent} from "./rooms/room.component";
import {RoomsComponent} from "./rooms/rooms.component";
import {PanelComponent} from "./rooms/panel.component";
import {ObjectEditorComponent} from "./data-editor/object-editor.component";
import {FlexLayoutModule} from "@angular/flex-layout";



@NgModule({
    imports:      [
        BrowserModule,
        FlexLayoutModule.forRoot(),
        MaterialModule.forRoot(),
        MdSnackBarModule,
        MdDialogModule.forRoot(),
        HttpModule,
        AppRoutingModule,
        FormsModule,
        UpgradeModule,
        ControlsModule,
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
        FkAutocompleteComponent,
        ObjectEditorComponent,
        PanelComponent,
        RecordComponent,
        RoomComponent,
        RoomsComponent,
        TableComponent,
        TableWrapperComponent,
        ToolbarComponent
        ],
    entryComponents: [
        AlertDialog,
        MenuComponent,
        RecordComponent
    ],
    providers:    [
        DataService,
        MenuService,
        RecordEditorService
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule {
    //ngDoBootstrap() {};
}
