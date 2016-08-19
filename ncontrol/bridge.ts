class Bridge {
    io: any;

    initIo() {
        this.io.on('connect', function() {
            console.log("websocket client connecteerd");
        });
    }

    static bootstrap() {
        return new Bridge();
    }

    constructor() {
    }

    config(io) {
        this.io = io;
        this.initIo();
    }
}

let bridge = Bridge.bootstrap();
module.exports = bridge;