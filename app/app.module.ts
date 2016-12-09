import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { MaterialModule } from '@angular/material';
import { HttpModule } from '@angular/http';

import { UpgradeModule } from '@angular/upgrade/static';
import {MenuComponent} from "./menu.component";
import {MenuService} from "./menu.service";
//import {ToolbarComponent} from "./toolbar.component";
import {AdminOnlyDirective} from "./admin-only.directive";
import {DataService} from "./data.service";


@NgModule({
    imports:      [
        BrowserModule,
        UpgradeModule,
        MaterialModule.forRoot(),
        HttpModule
    ],
    declarations: [ MenuComponent, AdminOnlyDirective ],
    entryComponents: [ MenuComponent ],
    providers:    [
        DataService,
        MenuService,
        {
            provide: '$state',
            useFactory: i => i.get('$state'),
            deps: ['$injector']
        },
        {
            provide: '$mdToast',
            useFactory: i => i.get('$mdToast'),
            deps: ['$injector']
        },
        {
            provide: '$mdDialog',
            useFactory: i => i.get('$mdDialog'),
            deps: ['$injector']
        },
    ],
    //bootstrap:    [ AppComponent ]
})
export class AppModule {
    ngDoBootstrap() {}
}
