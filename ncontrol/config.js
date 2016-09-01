var fs = require('fs');

var config = {
  "wsUrl" : "https://devctrl.dwi.ufl.edu/",
  "testString" : "default",
  "endpointId" : "57c5d82af88baca41c8b4868"
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