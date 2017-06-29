import {TCPCommand} from "./TCPCommand";
import {TCPCommunicator} from "./TCPCommunicator";
import {ControlUpdateData} from "../shared/ControlUpdate";

let debug = console.log;


export class SynchronousTCPCommunicator extends TCPCommunicator {
    commandQueue : string[] = [];
    expectedResponsesQueue: [string | RegExp, (line: string) => any][] = [];
    commandQueueRunning = false;
    commandTimeoutTimer : any = 0;

    executeCommandQuery(cmd: TCPCommand) {
        if (! cmd.queryString()) {
            return;
        }

        let self = this;
        let queryStr = cmd.queryString();
        debug("queueing query: " + queryStr);

        this.queueCommand(queryStr + this.outputLineTerminator,
            [
                cmd.queryResponseMatchString(),
                (line) => {
                    for (let ctid of cmd.ctidList) {
                        let control = self.controlsByCtid[ctid];

                        let val = cmd.parseQueryResponse(control, line);
                        self.setControlValue(control, val);
                    }

                    self.connectionConfirmed();
                }
            ]
        );
    }


    onData(data: any) {
        let strData = '';
        if (this.commsMode == 'string') {
            strData = String(data);
        }
        else if (this.commsMode == 'hex') {
            strData = data.toString('hex');
        }

        //debug("data recieved: " + strData);

        this.inputBuffer += strData;
        let lines = this.inputBuffer.split(this.inputLineTerminator);

        while (lines.length > 1) {
            this.processLine(lines[0]);
            lines.splice(0,1);
            this.runNextCommand();
        }

        this.inputBuffer = lines[0];
    }


    queueCommand(cmdStr : string, expectedResponse: [string | RegExp, (line: string) => any]) {
        this.commandQueue.push(cmdStr);
        this.expectedResponsesQueue.push(expectedResponse);

        if (! this.commandQueueRunning) {
            this.runCommandQueue();
        }
    }


    runCommandQueue() {
        if (this.commandQueueRunning) {
            return;
        }

        this.commandQueueRunning = true;
        this.runNextCommand();
    }

    runNextCommand() {
        // If we are out of commands, reset the queues and stop
        if (this.commandTimeoutTimer) {
            clearTimeout(this.commandTimeoutTimer);
        }
        this.commandTimeoutTimer = 0;

        if (this.commandQueue.length == 0 || this.expectedResponsesQueue.length == 0) {
            this.commandQueueRunning = false;
            this.commandQueue = [];
            this.expectedResponsesQueue = [];
            return;
        }

        let command = this.commandQueue[0];
        let expectedResponse = this.expectedResponsesQueue[0];

        this.commandQueue.splice(0, 1);
        this.expectedResponsesQueue.splice(0,1);

        this.expectedResponses = [expectedResponse];


        let logCommand = command.replace(/\r?\n|\r/g, '');
        debug("sending command: " + logCommand);
        this.writeToSocket(command);

        if (expectedResponse[0] == '') {
            expectedResponse[1]('');
        }
        else {
            this.commandTimeoutTimer = setTimeout(() => {
                this.runNextCommand()
            }, 400);
        }
    }
}