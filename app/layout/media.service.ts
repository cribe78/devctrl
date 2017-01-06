import {Injectable} from "@angular/core";

@Injectable()
export class MediaService {
    minSizes = {
        xs: "(min-width: 1px)",
        sm: "(min-width: 600px)",
        md: "(min-width: 960px)",
        lg: "(min-width: 1280px)",
        xl: "(min-width: 1920px)"
    };

    maxSizes = {
        xs: "(max-width: 599px)",
        sm: "(max-width: 959px)",
        md: "(max-width: 1279px)",
        lg: "(max-width: 1919px)",
        xl: "(max-width: 9999px)",
    };

    constructor() {};


    isSize(size: string) {
        if (this.minSizes[size] && this.maxSizes[size]) {
            return window.matchMedia(this.minSizes[size]).matches && window.matchMedia(this.maxSizes[size]).matches;
        }

        return false;
    }

    gt(size) {
        if (this.maxSizes[size]) {
            return ! window.matchMedia(this.maxSizes[size]).matches;
        }
    }

    lt(size) {
        if (this.minSizes[size]) {
            return ! window.matchMedia(this.minSizes[size]).matches;
        }
    }

    widerThan(px: number) {
        let test = `(min-width: ${px-1}px)`;
        return window.matchMedia(test).matches;
    }

    get xs() {
        return this.isSize('xs');
    }

    get sm() {
        return this.isSize('sm');
    }

    get md() {
        return this.isSize('md');
    }

    get lg() {
        return this.isSize('lg');
    }

    get xl() {
        return this.isSize('xl');
    }
}
