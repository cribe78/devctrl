var net = require('net');
/*
 * Create two servers.  An input server receives data from clients.  An output server sends data
 * to connected clients
 */


var outputSocket;

var outputServer = net.createServer( function(sock) {
    outputSocket = sock;
});

var inputServer = net.createServer( function(sock) {
    sock.on('data', function(data) {
        console.log("writing data " + data.toString());
        if (typeof outputSocket == 'object') {
            outputSocket.write(data.toString());
        }
        else {
            var osType = typeof outputSocket;
            console.log("outputSocket type is " + osType);
        }
    });
});

outputServer.listen(28844, '127.0.0.1');
inputServer.listen(28804, '127.0.0.1');