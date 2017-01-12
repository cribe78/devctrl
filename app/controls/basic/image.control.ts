import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-image',
    template: `
<div class="devctrl-ctrl">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <img [src]="source()" width="100%"/>
</div> 
    `
})
export class ImageControl implements OnInit {
    constructor(private cs : ControlService) { }

    ngOnInit() { }

    source() {
        if (this.cs.config("url")) {
            return this.cs.config("url");
        }

        let path = this.cs.config("path");
        let proto = this.cs.config("proto");
        proto = proto ? proto : "https://";

        if (proto == "http" || proto == "https") {
            proto = proto + "://";
        }

        let host = this.cs.config("host");
        host = host ? host : this.cs.control.endpoint.address;

        return proto + host + path;
    }
}