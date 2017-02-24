import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-awhe130-preset',
    template: `
<div class="devctrl-ctrl">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <md-input-container>
        <input md-input #presetNum type="number" 
                min=0 max=99 
                placeholder="Preset Number">
    </md-input-container>     
    <button md-button  (click)="cs.setValue(presetNum.value)">Save</button>
    
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
    display: flex;
    flex-direction: row;
    align-items: center;
}
.devctrl-ctrl-label {
    flex: 1 1;
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