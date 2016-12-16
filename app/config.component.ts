import {Component, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
    selector: 'devctrl-config',
    template: `
<div *ngIf="noActivatedChildren()">
    <md-card>
        <md-card-content>
            <md-list>
                <a md-list-item (click)="router.navigate(['config','data'])">
                    Table Data
                    <span flex></span>
                    <md-icon md-font-set="material-icons" >chevron_right</md-icon>
                </a>
                <a md-list-item (click)="router.navigate(['config','log'])">
                    Logs
                    <span flex></span>
                    <md-icon md-font-set="material-icons" >chevron_right</md-icon>
                </a>
            </md-list>
        </md-card-content>
    </md-card>
</div>
<router-outlet></router-outlet>    
`
})
export class ConfigComponent {
    constructor(private route : ActivatedRoute, private router: Router) {}

    noActivatedChildren() {
        let val = this.route.children.length == 0;
        return val;
    }
}