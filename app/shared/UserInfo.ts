import {DCFieldType, DCSerializable, DCSerializableData, IDCFieldDefinition} from "./DCSerializable";

export interface UserInfoData extends DCSerializableData {
    clientType: ClientType;
}

export enum ClientType {
    web = "web",
    ncontrol = "ncontrol",
    watcher = "watcher"
}

export class UserInfo extends DCSerializable {
        clientType : ClientType;

        static tableStr = "userInfo";
        tableLabel = "User Info";


        ownFields : IDCFieldDefinition[] = [
            {
                name: "clientType",
                type: DCFieldType.string,
                label: "Client Type",
                tooltip: "The type of client"
            }
        ];

        constructor(_id: string, data?: UserInfoData) {
            super(_id);
            this.table = UserInfo.tableStr;

            this.fieldDefinitions = this.fieldDefinitions.concat(this.ownFields);

            if (data) {
                this.loadData(data);
            }
        }
}