export interface LoginInfoVo {
    username: string;
    logintype: string;
    key?: string|null;
    ip:string;
    devicetype:string;
    reload?:string|null;
}