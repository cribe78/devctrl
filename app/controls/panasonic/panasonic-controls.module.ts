import {MaterialModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AWHE130PresetControl} from "./awhe130-preset.control";



@NgModule({
    imports:      [
        MaterialModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        AWHE130PresetControl
    ],
    exports: [
        AWHE130PresetControl
    ]
})
export class PanasonicControlsModule {}
