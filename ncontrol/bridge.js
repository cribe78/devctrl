var Bridge = (function () {
    function Bridge() {
    }
    Bridge.prototype.initIo = function () {
        this.io.on('connect', function () {
            console.log("websocket client connecteerd");
        });
    };
    Bridge.bootstrap = function () {
        return new Bridge();
    };
    Bridge.prototype.config = function (io) {
        this.io = io;
        this.initIo();
    };
    return Bridge;
}());
var bridge = Bridge.bootstrap();
module.exports = bridge;
//# sourceMappingURL=bridge.js.map