import { NgModule }      from '@angular/core';
import {
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdSelectModule,
    MdSliderModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    MdSidenavModule
} from '@angular/material';


@NgModule({
    imports: [
        MdButtonModule,
        MdCardModule,
        MdCheckboxModule,
        MdGridListModule,
        MdIconModule,
        MdInputModule,
        MdListModule,
        MdMenuModule,
        MdSelectModule,
        MdSliderModule,
        MdTabsModule,
        MdToolbarModule,
        MdTooltipModule,
        MdSidenavModule
    ],
    exports: [
        MdButtonModule,
        MdCardModule,
        MdCheckboxModule,
        MdGridListModule,
        MdIconModule,
        MdInputModule,
        MdListModule,
        MdMenuModule,
        MdSelectModule,
        MdSliderModule,
        MdTabsModule,
        MdToolbarModule,
        MdTooltipModule,
        MdSidenavModule
    ]
})
export class DCMaterialModule {}