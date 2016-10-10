var fs = require('fs');

var config = {
  "wsUrl" : "https://devctrl.dwi.ufl.edu/",
  "testString" : "default",
  "endpointId" : "57ee8aaaad74d31275995a75",
  "mongoHost" : "localhost",
  "mongoPort" : 27017,
  "mongoDB" : "devctrl-dev",
  "ioPort" : 2880,
  "authPort" : 2992,
  "updatePort" : 2881,
  "endpointPassword" : "DWCONTROL"
};

var customConfig = {};

if (typeof process.argv[2] !== 'undefined') {

  console.log("arg 2 is " + process.argv[2]);
  var configArg = process.argv[2];
  var configPath = "./config/" + configArg + ".js";

  var stats = fs.statSync(configPath);

  if (stats.isFile()) {
    customConfig = require("./config/" + configArg);
  }
}

for (var opt in customConfig) {
    config[opt] = customConfig[opt];
}

if (typeof process.argv[3] !== 'undefined') {
  config.endpointId = process.argv[3];
}

module.exports =  config;