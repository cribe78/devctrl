import {ITCPCommandConfig, TCPCommand} from "../TCPCommand";
import {Control} from "../../app/shared/Control";
import {ControlUpdateData} from "../../app/shared/ControlUpdate";
import {sprintf} from "sprintf-js";


export interface ICLQLCommandConfig extends ITCPCommandConfig{
    prmChgRequest?: string;
    deviceType?: string;
    deviceModel?: string;
    commandGroup?: string;
    command?: string;
    subCommand?: string;
    channel?: string;
}


/**
 * Implemented with the help of ParamChangeList_V200_CL_V100_QL.xls, provided by Yamaha support
 */

export class CLQLCommand extends TCPCommand {

    private prmChgRequest : string;
    private deviceType : string;
    private deviceModel : string;

    private commandGroup : string;
    static CGROUP_SETUP = "01"; // Scene/Setup
    static CGROUP_METER = "21"; // Level Meter
    static CGROUP_ACK = "32";

    private command : string;
    private subCommand : string;
    private channel: string;

    constructor(config: ICLQLCommandConfig) {
        super(config);

        this.prmChgRequest = config.prmChgRequest ? config.prmChgRequest : "0";
        this.deviceType = config.deviceType ? config.deviceType : "3e"; // "Digital Mixer"
        this.deviceModel = config.deviceModel ? config.deviceModel : "19"; // "CL5/CL3/CL1"

        this.commandGroup = config.commandGroup ? config.commandGroup : CLQLCommand.CGROUP_SETUP;
        this.command = typeof config.command == 'undefined' ? "" : config.command;
        this.subCommand = typeof config.subCommand == 'undefined' ? "" : config.subCommand;
        this.channel = typeof config.channel == 'undefined' ? "" : config.channel;
    }


    static fromCLHexString(str: string) : number {
        if (str.length != 10) {
            throw Error("sorry, we're looking for a string of length 10");
        }

        return parseInt(str.slice(-6,-4), 16) * 128 * 128 +
                parseInt(str.slice(-4, -2), 16) * 128 +
                parseInt(str.slice(-2), 16);
    }


    parseValue(value) {
        if (this.control_type == Control.CONTROL_TYPE_RANGE
            || this.control_type == Control.CONTROL_TYPE_INT ) {
            return CLQLCommand.fromCLHexString(value);
        }
        else if (this.control_type == Control.CONTROL_TYPE_BOOLEAN) {
            return this.parseBoolean(value);
        }

        return value;
    }

    queryResponseMatchString() {
        let header = "f0431"
            + this.prmChgRequest
            + this.deviceType
            + this.deviceModel
            + this.commandGroup
            + this.command;

        if (this.commandGroup == CLQLCommand.CGROUP_SETUP) {
            return header + this.subCommand + this.channel + "(.*)";
        }

        return header;
    }

    queryString() {
        if (this.cmdQueryStr) {
            return this.cmdQueryStr;
        }

        let header = "f0433"
            + this.prmChgRequest
            + this.deviceType
            + this.deviceModel
            + this.commandGroup
            + this.command;

        if (this.commandGroup == CLQLCommand.CGROUP_SETUP) {
            return header + this.subCommand + this.channel;
        }


        return header;
    }

    /**
     * This protocol uses a non standard hex representation
     * @param num a number to convert to hex representation
     */
    static toCLhexString(num: number) : string {
        if (num < 0) {
            throw new RangeError("GTFO, I have no idea what to do with negative numbers");
        }

        // Each byte in this format represents a 7 bit number.
        // FOr example:
        // 127 = 00 7f
        // 128 = 01 00
        let byte3 = Math.floor(num / (128 * 128));
        let remainder = num - byte3 * 128 * 128;

        let byte2 = Math.floor(remainder / 128);
        let byte1 = remainder - byte2 * 128;

        return sprintf("0000%02x%02x%02x", byte3, byte2, byte1);
    }



    updateResponseMatchString(update: ControlUpdateData) : string {
        // This protocol doesn't confirm updates
        return '';
    }

    updateString(control: Control, update: ControlUpdateData) {
        let header = "f0431"
            + this.prmChgRequest
            + this.deviceType
            + this.deviceModel
            + this.commandGroup
            + this.command;

        let value = update.value;
        if (this.control_type == Control.CONTROL_TYPE_BOOLEAN) {
            value = value ? 1 : 0;
        }

        if (this.commandGroup == CLQLCommand.CGROUP_SETUP) {
            let strVal = CLQLCommand.toCLhexString(value);

            return header + this.subCommand + this.channel + strVal;
        }


        return '';
    }

}