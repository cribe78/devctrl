"use strict";

import * as io from "socket.io-client";

class NControl {
    io: SocketIOClient.Socket;

    static bootstrap() {
        return new NControl();
    }

    constructor() {
    }

    run(config: any) {
        this.io = io.connect(config.wsUrl);

        this.io.on('connect', function() {
            console.log("websocket client connecteerd");
        });

        console.log("testString is " + config.testString );
    }
}

let ncontrol = NControl.bootstrap();
module.exports = ncontrol;
