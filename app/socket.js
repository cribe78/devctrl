"use strict";
/*
 * @license
 * angular-socket-io v0.7.0
 * (c) 2014 Brian Ford http://briantford.com
 * License: MIT
 */
const io = require("socket.io-client");
class SocketService {
    constructor($rootScope, $timeout) {
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.defaultPrefix = 'socket:';
    }
    init(options) {
        options = options || {};
        this.socket = options.ioSocket || io.connect();
        this.prefix = options.prefix === undefined ? this.defaultPrefix : options.prefix;
        this.defaultScope = options.scope || this.$rootScope;
    }
    addListener(eventName, callback) {
        this.socket.on(eventName, callback.__ng = this.asyncAngularify(this.socket, callback));
    }
    on(eventName, callback) {
        this.addListener(eventName, callback);
    }
    once(eventName, callback) {
        this.addOnceListener(eventName, callback);
    }
    addOnceListener(eventName, callback) {
        this.socket.once(eventName, callback.__ng = this.asyncAngularify(this.socket, callback));
    }
    asyncAngularify(socket, callback) {
        let self = this;
        return callback ? function () {
            var args = arguments;
            self.$timeout(function () {
                callback.apply(socket, args);
            }, 0);
        } : angular.noop;
    }
    emit(eventName, data, callback) {
        var lastIndex = arguments.length - 1;
        callback = arguments[lastIndex];
        if (typeof callback == 'function') {
            callback = this.asyncAngularify(this.socket, callback);
            arguments[lastIndex] = callback;
        }
        return this.socket.emit.apply(this.socket, arguments);
    }
    removeListener(ev, fn) {
        if (fn && fn.__ng) {
            arguments[1] = fn.__ng;
        }
        return this.socket.removeListener.apply(this.socket, arguments);
    }
    removeAllListeners() {
        return this.socket.removeAllListeners.apply(this.socket, arguments);
    }
    disconnect() {
        return this.socket.disconnect();
    }
    connect() {
        return this.socket.connect();
    }
    // when socket.on('someEvent', fn (data) { ... }),
    // call scope.$broadcast('someEvent', data)
    forward(events, scope) {
        if (events instanceof Array === false) {
            events = [events];
        }
        if (!scope) {
            scope = this.defaultScope;
        }
        let self = this;
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
    }
}
SocketService.$inject = ['$rootScope', '$timeout'];
exports.SocketService = SocketService;
angular.module('btford.socket-io', []).
    service('socket', SocketService);
//# sourceMappingURL=socket.js.map