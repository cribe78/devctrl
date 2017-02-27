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
var menu_service_1 = require("./menu.service");
var media_service_1 = require("./media.service");
var LayoutService = LayoutService_1 = (function () {
    function LayoutService(mds, mns) {
        this.mds = mds;
        this.mns = mns;
    }
    Object.defineProperty(LayoutService.prototype, "mobile", {
        get: function () {
            return this.mds.lt('md');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutService.prototype, "desktop", {
        get: function () {
            return !this.mobile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutService.prototype, "desktopWide", {
        get: function () {
            var testWidth = LayoutService_1.wide;
            if (this.mns.isSidenavOpen()) {
                testWidth += LayoutService_1.menuWidth;
            }
            return this.mds.widerThan(testWidth);
        },
        enumerable: true,
        configurable: true
    });
    LayoutService.prototype.resized = function ($event) {
        this.mds.resized($event);
        console.log("window resized");
    };
    return LayoutService;
}());
LayoutService.menuWidth = 270;
LayoutService.wide = 1300;
LayoutService = LayoutService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [media_service_1.MediaService,
        menu_service_1.MenuService])
], LayoutService);
exports.LayoutService = LayoutService;
var LayoutService_1;
//# sourceMappingURL=layout.service.js.map