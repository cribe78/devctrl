import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { MaterialModule } from '@angular/material';

import { UpgradeModule } from '@angular/upgrade/static';
import {MenuComponent} from "./menu.component";
import {MenuService} from "./menu.service";
//import {ToolbarComponent} from "./toolbar.component";
import {AdminOnlyDirective} from "./admin-only.directive";


@NgModule({
    imports:      [
        BrowserModule,
        UpgradeModule,
        MaterialModule.forRoot()
    ],
    declarations: [ MenuComponent, AdminOnlyDirective ],
    entryComponents: [ MenuComponent ],
    providers:    [
        MenuService,
        {
            provide: 'DataService',
            useFactory: i => i.get('DataService'),
            deps: ['$injector']
        },
        {
            provide: '$state',
            useFactory: i => i.get('$state'),
            deps: ['$injector']
        }
    ],
    //bootstrap:    [ AppComponent ]
})
export class AppModule {
    ngDoBootstrap() {}
}
