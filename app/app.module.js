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
var toolbar_component_1 = require("./ng1/toolbar.component");
var admin_only_directive_1 = require("./admin-only.directive");
var data_service_1 = require("./data.service");
var app_router_module_1 = require("./app-router.module");
var rooms_component_1 = require("./rooms.component");
var endpoints_component_1 = require("./endpoints.component");
var endpoint_status_component_1 = require("./endpoint-status.component");
var panel_component_1 = require("./ng1/panel.component");
var room_component_1 = require("./room.component");
var control_component_1 = require("./ng1/control.component");
var endpoint_component_1 = require("./endpoint.component");
var config_component_1 = require("./config.component");
var config_data_component_1 = require("./config-data.component");
var record_component_1 = require("./record.component");
var fk_autocomplete_component_1 = require("./ng1/fk-autocomplete.component");
var alert_dialog_component_1 = require("./alert-dialog.component");
var record_editor_service_1 = require("./record-editor.service");
var table_component_1 = require("./ng1/table.component");
var table_wrapper_component_1 = require("./table-wrapper.component");
var forms_1 = require("@angular/forms");
var object_editor_component_1 = require("./ng1/object-editor.component");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule.prototype.ngDoBootstrap = function () { };
    ;
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            material_1.MaterialModule.forRoot(),
            http_1.HttpModule,
            app_router_module_1.AppRoutingModule,
            forms_1.FormsModule,
            static_1.UpgradeModule
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
            record_component_1.RecordComponent,
            room_component_1.RoomComponent,
            rooms_component_1.RoomsComponent,
            table_wrapper_component_1.TableWrapperComponent,
            fk_autocomplete_component_1.FkAutocompleteComponentNg2,
            object_editor_component_1.ObjectEditorComponentNg2,
            panel_component_1.PanelComponentNg2,
            control_component_1.ControlComponentNg2,
            table_component_1.TableComponentNg2,
            toolbar_component_1.ToolbarComponentNg2,
        ],
        entryComponents: [
            app_component_1.AppComponent,
            alert_dialog_component_1.AlertDialog,
            menu_component_1.MenuComponent,
            record_component_1.RecordComponent
        ],
        providers: [
            data_service_1.DataService,
            menu_service_1.MenuService,
            record_editor_service_1.RecordEditorService
        ],
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map