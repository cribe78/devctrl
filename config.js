var fs = require('fs');

var config = {
  wsUrl : "https://devctrl.dwi.ufl.edu/",
  testString : "default",
  endpointId : "overrideme",
  mongoHost : "localhost",
  mongoPort : 27017,
  mongoDB : "devctrl",
  ioPort : 2880,
  ioPath: "/socket.io",
  authPort : 2992,
  "endpointPassword" : "DWCONTROL",
  app: "./ncontrol",
  authId: "overrideme",
  identifierName : "identifier"
};

var localConfig = {};
var localPath = "./config.local.js";

if (fs.existsSync(localPath)) {
  localConfig = require("./config.local");
}

for (var opt in localConfig) {
  config[opt] = localConfig[opt];
}

var customConfig = {};

if (typeof process.argv[2] !== 'undefined') {

  console.log("arg 2 is " + process.argv[2]);
  var configArg = process.argv[2];
  var configPath = "./config/" + configArg + ".js";

  if (fs.existsSync(configPath)) {
    customConfig = require("./config/" + configArg);
  }
}

for (opt in customConfig) {
    config[opt] = customConfig[opt];
}

if (typeof process.argv[3] !== 'undefined') {
  config.endpointId = process.argv[3];
}

module.exports =  config;