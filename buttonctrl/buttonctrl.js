var gpio = require('rpi-gpio');
var socket = require('socket.io-client')('https://devctrl.dwi.ufl.edu/');
var SerialPort = require('serialport');


var dxpControl = 244;
var serialOut = true;
var gpioOut = false;
var port;


if (serialOut) {
    port = new SerialPort("/dev/ttyACM0", {
        baudRate: 9600
    });
}


var pinMap = [7, 11, 13, 15];

var valueMap = {
    '5' : 0,
    '2' : 1,
    '3' : 2,
    '4' : 3
};


//for (var pin in pinMap) {
//    if (pinMap.hasOwnProperty(pin)) {
//        gpio.setup(pinMap[pin], gpio.DIR_OUT, pinSetup);
//    }
//}

function pinSetup(err) {
    if (err) {
        console.log("on error at");
        console.log(err.stack.split("\n"));
        throw err;
    }
}

function setPinOn(channel) {
    var onVal = 1;
    var offVal = 0;

    if (gpioOut) {
        for (var ch in valueMap) {
            if (valueMap.hasOwnProperty(ch)) {
                if (ch == channel) {
                    gpio.write(pinMap[valueMap[ch]], onVal);
                }
                else {
                    gpio.write(pinMap[valueMap[ch]], offVal);
                }
            }
        }
    }

    if (serialOut) {
        if (valueMap.hasOwnProperty(channel)) {
            var outCh = valueMap[channel];
            var outVal = 65 + (1 << outCh);
            var outChar = String.fromCharCode(outVal);
            port.write(outChar);
            console.log("serial out write: " + outChar);
        }
        else {
            port.write('A'); // All LEDs off
        }
    }
}

socket.on('connect', function() {
   console.log("websocket client connected");
});

socket.on('control-data', function(data) {
    //console.log("control data received");

    if (data.hasOwnProperty('update')
        && data.update.hasOwnProperty('controls')
        && typeof(data.update.controls[dxpControl]) !== 'undefined' ) {

        var control = data.update.controls[dxpControl];
        console.log("control update: " + dxpControl + " = " + control.value );

        setPinOn(control.value);
    }
});