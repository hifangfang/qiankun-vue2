export interface UserLoginResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    tenant_id: string;
    user_kind?: null;
    encrypt_str: string;
    tenant_uid: string;
    user_id: string;
    user_tel: string;
    user_name: string;
    user_nickname: string;
    user_id_number: string;
    status: string;
    jti: string;
    message: string;
    messagecode: string;
    system_user:number;
  }
