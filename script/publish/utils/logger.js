"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
var chalk_1 = require("chalk");
var logger = {
    info: function (msg) { return console.log(msg); },
    success: function (msg) { return console.log((0, chalk_1.green)(msg)); },
    warn: function (msg) { return console.log((0, chalk_1.yellow)(msg)); },
    error: function (msg) { return console.log((0, chalk_1.red)(msg)); },
    // UI Elements for the CLI
    header: function (msg) { return console.log(chalk_1.cyan.bold("\n ".concat(msg, "\n"))); },
    step: function (msg) { return console.log(chalk_1.blue.bold(msg)); },
    divider: function () { return console.log((0, chalk_1.gray)('\n--------------------------------------------------')); },
};
exports.default = logger;
