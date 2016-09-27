import {TCPCommand, ITCPCommandConfig} from "../TCPCommand";
import {Control} from "../../../shared/Control";
import {ControlUpdate, ControlUpdateData} from "../../../shared/ControlUpdate";

export interface IClearOneCommandConfig extends ITCPCommandConfig {
    channel: string;
    channelName: string;
    device: string;
    updateTerminator?: string;
}

export class ClearOneCommand extends TCPCommand {
    value: number;
    channel: string;
    channelName: string = '';
    device: string;
    updateTerminator: string = '';

    constructor(config: IClearOneCommandConfig) {
        super(config);

        if (config.channel) {
            this.channel = config.channel;
            this.cmdStr = config.cmdStr + " " + config.channel;
            this.channelName = config.channelName;
            this.name = config.cmdStr + " " + config.channelName;
        }

        if (config.updateTerminator) {
            this.updateTerminator = config.updateTerminator;
        }

        this.device = config.device;
    }

    matchesDeviceString(devStr: string) : boolean {
        let matchStr = this.deviceQueryString();
        let matchLen = matchStr.length;
        return devStr.substring(0, matchLen) == matchStr;
    }


    deviceQueryString() {
        return `${ this.device } ${ this.cmdStr }`;
    }

    deviceUpdateString(control: Control, update: ControlUpdateData) {
        return `${ this.device } ${ this.cmdStr } ${ update.value } ${ this.updateTerminator }`;
    }

    parseControlValue(control: Control, line: string) : any {
        let qStr = this.deviceQueryString();
        let val = line.slice(qStr.length);

        // String a trailing " A", indicating an absolute level
        if (val.substring(val.length - 2) == " A") {
            val = val.substring(0, val.length - 2);
        }

        let ret = parseInt(val);

        return ret;
    }
}