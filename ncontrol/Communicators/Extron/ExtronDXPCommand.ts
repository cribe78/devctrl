import {TCPCommand, ITCPCommandConfig} from "../TCPCommand";
import {Control} from "../../../shared/Control";
import {ControlUpdateData} from "../../../shared/ControlUpdate";


export interface IExtronDXPCommandConfig extends ITCPCommandConfig {
    dxpCmdType: string;
    channelNum?: string;
}


export class ExtronDXPCommand extends TCPCommand {
    dxpCmdType: string;
    channelNum: string;

    static tieResponseRE = /^Out(\d) In(\d) (Aud|Vid|All)/;
    static muteResponseRE = /^(Vmt|Amt)(\d)\*(0|1)/;
    static statusResponseRE = /^([\d.]+) ([\d.]+) \+([\d.]+) (\d+)/;

    constructor(config: IExtronDXPCommandConfig) {
        super(config);

        this.dxpCmdType = config.dxpCmdType;
        this.channelNum = config.channelNum;


    }

    deviceQueryString() {
        switch(this.dxpCmdType) {
            case 'tie-video' :
                return this.channelNum + '%';
            case 'tie-audio' :
                return this.channelNum + '$';
            case 'mute-audio':
                return this.channelNum + 'Z';
            case 'mute-video':
                return this.channelNum + 'B';
            case 'status':
                return 'S';
            default:
                return '';
        }
    }

    deviceUpdateString(control: Control, update: ControlUpdateData) {
        switch(this.dxpCmdType) {
            case 'tie-video':
                return `${update.value}*${this.channelNum}%`;
            case 'tie-audio' :
                return `${update.value}*${this.channelNum}%`;
            case 'mute-audio':
                return `${this.channelNum}*${update.value}Z`;
            case 'mute-video':
                return `${this.channelNum}*${update.value}B`;
            default:
                return '';
        }

    }

    matchesDeviceString(str: string) : boolean {
        switch(this.dxpCmdType) {
            case 'tie-video':
                return (str.search('Out' + this.channelNum + ' In\d Vid') != -1);
            case 'tie-audio':
                return (str.search('Out' + this.channelNum + ' In\d Aud') != -1);
            case 'mute-audio':
                return (str.search('Amt' + this.channelNum + '\*\d') != -1);
            case 'mute-video':
                return (str.search('Vmt' + this.channelNum + '\*\d') != -1);
        }

        return false;
    }

    parseControlValue(control: Control, line: string) : any {
        let ret : any = 0;
        let matches;
        let retstr;

        switch(this.dxpCmdType) {
            case 'tie-video':
            case 'tie-audio':
                matches = line.match(ExtronDXPCommand.tieResponseRE);
                retstr = matches[2];
                ret = parseInt(retstr);
                break;
            case 'mute-video':
            case 'mute-audio':
                matches = line.match(ExtronDXPCommand.muteResponseRE);
                retstr = matches[3];
                ret = parseInt(retstr);
                break;
            case 'status':
                matches = line.match(ExtronDXPCommand.statusResponseRE);
                ret = {
                    "3.3V" : parseFloat(matches[1]),
                    "5V" : parseFloat(matches[2]),
                    "Temp" : parseFloat(matches[3]),
                    "Fan" : parseInt(matches[4])
                };
        }

        return ret;
    }
}