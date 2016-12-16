import {MaterialModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {DataService} from "../data.service";
import {BasicControlsModule} from "./basic/basic-controls.module";
import {ControlComponent} from "./control.component";
import {CommonModule} from "@angular/common";

@NgModule({
    imports:      [
        MaterialModule,
        FormsModule,
        BasicControlsModule,
        CommonModule
    ],
    declarations: [
        ControlComponent
    ],
    exports: [
        BasicControlsModule,
        ControlComponent
    ]

})
export class ControlsModule {}
