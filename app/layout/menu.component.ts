import {MenuService} from "./menu.service";
import { Component, Inject } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';


@Component({
    moduleId: module.id,
    selector: 'devctrl-menu',
    template: `
<md-nav-list>
    <ng-template ngFor let-item [ngForOf]="menu.menuItems()" [ngForTrackBy]="trackByName">
        <md-list-item>
            <a md-line (click)="menu.go(item.route)">{{item.name}}</a>
            <button md-icon-button class="toggle-icon" 
                    [class.toggled]="item.isOpened" 
                    (click)="menu.toggleTopLevel($event, item)">
                <md-icon md-font-set="material-icons" >expand_more</md-icon>
            </button>
        </md-list-item>
        <a md-list-item [hidden]="! item.isOpened"
                        *ngFor="let subitem of item.children" 
                        (click)="menu.go(subitem.route)">
            <span flex="5"></span>
            <p>{{subitem.name}}</p>
        </a>
        <md-divider></md-divider>
    </ng-template>
</md-nav-list>
`,
    styles: [`
button.toggle-icon {
    display: block;
    margin-left: auto;
    vertical-align: middle;
    transform: rotate(180deg);
    transition: transform 0.3s ease-in-out;
}

button.toggle-icon.toggled {
    transform: rotate(0deg);
}
`]
})
export class MenuComponent {

    constructor(public menu: MenuService, private route : ActivatedRoute) {
        console.log("MenuComponent created");
    }

    trackByName(index: number, state) {
        return state.name;
    }
}