import {MaterialModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {F32MultibuttonControl} from "./f32-multibutton.control";


@NgModule({
    imports:      [
        MaterialModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        F32MultibuttonControl
    ],
    exports: [
        F32MultibuttonControl
    ]
})
export class F32ControlsModule {}
