"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var animations_1 = require("@angular/platform-browser/animations");
var app_component_1 = require("./layout/app.component");
var material_1 = require("@angular/material");
var http_1 = require("@angular/http");
require("hammerjs");
var menu_component_1 = require("./layout/menu.component");
var menu_service_1 = require("./layout/menu.service");
var toolbar_component_1 = require("./layout/toolbar.component");
var admin_only_directive_1 = require("./admin-only.directive");
var data_service_1 = require("./data.service");
var app_router_module_1 = require("./app-router.module");
var endpoints_component_1 = require("./endpoints/endpoints.component");
var endpoint_status_component_1 = require("./endpoints/endpoint-status.component");
var endpoint_component_1 = require("./endpoints/endpoint.component");
var config_component_1 = require("./config.component");
var config_data_component_1 = require("./data-editor/config-data.component");
var record_component_1 = require("./data-editor/record.component");
var fk_autocomplete_component_1 = require("./data-editor/fk-autocomplete.component");
var alert_dialog_component_1 = require("./alert-dialog.component");
var record_editor_service_1 = require("./data-editor/record-editor.service");
var table_component_1 = require("./data-editor/table.component");
var forms_1 = require("@angular/forms");
var controls_module_1 = require("./controls/controls.module");
var room_component_1 = require("./rooms/room.component");
var rooms_component_1 = require("./rooms/rooms.component");
var panel_component_1 = require("./rooms/panel.component");
var object_editor_component_1 = require("./data-editor/object-editor.component");
var media_service_1 = require("./layout/media.service");
var layout_service_1 = require("./layout/layout.service");
var action_history_component_1 = require("./layout/action-history.component");
var dc_material_module_1 = require("./dc-material.module");
var control_detail_component_1 = require("./controls/control-detail.component");
var watcher_action_value_component_1 = require("./data-editor/watcher-action-value.component");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            animations_1.BrowserAnimationsModule,
            dc_material_module_1.DCMaterialModule,
            material_1.MdSnackBarModule,
            material_1.MdDialogModule,
            http_1.HttpModule,
            app_router_module_1.AppRoutingModule,
            forms_1.FormsModule,
            controls_module_1.ControlsModule,
        ],
        declarations: [menu_component_1.MenuComponent,
            admin_only_directive_1.AdminOnlyDirective,
            alert_dialog_component_1.AlertDialog,
            app_component_1.AppComponent,
            config_component_1.ConfigComponent,
            config_data_component_1.ConfigDataComponent,
            control_detail_component_1.ControlDetailComponent,
            endpoint_component_1.EndpointComponent,
            endpoints_component_1.EndpointsComponent,
            endpoint_status_component_1.EndpointStatusComponent,
            fk_autocomplete_component_1.FkAutocompleteComponent,
            object_editor_component_1.ObjectEditorComponent,
            panel_component_1.PanelComponent,
            record_component_1.RecordComponent,
            room_component_1.RoomComponent,
            rooms_component_1.RoomsComponent,
            table_component_1.TableComponent,
            toolbar_component_1.ToolbarComponent,
            action_history_component_1.ActionHistoryComponent,
            watcher_action_value_component_1.WatcherActionValueComponent
        ],
        entryComponents: [
            alert_dialog_component_1.AlertDialog,
            menu_component_1.MenuComponent,
            record_component_1.RecordComponent
        ],
        providers: [
            data_service_1.DataService,
            menu_service_1.MenuService,
            record_editor_service_1.RecordEditorService,
            media_service_1.MediaService,
            layout_service_1.LayoutService
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map