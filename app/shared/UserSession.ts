export interface UserSession {
    _id?: string;
    login_expires: number;
    auth: boolean;
    admin_auth: boolean;
    admin_auth_expires: number;
    admin_auth_requested?: boolean;
    client_name?: string;
    username?: string;
    userInfo_id? : string;
};