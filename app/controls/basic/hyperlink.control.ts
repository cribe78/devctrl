import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-hyperlink',
    template: `
<div class="devctrl-ctrl devctrl-ctrl-flex-layout">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <a href="{{linkUrl()}}" target="_blank">{{linkText()}}</a>
</div>      
    `
})
export class HyperlinkControl implements OnInit {
    constructor(private cs : ControlService) { }

    ngOnInit() { }


    linkText() {
        let text = this.cs.config("linkText");

        if (text) {
            return text;
        }

        return this.linkUrl();
    }

    linkUrl() {
        let url = this.cs.config("url");

        if (url) {
            return url;
        }

        let relativeUrl = this.cs.config("relativeUrl");
        let proto = this.cs.config("linkProto");
        proto = proto ? proto : "https";

        let host = this.cs.control.endpoint.address;
        url = `${proto}://${host}${relativeUrl}`;

        return url;
    }

}