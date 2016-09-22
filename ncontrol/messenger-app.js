#!/usr/bin/env node
"use strict";

var messenger = require("./messenger");
var config = require("./config");


messenger.run(config);