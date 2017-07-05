import {MaterialModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {CommonModule, DecimalPipe} from "@angular/common";
import {CLQLFaderControl} from "./clql-fader.control";
import {CLQLFaderComboControl} from "./clql-fader-combo.control";




@NgModule({
    imports:      [
        MaterialModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        CLQLFaderControl,
        CLQLFaderComboControl
    ],
    exports: [
        CLQLFaderControl,
        CLQLFaderComboControl
    ],
    providers: [
        DecimalPipe
    ]
})
export class YamahaControlsModule {}
