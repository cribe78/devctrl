import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-awhe130-view',
    template: `
<div class="devctrl-ctrl">
    <label class="text-menu devctrl-ctrl-label">{{cs.control.endpoint.name}} View</label>
    <img [src]="previewSource()" width="640" height="360" />
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
img {
   
}
`
    ]
})
export class AWHE130ViewControl implements OnInit {
    constructor(private cs : ControlService) { }

    ngOnInit() { }

    previewSource() {
        return `http://${this.cs.control.endpoint.address}/${this.cs.config('liveViewPath')}`;
    }
}