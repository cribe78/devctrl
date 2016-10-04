import {TCPCommand, ITCPCommandConfig} from "../TCPCommand";
import {Control} from "../../shared/Control";
import {ControlUpdateData} from "../../shared/ControlUpdate";


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


    parseReportValue(control: Control, line: string) : any {
        if (this.dxpCmdType == 'status') {
            let matches = line.match(ExtronDXPCommand.statusResponseRE);
            return {
                "3_3V" : parseFloat(matches[1]),
                "5V" : parseFloat(matches[2]),
                "Temp" : parseFloat(matches[3]),
                "Fan" : parseInt(matches[4])
            };
        }


        let matches = line.match(this.cmdReportRE);

        if (matches && matches.length > 1) {
            return matches[this.cmdReportREMatchIdx];
        }

        return '';
    }
}