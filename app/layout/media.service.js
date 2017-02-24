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
var MediaService = (function () {
    function MediaService() {
        this.minSizes = {
            xs: "(min-width: 1px)",
            sm: "(min-width: 600px)",
            md: "(min-width: 960px)",
            lg: "(min-width: 1280px)",
            xl: "(min-width: 1920px)"
        };
        this.maxSizes = {
            xs: "(max-width: 599px)",
            sm: "(max-width: 959px)",
            md: "(max-width: 1279px)",
            lg: "(max-width: 1919px)",
            xl: "(max-width: 9999px)",
        };
    }
    ;
    MediaService.prototype.isSize = function (size) {
        if (this.minSizes[size] && this.maxSizes[size]) {
            return window.matchMedia(this.minSizes[size]).matches && window.matchMedia(this.maxSizes[size]).matches;
        }
        return false;
    };
    MediaService.prototype.gt = function (size) {
        if (this.maxSizes[size]) {
            return !window.matchMedia(this.maxSizes[size]).matches;
        }
    };
    MediaService.prototype.lt = function (size) {
        if (this.minSizes[size]) {
            return !window.matchMedia(this.minSizes[size]).matches;
        }
    };
    MediaService.prototype.resized = function ($event) {
        // Called on the window.resize event
    };
    MediaService.prototype.widerThan = function (px) {
        var test = "(min-width: " + (px - 1) + "px)";
        return window.matchMedia(test).matches;
    };
    Object.defineProperty(MediaService.prototype, "xs", {
        get: function () {
            return this.isSize('xs');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaService.prototype, "sm", {
        get: function () {
            return this.isSize('sm');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaService.prototype, "md", {
        get: function () {
            return this.isSize('md');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaService.prototype, "lg", {
        get: function () {
            return this.isSize('lg');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaService.prototype, "xl", {
        get: function () {
            return this.isSize('xl');
        },
        enumerable: true,
        configurable: true
    });
    return MediaService;
}());
MediaService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], MediaService);
exports.MediaService = MediaService;
//# sourceMappingURL=media.service.js.map