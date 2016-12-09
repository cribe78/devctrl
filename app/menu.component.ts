import {MenuService} from "./menu.service";
import { Component, Inject } from '@angular/core';
declare var angular: angular.IAngularStatic;

@Component({
    moduleId: module.id,
    selector: 'devctrl-menu',
    template: `
<md-nav-list>
    <template ngFor let-item [ngForOf]="menuService.menuItems()" [ngForTrackBy]="trackByName">
        <a md-list-item href="#" (click)="go(item)">
            <a md-button>{{item.title}}</a>
            <span class="toggle-icon" [class.toggled]="item.isOpened">
                <md-icon md-font-set="material-icons" >expand_more</md-icon>
            </span>
        </a>
        <a md-list-item href="#" 
                        [hidden]="! item.isOpened"
                        *ngFor="let subitem of item.substates" 
                        (click)="go(subitem)">
            <span flex="5"></span>
            <p>{{subitem.title}}</p>
        </a>
        <md-divider></md-divider>
    </template>
</md-nav-list>
`
})
export class MenuComponent {
    $state;
    menuService;
    //static $inject = ['MenuService', '$state'];
    constructor(menuService: MenuService, @Inject('$state') $state) {
        this.menuService = menuService;
        this.$state = $state;
        console.log("MenuComponent created");
    }

    go(state) {
        if (angular.isString(state)) {
            this.$state.go(state);
        }
        else {
            this.$state.go(state.name, state.params);
        }
    }

    trackByName(index: number, state) {
        return state.name;
    }
}