#!/usr/bin/env node
"use strict";

var io = require("socket.io-client")("https://devctrl.dwi.ufl.edu/");
var bridge = require("./bridge");

bridge.config(io);
