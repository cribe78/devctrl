import {MaterialModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {DataService} from "../data.service";
import {BasicControlsModule} from "./basic/basic-controls.module";
import {ControlComponent} from "./control.component";
import {CommonModule} from "@angular/common";
import {F32ControlsModule} from "./f32/f32-controls.module";
import {PanasonicControlsModule} from "./panasonic/panasonic-controls.module";

@NgModule({
    imports:      [
        MaterialModule,
        FormsModule,
        BasicControlsModule,
        F32ControlsModule,
        PanasonicControlsModule,
        CommonModule
    ],
    declarations: [
        ControlComponent
    ],
    exports: [
        BasicControlsModule,
        F32ControlsModule,
        ControlComponent,
        PanasonicControlsModule
    ]

})
export class ControlsModule {}
