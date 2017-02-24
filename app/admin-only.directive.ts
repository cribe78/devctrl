import { Directive,
    Input,
    TemplateRef,
    ViewContainerRef,
    Inject,
    DoCheck } from '@angular/core';
import {DataService} from "./data.service";

@Directive({ selector: '[devctrlAdminOnly]' })
export class AdminOnlyDirective implements DoCheck {
    private _hasView = false;
    private _inverted = false;

    constructor(
        private _template: TemplateRef<any>,
        private _viewContainer: ViewContainerRef,
        private dataService: DataService
    ) { }

    ngDoCheck() {
        let adminAuthorized = this.dataService.isAdminAuthorized();


        let test = this.dataService.isAdminAuthorized() != this._inverted;

        if (test && !this._hasView) {
            //console.log(`adminOnly: adminAuthorized is ${adminAuthorized}, creating view`);
            this._hasView = true;
            this._viewContainer.createEmbeddedView(this._template);
        } else if (!test && this._hasView) {
            //console.log(`adminOnly: adminAuthorized is ${adminAuthorized}, clearing view`);
            this._hasView = false;
            this._viewContainer.clear();
        }
        else {
            //console.log(`adminOnly: adminAuthorized is ${adminAuthorized}, doing nothing`);
        }
    }

    @Input() set invert(invertVal : any) {
        this._inverted = !! invertVal;
    }
}