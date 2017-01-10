import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';
import {DataService} from "../../data.service";

@Component({
    moduleId: module.id,
    selector: 'ctrl-awhe130-preset-map',
    template: `
<div class="devctrl-ctrl">
    <label class="text-menu devctrl-ctrl-label">{{cs.control.endpoint.name}} Presets</label>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 840 593" >
        <defs>
            <style>
            .cls-1 {
                fill: transparent;
            }
            </style>
        </defs>
        <svg:polygon class="cls-1" points="95.25,298 145,298 145,348 95,348" 
            width="50" height="50" onclick="triggerPreset(1)" />
        <image xlink:href="/app/controls/panasonic/PICT-PTZ-Left.svg" width="421" height="593"></image>
        
    </svg>
</div>
    `,
    styles: [`
.devctrl-ctrl {
    height: 490px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.devctrl-ctrl-label {
    align-self: flex-start;
}

`]
})
export class AWHE130PresetMapControl implements OnInit {
    constructor(private cs : ControlService,
                private ds : DataService) { }

    ngOnInit() { }

    triggerPreset(preset) {
        let msg = `Preset ${preset} selected!`;
        console.log(msg)
        this.ds.errorToast(msg);
    }
}