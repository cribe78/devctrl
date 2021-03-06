/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'npm:': '/node_modules/',

        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            //shared: 'shared',
            // angular bundles
            '@angular/cdk' : 'npm:@angular/cdk/bundles/cdk.umd.js',
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/animations': 'npm:@angular/animations/bundles/animations.umd.js',
            '@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/material' : 'npm:@angular/material/bundles/material.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            // other libraries
            'rxjs':                      'npm:rxjs',
            'socket.io-client': 'npm:socket.io-client/dist/socket.io.js',
            'hammerjs': 'npm:hammerjs/hammer.js'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            '/': {
                main: './main.js',
                defaultExtension: 'js',
                meta: {
                    './*.component.js' : {
                        loader: 'systemjs-angular-loader.js'
                    },
                    './*.control.js' : {
                        loader: 'systemjs-angular-loader.js'
                    }
                }
            },
            rxjs: {
                defaultExtension: 'js'
            },
            //'/shared' : {
            //    defaultExtension: 'js'
            //}
        }
    });
})(this);
