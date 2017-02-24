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
    Object.defineProperty(ActionHistoryComponent.prototype, "closed", {
        get: function () {
            return !this._open;
        },
        enumerable: true,
        configurable: true
    });
    ActionHistoryComponent.prototype.toggle = function () {
        this._open = !this._open;
    };
    return ActionHistoryComponent;
}());
ActionHistoryComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'devctrl-action-history',
        template: "\n<div class=\"spacer\" [class.closed]=\"closed\">&nbsp;</div>\n<div class=\"devctrl-card history-card\" [class.closed]=\"closed\">\n    <md-toolbar color=\"primary\">\n        <span class=\"text-subhead\">Log</span>\n        <button md-icon-button (click)=\"toggle()\">\n            <md-icon class=\"expand-icon\">expand_more</md-icon>\n        </button>\n    </md-toolbar>\n    <md-list class=\"log-list\">\n        <md-list-item *ngFor=\"let action of ds.logs;\">\n            <p md-line class=\"message\">{{action.name}}</p>\n            <p md-line class=\"ts\">{{action.timestamp | date:'medium'}}</p>\n        </md-list-item>\n        <md-list-item *ngIf=\"ds.logs.length == 0\">\n            <p md-line>Action log is empty</p>\n        </md-list-item>\n    </md-list>  \n</div>\n    ",
        styles: ["\n    \n.spacer.closed {\n    flex: 1 1;\n}\n    \n.history-card {\n    width: 600px; \n}\n\n.history-card.closed {\n    flex: 0 0;\n    width: 90px;\n}\n\n:host {\n    max-width: 700px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end;\n}\n\n.expand-icon {\n    transform: rotate(270deg);\n}\n\n.closed .expand-icon {\n    transform: rotate(90deg);\n}\n\n\n.history-card.closed .log-list {\n    visibility: hidden;\n    height: 0px;\n}\n\n"]
    }),
    __metadata("design:paramtypes", [data_service_1.DataService])
], ActionHistoryComponent);
exports.ActionHistoryComponent = ActionHistoryComponent;
//# sourceMappingURL=action-history.component.js.map