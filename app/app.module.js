"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var app_component_1 = require("./app.component");
var material_1 = require("@angular/material");
var http_1 = require("@angular/http");
require("hammerjs");
var static_1 = require("@angular/upgrade/static");
var menu_component_1 = require("./menu.component");
var menu_service_1 = require("./menu.service");
var toolbar_component_1 = require("./toolbar.component");
var admin_only_directive_1 = require("./admin-only.directive");
var data_service_1 = require("./data.service");
var app_router_module_1 = require("./app-router.module");
var endpoints_component_1 = require("./endpoints.component");
var endpoint_status_component_1 = require("./endpoint-status.component");
var endpoint_component_1 = require("./endpoint.component");
var config_component_1 = require("./config.component");
var config_data_component_1 = require("./config-data.component");
var record_component_1 = require("./data-editor/record.component");
var fk_autocomplete_component_1 = require("./fk-autocomplete.component");
var alert_dialog_component_1 = require("./alert-dialog.component");
var record_editor_service_1 = require("./data-editor/record-editor.service");
var table_component_1 = require("./table.component");
var table_wrapper_component_1 = require("./table-wrapper.component");
var forms_1 = require("@angular/forms");
//import {ObjectEditorComponentNg2} from "./ng1/object-editor.component";
var controls_module_1 = require("./controls/controls.module");
var room_component_1 = require("./rooms/room.component");
var rooms_component_1 = require("./rooms/rooms.component");
var panel_component_1 = require("./rooms/panel.component");
var object_editor_component_1 = require("./data-editor/object-editor.component");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            material_1.MaterialModule.forRoot(),
            material_1.MdSnackBarModule,
            material_1.MdDialogModule.forRoot(),
            http_1.HttpModule,
            app_router_module_1.AppRoutingModule,
            forms_1.FormsModule,
            static_1.UpgradeModule,
            controls_module_1.ControlsModule,
        ],
        declarations: [menu_component_1.MenuComponent,
            admin_only_directive_1.AdminOnlyDirective,
            alert_dialog_component_1.AlertDialog,
            app_component_1.AppComponent,
            config_component_1.ConfigComponent,
            config_data_component_1.ConfigDataComponent,
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
            table_wrapper_component_1.TableWrapperComponent,
            toolbar_component_1.ToolbarComponent
        ],
        entryComponents: [
            alert_dialog_component_1.AlertDialog,
            menu_component_1.MenuComponent,
            record_component_1.RecordComponent
        ],
        providers: [
            data_service_1.DataService,
            menu_service_1.MenuService,
            record_editor_service_1.RecordEditorService
        ],
        bootstrap: [app_component_1.AppComponent]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map