import {TCPCommand} from "../TCPCommand";
import {ClearOneCommand} from "./ClearOneCommand";
import {AP400GateCommand} from "./AP400GateCommand";
import {IAP400CommandConfig} from "./AP400Communicator";


export let chWchannels = {
    "1 I" : "Mic 1",
    "2 I" : "Mic 2",
    "3 I" : "Mic 3",
    "4 I" : "Mic 4",
    "A I" : "Line In 1",
    "B I" : "Line In 2",
    "C I" : "Line In 3",
    "D I" : "Line In 4",
    "A O" : "Line Out 1",
    "B O" : "Line Out 2",
    "C O" : "Line Out 3",
    "D O" : "Line Out 4"
 };


export let commands : IAP400CommandConfig[] = [
    {
        cmdStr: "GAIN",
        ioList : chWchannels,
        ctor: ClearOneCommand,
        control_type: "range",
        usertype: "slider",
        updateTerminator: "A",
        templateConfig : {
            min: -20,
            max: 20
        }
    },
    {
        cmdStr: "GATE",
        ctor: AP400GateCommand,
        control_type: "boolean",
        usertype: "checkbox",
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
        ioList: chWchannels,
        ctor: ClearOneCommand,
        control_type: "boolean",
        usertype: "switch"
    },
    {
        cmdStr: "LVL",
        ioList: chWchannels,
        ctor: ClearOneCommand,
        control_type: "range",
        usertype: "meter",
        readonly: true
    }
];



