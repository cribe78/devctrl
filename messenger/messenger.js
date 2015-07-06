var express = require('express');
var app = express();
var fs = require('fs');
var net = require('net');

var key = fs.readFileSync('/home/chris/devctrl.dwi.ufl.edu.self.key');
var cert = fs.readFileSync('/etc/ssl/certs/devctrl_dwi_ufl_edu_cert.cer');

var https = require('https').createServer({
    key: key,
    cert: cert
}, app);

var io = require('socket.io')(https);

app.get('/', function(req, res) {
    res.send('<h1>Hello World</h1>');
});

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('status-update', function(data) {
        console.log(data.message);
    });
});

https.listen(2878, function() {
    console.log('listening on *:2878');
});


var updateServer = net.createServer( function(sock) {
    console.log("daemon client connected on port " + sock.remotePort);

    sock.on('data', function(data) {
        console.log("update recieved: " + data);

        data = data.toString();
        // If we have more than one object, take only the last
        while (data.indexOf("}{") > 0) {
            var idx = data.indexOf("}{") + 1;
            data = data.substr(idx);
        }

        var ctrl = JSON.parse(data);

        if (typeof (ctrl.control_id) !== 'undefined') {
            var msg = {
                update : {
                    controls : {}
                }
            };

            msg.update.controls[ctrl.control_id] = ctrl;

            io.emit('control-data', msg);
        }
    });
});

updateServer.listen(2879, '127.0.0.1');
console.log("TCP server started on port 2879");