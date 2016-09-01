var express = require('express');
var app = express();
var fs = require('fs');
var net = require('net');
var merge = require('deepmerge');
var cp = require('child_process');
var mongo = require('mongodb');

Tail = require('tail').Tail;

var http = require('http').Server(app);

var io = require('socket.io')(http);

var config = {
    "mongoHost" : "localhost",
    "mongoPort" : 27017,
    "mongoDB" : "devctrl",
    "ioPort" : 2878,
    "updatePort" : 2879
};

var localConfig = require("./config.local.js");

for (var opt in localConfig) {
    config[opt] = localConfig[opt];
}


var mongodb = false;
var mongoConnStr = "mongodb://" + config.mongoHost + ":" + config.mongoPort
                    + "/" + config.mongoDB;

mongo.MongoClient.connect( mongoConnStr, function(err, db) {
    console.log("mongodb connected");
    mongodb = db;
});


app.get('/', function(req, res) {
    res.send('<h1>Hello World</h1>');
});

var msgr = {};
msgr.getData = function(request, fn) {
    console.log("data requested from " + request.table);
    var col = mongodb.collection(request.table);

    //console.log("id type" + typeof params._id);
    //if (typeof params._id == 'MongoId')

    var table = {};
    var tArr = col.find(request.params)
        .forEach(
            function(doc) {
                table[doc._id] = doc;
            },
            function() {
                var data = {
                    add : {}
                };
                data.add[request.table] = table;
                fn(data);
            }
        );
};


io.on('connection', function(socket) {
    var socketId = socket.id;
    var clientIp = socket.request.connection.remoteAddress;

    console.log('a user connected from ' + clientIp);

    socket.on('status-update', function(data) {
        console.log(data.message);
    });

    socket.on('get-data', msgr.getData);
});

http.listen(config.ioPort, function() {
    console.log('listening on *:' + config.ioPort);
});


var updateServer = net.createServer( function(sock) {
    console.log("daemon client connected from " + sock.remoteAddress + ":" + sock.remotePort);

    sock.on('data', function(data) {
        //console.log("update recieved: " + data);

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

updateServer.listen(config.updatePort, '127.0.0.1');
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