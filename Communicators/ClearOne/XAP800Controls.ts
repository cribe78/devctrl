import {IClearOneCommandTemplate, ClearOneCommand} from "./ClearOneCommand";
let inputChannels =  {
    "1 M" : "Input 1",
    "2 M" : "Input 2",
    "3 M" : "Input 3",
    "4 M" : "Input 4",
    "5 M" : "Input 5",
    "6 M" : "Input 6",
    "7 M" : "Input 7",
    "8 M" : "Input 8",
    "9 L" : "Input 9",
    "10 L" : "Input 10",
    "11 L" : "Input 11",
    "12 L" : "Input 12"
};

let outputChannels = {
    "1 O" : "Output 1",
    "2 O" : "Output 2",
    "3 O" : "Output 3",
    "4 O" : "Output 4",
    "5 O" : "Output 5",
    "6 O" : "Output 6",
    "7 O" : "Output 7",
    "8 O" : "Output 8",
    "9 O" : "Output 9",
    "10 O" : "Output 10",
    "11 O" : "Output 11",
    "12 O" : "Output 12",
};


let allChannels = {
    "1 M" : "Input 1",
    "2 M" : "Input 2",
    "3 M" : "Input 3",
    "4 M" : "Input 4",
    "5 M" : "Input 5",
    "6 M" : "Input 6",
    "7 M" : "Input 7",
    "8 M" : "Input 8",
    "9 L" : "Input 9",
    "10 L" : "Input 10",
    "11 L" : "Input 11",
    "12 L" : "Input 12",
    "1 O" : "Output 1",
    "2 O" : "Output 2",
    "3 O" : "Output 3",
    "4 O" : "Output 4",
    "5 O" : "Output 5",
    "6 O" : "Output 6",
    "7 O" : "Output 7",
    "8 O" : "Output 8",
    "9 O" : "Output 9",
    "10 O" : "Output 10",
    "11 O" : "Output 11",
    "12 O" : "Output 12",
};

export let commands : IClearOneCommandTemplate[] = [
    {
        cmdStr: "GAIN",
        ioList: allChannels,
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
        cmdStr: "LVL",
        ioList: allChannels,
        ctor: ClearOneCommand,
        control_type: "range",
        usertype: "level",
        updateTerminator: "A",
        templateConfig : {
            min: -60,
            max: 20
        }
    },

    {
        cmdStr: "MUTE",
        ioList: allChannels,
        ctor: ClearOneCommand,
        control_type: "boolean",
        usertype: "switch"
    },
];

