import {MaterialModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ButtonControl} from "./button.control";
import {DefaultControl} from "./default.control";
import {SwitchControl} from "./switch.control";
import {SliderControl} from "./slider.control";
import {SelectControl} from "./select.control";

@NgModule({
    imports:      [
        MaterialModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        ButtonControl,
        DefaultControl,
        SelectControl,
        SliderControl,
        SwitchControl
    ],
    exports: [
        ButtonControl,
        DefaultControl,
        SelectControl,
        SliderControl,
        SwitchControl
    ]
})
export class BasicControlsModule {}
