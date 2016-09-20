import {TCPCommand, ITCPCommandConfig} from "../TCPCommand";

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
        return devStr.substring(matchLen) == matchStr;
    }


    deviceQueryString() {
        return `${ this.device } ${ this.cmdStr }`;
    }


    deviceUpdateString(value: any) {
        return `${ this.cmdStr } ${ value } ${ this.updateTerminator }`;
    }


    deviceStringToValue(devStr: string) {
        return 10;
    }

}