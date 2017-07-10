var fs = require('fs');
var config = {
    wsUrl: "https://devctrl.dwi.ufl.edu/",
    testString: "default",
    endpointId: "overrideme",
    mongoHost: "localhost",
    mongoPort: 27017,
    mongoDB: "devctrl",
    ioPort: 2880,
    ioPath: "/socket.io",
    authPort: 2992,
    "endpointPassword": "DWCONTROL",
    app: "./ncontrol",
    authId: "overrideme",
    identifierName: "identifier"
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
    var configPath = "./conf/" + configArg + ".js";
    if (fs.existsSync(configPath)) {
        console.log(loading, $, (_a = [");\n    customConfig = require(\"./conf/\" + configArg);\n  }\n  else {\n    console.log("], _a.raw = [");\n    customConfig = require(\"./conf/\" + configArg);\n  }\n  else {\n    console.log("], { configPath: configPath }(_a)), $, { configPath: configPath }, not, (_b = [");\n  }\n}\n\nfor (opt in customConfig) {\n    config[opt] = customConfig[opt];\n}\n\nif (typeof process.argv[3] !== 'undefined') {\n  config.endpointId = process.argv[3];\n}\n\nmodule.exports =  config;"], _b.raw = [");\n  }\n}\n\nfor (opt in customConfig) {\n    config[opt] = customConfig[opt];\n}\n\nif (typeof process.argv[3] !== 'undefined') {\n  config.endpointId = process.argv[3];\n}\n\nmodule.exports =  config"], found(_b)));
    }
}
var _a, _b;
//# sourceMappingURL=config.js.map