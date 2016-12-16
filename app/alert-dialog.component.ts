import {Component, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { MdDialogRef } from '@angular/material';

@Component({
    selector: 'devctrl-alert-dialog',
    template: `
<div>
    <label>{{title}}</label>
    <div>
        {{content}}
    </div>
    <button md-button (click)="dialogRef.close()">{{ok}}</button>
<div>
`
})
export class AlertDialog
{
    title;
    content;
    ok;

    constructor(public dialogRef: MdDialogRef<AlertDialog>) {}


}