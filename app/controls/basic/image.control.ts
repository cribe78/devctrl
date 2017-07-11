import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-image',
    template: `
<div class="devctrl-ctrl">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <img [src]="source()" width="100%" (error)="imgError($event)"/>
</div> 
    `,
    //language=CSS
    styles: [`        
    `]
})
export class ImageControl implements OnInit {
    loadingError = false;

    constructor(private cs : ControlService) { }

    ngOnInit() { }

    imgError($event) {
        this.loadingError = true;
    }

    source() {
        if (this.loadingError) {
            return "/images/loading-error.svg";
        }

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