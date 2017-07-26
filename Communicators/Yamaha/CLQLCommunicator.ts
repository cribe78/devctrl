import {SynchronousTCPCommunicator} from "../SynchronousTCPCommunicator";
import {TCPCommand} from "../TCPCommand";
import {Control} from "../../app/shared/Control";
import {CLQLCommand} from "./CLQLCommand";
import {EndpointStatus} from "../../app/shared/Endpoint";
import {TCPCommunicator} from "../TCPCommunicator";
import {sprintf} from "sprintf-js";
import {EndpointCommunicator} from "../EndpointCommunicator";

class CLQLCommunicator extends TCPCommunicator {
    static USERTYPE_FADER_COMBO = "clql-fader-combo";
    private alvPacket = "f043103e197f";

    constructor() {
        super();
        this.inputLineTerminator = "f7";
        this.outputLineTerminator = "f7";
        this.commsMode = "hex";
    }

    buildCommandList() {
        let inputCount = 72;
        let mixCount = 16;

        if (this.config.endpoint.config.model == "QL1") {
            inputCount = 48;
            mixCount = 16;
        }

        // Input Controls
        for (let i = 0; i < inputCount; i++) {
            let chnName = sprintf("%02d", i + 1);
            let chnStr = sprintf("%04x", i);
            this.registerSetupCommand(`InputOn.${chnName}`, "0035", "0000", chnStr,
                Control.CONTROL_TYPE_BOOLEAN, Control.USERTYPE_SWITCH);
            this.registerSetupCommand(`InputFader.${chnName}`, "0037", "0000", chnStr,
                Control.CONTROL_TYPE_RANGE, Control.USERTYPE_CLQL_FADER,
                { min: 0, max: 1023});

            this.registerFaderComboControl(`fader-combo-${chnName}`, `Input ${chnName}`,
                                            `InputFader.${chnName}`,
                                            `InputOn.${chnName}`);
        }

        // Mix Controls
        for (let i = 0; i < mixCount; i++) {
            let chnStr = sprintf("%04x", i);
            this.registerSetupCommand(`MixOn.${i}`, "004b", "0000", chnStr,
                Control.CONTROL_TYPE_BOOLEAN, Control.USERTYPE_SWITCH);
            this.registerSetupCommand(`MixFader.${i}`, "004d", "0000", chnStr,
                Control.CONTROL_TYPE_RANGE, Control.USERTYPE_CLQL_FADER,
                { min: 0, max: 1023});
        }

        // Matrix Controls
        for (let i = 0; i < 8; i++) {
            let chnStr = sprintf("%04x", i);
            this.registerSetupCommand(`MatrixOn.${i}`, "0063", "0000", chnStr,
                Control.CONTROL_TYPE_BOOLEAN, Control.USERTYPE_SWITCH);
            this.registerSetupCommand(`MatrixFader.${i}`, "0065", "0000", chnStr,
                Control.CONTROL_TYPE_RANGE, Control.USERTYPE_CLQL_FADER,
                { min: 0, max: 1023});
        }

    }

    doDeviceLogon() {
        this.socket.on('data', data => {
            if (this.connected) return;

            let strData = data.toString('hex');

            if (strData == this.alvPacket + "f7") {
                this.log("connection string received, sending ACK", EndpointCommunicator.LOG_CONNECTION);
                //this.writeToSocket("f043303e1932f7f043303e193100f7");
                this.writeToSocket("f043303e1932f7"
                                + "f043303e193100f7"
                );
                this.connected = true;
                this.config.statusUpdateCallback(EndpointStatus.Online);
                this.online();
            }
        });
    }

    preprocessLine(line: string) : string {
        if (line == this.alvPacket) {
            this.log("ALV received", "heartbeat");
            return '';
        }

        return line;
    }

    registerSetupCommand(name: string, command: string, subCommand: string, channel: string,
                            controlType = Control.CONTROL_TYPE_INT,
                            usertype = Control.USERTYPE_READONLY,
                            controlConfig = {}) {

        this.commands[name] = new CLQLCommand({
            cmdStr: name,
            endpoint_id: this.endpoint_id,
            control_type: controlType,
            usertype: usertype,
            templateConfig: controlConfig,
            poll: 1,
            commandGroup: CLQLCommand.CGROUP_SETUP,
            command: command,
            subCommand: subCommand,
            channel: channel
        });
    }


    registerFaderComboControl(ctidStr : string, name : string, faderId: string, onOffId: string) {
        let ctid = this.endpoint_id + "-" + ctidStr;
        let faderCtid = this.endpoint_id + "-" + faderId;
        let onOffCtid = this.endpoint_id + "-" + onOffId;
        let control = new Control(ctid, {
            _id: ctid,
            endpoint_id: this.endpoint_id,
            ctid: ctid,
            name: name,
            usertype: CLQLCommunicator.USERTYPE_FADER_COMBO,
            control_type: Control.CONTROL_TYPE_STRING,
            poll: 0,
            value: "",
            config : {
                componentControls: {
                    fader: faderCtid,
                    onOff: onOffCtid
                }
            }
        });

        this.registerControl(control);
    }
}

let communicator = new CLQLCommunicator();
module.exports = communicator;