import {MaterialModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ButtonControl} from "./button.control";
import {DefaultControl} from "./default.control";
import {SwitchControl} from "./switch.control";
import {SliderControl} from "./slider.control";
import {SelectControl} from "./select.control";
import {SelectReadonlyControl} from "./select-readonly.control";
import {ButtonSetControl} from "./button-set.control";
import {LevelControl} from "./level.control";
import {ImageControl} from "./image.control";
import {Slider2dControl} from "./slder2d.control";
import {HyperlinkControl} from "./hyperlink.control";
import {SwitchReadonlyControl} from "./switch-readonly.control";
import {ReadonlyControl} from "./readonly.control";

@NgModule({
    imports:      [
        MaterialModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        ButtonControl,
        ButtonSetControl,
        DefaultControl,
        HyperlinkControl,
        ImageControl,
        LevelControl,
        ReadonlyControl,
        SelectControl,
        SelectReadonlyControl,
        SliderControl,
        Slider2dControl,
        SwitchControl,
        SwitchReadonlyControl
    ],
    exports: [
        ButtonControl,
        ButtonSetControl,
        DefaultControl,
        HyperlinkControl,
        ImageControl,
        LevelControl,
        ReadonlyControl,
        SelectControl,
        SelectReadonlyControl,
        SliderControl,
        Slider2dControl,
        SwitchControl,
        SwitchReadonlyControl
    ]
})
export class BasicControlsModule {}
