#!/usr/bin/env node
"use strict";

var auth = require("./auth");
var config = require("./config");


auth.run(config);