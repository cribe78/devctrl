import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {DataService} from "../data.service";
import {MenuService} from "../layout/menu.service";

@Component({
    selector: 'devctrl-config-data',
    template: `
<div id="devctrl-content-canvas">
    <div class="devctrl-card">
    <md-nav-list>
        <ng-template ngFor let-schema [ngForOf]="schemaArray">
            <a md-list-item (click)="menu.go(['config', schema.name])">
                {{schema.label}}
                <span class="devctrl-spacer"></span>
                <md-icon>chevron_right</md-icon>
            </a>
            <md-divider></md-divider> 
        </ng-template>
    </md-nav-list>
    </div>
</div>  
`,
    //language=CSS
    styles: [`
        .devctrl-card {
            max-width: 600px;
            flex: 1 1;
        }
        .md-list-item {
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
        }
`]
})
export class ConfigDataComponent implements OnInit
{
    schemaArray;

    constructor(private route : ActivatedRoute,
                private menu: MenuService,
                private dataService : DataService) {}

    ngOnInit() {
        this.schemaArray = Object.keys(this.dataService.schema).map( (tableName) => {
            return this.dataService.schema[tableName];
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