#!/usr/bin/env node
"use strict";

var watcher = require("./watcher");
var config = require("./config");

watcher.run(config);