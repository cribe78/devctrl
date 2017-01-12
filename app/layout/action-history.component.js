"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var data_service_1 = require("../data.service");
var ActionHistoryComponent = (function () {
    function ActionHistoryComponent(ds) {
        this.ds = ds;
    }
    ActionHistoryComponent.prototype.ngOnInit = function () { };
    return ActionHistoryComponent;
}());
ActionHistoryComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'devctrl-action-history',
        template: "\n<div class=\"devctrl-card history-card\">\n    <md-toolbar color=\"primary\">\n        <span class=\"text-subhead\">Log</span>\n    </md-toolbar>\n    <md-list>\n        <md-list-item *ngFor=\"let action of ds.logs;\">\n            <p md-line class=\"message\">{{action.name}}</p>\n            <p md-line class=\"ts\">{{action.timestamp | date:'medium'}}</p>\n        </md-list-item>\n        <md-list-item *ngIf=\"ds.logs.length == 0\">\n            <p md-line>Action log is empty</p>\n        </md-list-item>\n    </md-list>  \n</div>\n    ",
        styles: ["\n\n"]
    }),
    __metadata("design:paramtypes", [data_service_1.DataService])
], ActionHistoryComponent);
exports.ActionHistoryComponent = ActionHistoryComponent;
//# sourceMappingURL=action-history.component.js.map