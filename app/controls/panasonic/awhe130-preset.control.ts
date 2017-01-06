import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-awhe130-preset',
    template: `
<div class="devctrl-ctrl">
    <label class="text-menu devctrl-ctrl-label">{{cs.control.endpoint.name}} Presets</label>
    <div class="button-row">
        <button md-button  (click)="cs.setValue(-1)">Home</button>
        <button md-button  (click)="cs.setValue(0)">Preset 1</button>
        <button md-button  (click)="cs.setValue(1)">Preset 2</button>
        <button md-button  (click)="cs.setValue(2)">Preset 3</button>
        <button md-button  (click)="cs.setValue(3)">Preset 4</button>
    </div>
    <img [src]="previewSource()" width="640" height="360" />
    <div class="button-row">
        <button md-button  (click)="cs.setValue(4)">Preset 5</button>
        <button md-button  (click)="cs.setValue(5)">Preset 6</button>
        <button md-button  (click)="cs.setValue(6)">Preset 7</button>
        <button md-button  (click)="cs.setValue(7)">Preset 8</button>
        <button md-button  (click)="cs.setValue(8)">Preset 9</button>
    </div>
</div>    
    `,
    styles: [`
.button-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
}
.devctrl-ctrl {
    height: 490px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.devctrl-ctrl-label {
    align-self: flex-start;
}
img {
   
}
`
    ]
})
export class AWHE130PresetControl implements OnInit {
    constructor(private cs : ControlService) { }

    ngOnInit() { }

    previewSource() {
        return `http://${this.cs.control.endpoint.address}/${this.cs.config('liveViewPath')}`;
    }
}