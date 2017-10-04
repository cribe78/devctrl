import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent }   from './layout/app.component';
import { MdSnackBarModule, MdDialogModule} from '@angular/material';
import { HttpModule } from '@angular/http';
import 'hammerjs';

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
import {ControlsModule} from "./controls/controls.module";
import {RoomComponent} from "./rooms/room.component";
import {RoomsComponent} from "./rooms/rooms.component";
import {PanelComponent} from "./rooms/panel.component";
import {ObjectEditorComponent} from "./data-editor/object-editor.component";
import {MediaService} from "./layout/media.service";
import {LayoutService} from "./layout/layout.service";
import {ActionHistoryComponent} from "./layout/action-history.component";
import {DCMaterialModule} from "./dc-material.module";
import {ControlDetailComponent} from "./controls/control-detail.component";
import {WatcherActionValueComponent} from "./data-editor/watcher-action-value.component";
import {ClassroomFullscreenComponent} from "./fullscreen-classroom/classroom-fullscreen.component";
import {FullscreenPresetMapComponent} from "./fullscreen-classroom/fullscreen-preset-map.component";
import {LongPressDirective} from "./fullscreen-classroom/long-press.directive";
import {StudentNameEditorComponent} from "./fullscreen-classroom/student-name-editor.component";



@NgModule({
    imports:      [
        BrowserModule,
        BrowserAnimationsModule,
        DCMaterialModule,
        MdSnackBarModule,
        MdDialogModule,
        HttpModule,
        AppRoutingModule,
        FormsModule,
        ControlsModule,
    ],
    declarations: [ MenuComponent,
        AdminOnlyDirective,
        AlertDialog,
        AppComponent,
        ClassroomFullscreenComponent,
        ConfigComponent,
        ConfigDataComponent,
        ControlDetailComponent,
        EndpointComponent,
        EndpointsComponent,
        EndpointStatusComponent,
        FkAutocompleteComponent,
        FullscreenPresetMapComponent,
        LongPressDirective,
        ObjectEditorComponent,
        PanelComponent,
        RecordComponent,
        RoomComponent,
        RoomsComponent,
        StudentNameEditorComponent,
        TableComponent,
        ToolbarComponent,
        ActionHistoryComponent,
        WatcherActionValueComponent
        ],
    entryComponents: [
        AlertDialog,
        MenuComponent,
        RecordComponent,
        StudentNameEditorComponent
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
