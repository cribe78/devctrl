#!/usr/bin/env node
"use strict";

var config = require("./config");
var app = require(config.app);

app.run(config);