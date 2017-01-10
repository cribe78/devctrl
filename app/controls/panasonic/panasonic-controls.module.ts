import {MaterialModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AWHE130PresetControl} from "./awhe130-preset.control";
import {AWHE130PresetMapControl} from "./awhe130-preset-map.control";



@NgModule({
    imports:      [
        MaterialModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        AWHE130PresetControl,
        AWHE130PresetMapControl,
    ],
    exports: [
        AWHE130PresetControl,
        AWHE130PresetMapControl
    ]
})
export class PanasonicControlsModule {}
