import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './layout/app.component';
import { MaterialModule, MdSnackBarModule, MdDialogModule} from '@angular/material';
import { HttpModule } from '@angular/http';
import 'hammerjs';

import { UpgradeModule } from '@angular/upgrade/static';
import {MenuComponent} from "./layout/menu.component";
import {MenuService} from "./layout/menu.service";
import {ToolbarComponent} from "./layout/toolbar.component";
import {AdminOnlyDirective} from "./admin-only.directive";
import {DataService} from "./data.service";
import {AppRoutingModule} from "./app-router.module";
import {EndpointsComponent} from "./endpoints/endpoints.component";
import {EndpointStatusComponent} from "./endpoints/endpoint-status.component";
import {EndpointComponent} from "./endpoints/endpoint.component";
import {ConfigComponent} from "./config.component";
import {ConfigDataComponent} from "./data-editor/config-data.component";
import {RecordComponent} from "./data-editor/record.component";
import {FkAutocompleteComponent} from "./data-editor/fk-autocomplete.component";
import {AlertDialog} from "./alert-dialog.component";
import {RecordEditorService} from "./data-editor/record-editor.service";
import {TableComponent} from "./data-editor/table.component";
import {FormsModule} from "@angular/forms";
//import {ObjectEditorComponentNg2} from "./ng1/object-editor.component";
import {ControlsModule} from "./controls/controls.module";
import {RoomComponent} from "./rooms/room.component";
import {RoomsComponent} from "./rooms/rooms.component";
import {PanelComponent} from "./rooms/panel.component";
import {ObjectEditorComponent} from "./data-editor/object-editor.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MediaService} from "./layout/media.service";
import {LayoutService} from "./layout/layout.service";
import {ActionHistoryComponent} from "./layout/action-history.component";



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
        ToolbarComponent,
        ActionHistoryComponent
        ],
    entryComponents: [
        AlertDialog,
        MenuComponent,
        RecordComponent
    ],
    providers:    [
        DataService,
        MenuService,
        RecordEditorService,
        MediaService,
        LayoutService
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule {
    //ngDoBootstrap() {};
}
