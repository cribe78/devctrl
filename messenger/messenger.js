var express = require('express');
var app = express();
var fs = require('fs');
var net = require('net');
var merge = require('deepmerge');
var cp = require('child_process');
Tail = require('tail').Tail;


//var key = fs.readFileSync('/home/chris/devctrl.dwi.ufl.edu.self.key');
//var cert = fs.readFileSync('/etc/ssl/certs/devctrl_dwi_ufl_edu_cert.cer');

var http = require('http').Server(app);

//var https = require('https').createServer({
//    key: key,
//    cert: cert
//}, app);

var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.send('<h1>Hello World</h1>');
});

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('status-update', function(data) {
        console.log(data.message);
    });
});

http.listen(2878, function() {
    console.log('listening on *:2878');
});


var updateServer = net.createServer( function(sock) {
    console.log("daemon client connected on port " + sock.remotePort);

    sock.on('data', function(data) {
        console.log("update recieved: " + data);

        data = data.toString();

        var updates = {
            update: {}
        };

        // If we have more than one object, merge them
        var updateObj;
        while (data.indexOf("}{") > 0) {
            var idx = data.indexOf("}{") + 1;
            var objStr = data.substr(0, idx);
            updateObj = JSON.parse(objStr);
            updates = merge(updates, updateObj);

            data = data.substr(idx);
        }

        updateObj = JSON.parse(data);
        updates = merge(updates, updateObj);

        io.emit('control-data', updates);
    });
});

updateServer.listen(2879, '127.0.0.1');
console.log("TCP server started on port 2879");

var minute = 60 * 1000;

// Run a regular status check on the pcontrol-daemons
var pcontrolCheck = function() {
    console.log("calling pcontrol_check.php");
    cp.exec("php ../sub/pcontrol_check.php", function(error, stdout, stderr) {
        var dataObj = {};
        try {
            dataObj = JSON.parse(stdout);
        } catch (e) {}

        io.emit('control-data', dataObj);
    });
};

pcontrolCheck();
setInterval(pcontrolCheck, minute);


// Send out log updates
try {
    var tail = new Tail("/var/log/devctrl/devctrl.log");
    tail.on("line", function (data) {
        io.emit('log-data', data);
    });
} catch(e) {}