import {TCPCommand, ITCPCommandConfig} from "../TCPCommand";
import {Control} from "../../shared/Control";
import {ControlUpdateData} from "../../shared/ControlUpdate";

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

    matchesReport(devStr: string) : boolean {
        let matchStr = this.queryString();
        let matchLen = matchStr.length;
        return devStr.substring(0, matchLen) == matchStr;
    }


    queryString() {
        return `${ this.device } ${ this.cmdStr }`;
    }

    queryResponseMatchString() {
        return this.queryString + '.*';
    }

    updateString(control: Control, update: ControlUpdateData) {
        return this.updateResponseMatchString(update);
    }

    updateResponseMatchString(update: ControlUpdateData) {
        let value = update.value;
        if (this.control_type == Control.CONTROL_TYPE_BOOLEAN) {
            // Use "1" and "0" instead of "true" and "false"
            value = value ? 1 : 0;
        }

        return `${ this.device } ${ this.cmdStr } ${value} ${ this.updateTerminator }`;
    }

    parseQueryResponse(control: Control, line: string) : any {
        return this.parseReportValue(control, line);
    }

    parseReportValue(control: Control, line: string) : any {
        let qStr = this.queryString();
        let val = line.slice(qStr.length);

        // String a trailing " A", indicating an absolute level
        if (val.substring(val.length - 2) == " A") {
            val = val.substring(0, val.length - 2);
        }

        let ret = parseInt(val);

        return ret;
    }
}