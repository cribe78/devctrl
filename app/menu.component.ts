import {MenuService} from "./menu.service";
import { Component, Inject } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';


@Component({
    moduleId: module.id,
    selector: 'devctrl-menu',
    template: `
<md-nav-list>
    <template ngFor let-item [ngForOf]="menu.menuItems()" [ngForTrackBy]="trackByName">
        <a md-list-item (click)="menu.go(item.route)">
            <a md-button>{{item.name}}</a>
            <span class="toggle-icon" [class.toggled]="item.isOpened">
                <md-icon md-font-set="material-icons" >expand_more</md-icon>
            </span>
        </a>
        <a md-list-item [hidden]="! item.isOpened"
                        *ngFor="let subitem of item.children" 
                        (click)="menu.go(subitem.route)">
            <span flex="5"></span>
            <p>{{subitem.name}}</p>
        </a>
        <md-divider></md-divider>
    </template>
</md-nav-list>
`
})
export class MenuComponent {

    constructor(public menu: MenuService, private route : ActivatedRoute) {
        console.log("MenuComponent created");
    }

    trackByName(index: number, state) {
        return state.name;
    }
}