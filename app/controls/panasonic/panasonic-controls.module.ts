import {MaterialModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AWHE130PresetControl} from "./awhe130-preset.control";
import {AWHE130PresetMapControl} from "./awhe130-preset-map.control";
import {PresetMapPictLControl} from "./preset-maps/preset-map-pict-l.control";
import {PresetMapPictRControl} from "./preset-maps/preset-map-pict-r.control";
import {PresetMapDefault} from "./preset-maps/preset-map-default.control";
import {PresetMapOrcStudents} from "./preset-maps/preset-map-orc-students.control";
import {PresetMapOrcInstructor} from "./preset-maps/preset-map-orc-instructor.control";



@NgModule({
    imports:      [
        MaterialModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        AWHE130PresetControl,
        AWHE130PresetMapControl,
        PresetMapDefault,
        PresetMapOrcInstructor,
        PresetMapOrcStudents,
        PresetMapPictLControl,
        PresetMapPictRControl
    ],
    exports: [
        AWHE130PresetControl,
        AWHE130PresetMapControl,
        PresetMapDefault,
        PresetMapOrcInstructor,
        PresetMapOrcStudents,
        PresetMapPictLControl,
        PresetMapPictRControl
    ]
})
export class PanasonicControlsModule {}
