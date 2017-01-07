import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {DataService} from "../data.service";
import {MenuService} from "../layout/menu.service";

@Component({
    selector: 'devctrl-config-data',
    template: `
<div fxLayout="row" fxLayoutAlign="center start" id="devctrl-content-canvas">
    <div fxFlex="none" fxFlex.gt-xs="600px" class="devctrl-card">
    <md-nav-list>
        <template ngFor let-schema [ngForOf]="schemaArray">
            <a md-list-item (click)="menu.go(['config', schema.name])">
                {{schema.label}}
                <span fxFlex></span>
                <md-icon>chevron_right</md-icon>
            </a>
            <md-divider></md-divider> 
        </template>
    </md-nav-list>
    </div>
</div>  
`,
    styles: [`
.md-list-item {
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
}
`]
})
export class ConfigDataComponent implements OnInit
{
    schema;
    schemaArray;

    constructor(private route : ActivatedRoute,
                private menu: MenuService,
                private dataService : DataService) {}

    ngOnInit() {
        this.schema = this.dataService.schema;
        this.schemaArray = Object.keys(this.schema).map((key) => {
            this.schema[key]['name'] = key;
            return this.schema[key];
        });
        this.menu.currentTopLevel = MenuService.TOPLEVEL_CONFIG;
        this.menu.pageTitle = "Data Tables";
        this.menu.toolbarSelect.enabled = false;
    }

    noActivatedChildren() {
        let val = this.route.children.length == 0;
        return val;
    }
}