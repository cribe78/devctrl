"use strict";
var ClearOneCommand_1 = require("./ClearOneCommand");
var AP400GateCommand_1 = require("./AP400GateCommand");
exports.chWchannels = {
    "1 I": "Mic 1",
    "2 I": "Mic 2",
    "3 I": "Mic 3",
    "4 I": "Mic 4",
    "A I": "Line In 1",
    "B I": "Line In 2",
    "C I": "Line In 3",
    "D I": "Line In 4",
    "A O": "Line Out 1",
    "B O": "Line Out 2",
    "C O": "Line Out 3",
    "D O": "Line Out 4"
};
exports.commands = [
    {
        cmdStr: "GAIN",
        ioList: exports.chWchannels,
        ctor: ClearOneCommand_1.ClearOneCommand,
        control_type: "range",
        usertype: "slider",
        updateTerminator: "A",
        templateConfig: {
            min: -20,
            max: 20
        }
    },
    {
        cmdStr: "GATE",
        ctor: AP400GateCommand_1.AP400GateCommand,
        control_type: "boolean",
        usertype: "switch",
        readonly: true
    },
    //   {
    //       cmdStr: "MTRX",
    //       ctor: ClearOneCommand,
    //       control_type: "boolean",
    //       usertype: "",
    //   },
    {
        cmdStr: "MUTE",
        ioList: exports.chWchannels,
        ctor: ClearOneCommand_1.ClearOneCommand,
        control_type: "boolean",
        usertype: "switch"
    },
    {
        cmdStr: "LVL",
        ioList: exports.chWchannels,
        ctor: ClearOneCommand_1.ClearOneCommand,
        control_type: "range",
        usertype: "level",
        readonly: true,
        templateConfig: {
            min: -60,
            max: 20
        }
    }
];
//# sourceMappingURL=AP400Controls.js.map