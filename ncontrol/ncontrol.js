"use strict";
var io = require("socket.io-client");
var NControl = (function () {
    function NControl() {
    }
    NControl.bootstrap = function () {
        return new NControl();
    };
    NControl.prototype.run = function (config) {
        this.io = io.connect(config.wsUrl);
        this.io.on('connect', function () {
            console.log("websocket client connecteerd");
        });
        console.log("testString is " + config.testString);
    };
    return NControl;
}());
var ncontrol = NControl.bootstrap();
module.exports = ncontrol;
//# sourceMappingURL=ncontrol.js.map