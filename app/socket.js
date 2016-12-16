"use strict";
/*
 * @license
 * angular-socket-io v0.7.0
 * (c) 2014 Brian Ford http://briantford.com
 * License: MIT
 */
var io = require("socket.io-client");
var SocketService = (function () {
    function SocketService($rootScope, $timeout) {
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.defaultPrefix = 'socket:';
    }
    SocketService.prototype.init = function (options) {
        options = options || {};
        this.socket = options.ioSocket || io.connect();
        this.prefix = options.prefix === undefined ? this.defaultPrefix : options.prefix;
        this.defaultScope = options.scope || this.$rootScope;
    };
    SocketService.prototype.addListener = function (eventName, callback) {
        this.socket.on(eventName, callback.__ng = this.asyncAngularify(this.socket, callback));
    };
    SocketService.prototype.on = function (eventName, callback) {
        this.addListener(eventName, callback);
    };
    SocketService.prototype.once = function (eventName, callback) {
        this.addOnceListener(eventName, callback);
    };
    SocketService.prototype.addOnceListener = function (eventName, callback) {
        this.socket.once(eventName, callback.__ng = this.asyncAngularify(this.socket, callback));
    };
    SocketService.prototype.asyncAngularify = function (socket, callback) {
        var self = this;
        return callback ? function () {
            var args = arguments;
            self.$timeout(function () {
                callback.apply(socket, args);
            }, 0);
        } : angular.noop;
    };
    SocketService.prototype.emit = function (eventName, data, callback) {
        var lastIndex = arguments.length - 1;
        callback = arguments[lastIndex];
        if (typeof callback == 'function') {
            callback = this.asyncAngularify(this.socket, callback);
            arguments[lastIndex] = callback;
        }
        return this.socket.emit.apply(this.socket, arguments);
    };
    SocketService.prototype.removeListener = function (ev, fn) {
        if (fn && fn.__ng) {
            arguments[1] = fn.__ng;
        }
        return this.socket.removeListener.apply(this.socket, arguments);
    };
    SocketService.prototype.removeAllListeners = function () {
        return this.socket.removeAllListeners.apply(this.socket, arguments);
    };
    SocketService.prototype.disconnect = function () {
        return this.socket.disconnect();
    };
    SocketService.prototype.connect = function () {
        return this.socket.connect();
    };
    // when socket.on('someEvent', fn (data) { ... }),
    // call scope.$broadcast('someEvent', data)
    SocketService.prototype.forward = function (events, scope) {
        if (events instanceof Array === false) {
            events = [events];
        }
        if (!scope) {
            scope = this.defaultScope;
        }
        var self = this;
        events.forEach(function (eventName) {
            var prefixedEvent = self.prefix + eventName;
            var forwardBroadcast = self.asyncAngularify(self.socket, function () {
                Array.prototype.unshift.call(arguments, prefixedEvent);
                scope.$broadcast.apply(scope, arguments);
            });
            scope.$on('$destroy', function () {
                self.socket.removeListener(eventName, forwardBroadcast);
            });
            self.socket.on(eventName, forwardBroadcast);
        });
    };
    return SocketService;
}());
SocketService.$inject = ['$rootScope', '$timeout'];
exports.SocketService = SocketService;
angular.module('btford.socket-io', []).
    service('socket', SocketService);
//# sourceMappingURL=socket.js.map