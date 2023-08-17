export enum ApiResultCode {
    Success = '200',
    NoAuth = '401',
    Error = '900',
    ErrorBeforeRequest = 'errorBeforeRequest'
  }

  export interface Api_response<T = any> {
    code: string;
    data: T;
    msg: string;
    resultCode: ApiResultCode;
  }
    
  export class ApiRequestError extends Error {
    code: ApiResultCode;
  
    constructor(code: ApiResultCode, message = "") {
      super(message || ApiRequestError.getMessageByCode(code));
      this.code = code;
    }
  
    static getMessageByCode(code: ApiResultCode) {
      switch (code) {
        case ApiResultCode.NoAuth: return "认证失败，请联系管理员";
        case ApiResultCode.Error: return "业务错误，禁止进行操作";
        case ApiResultCode.ErrorBeforeRequest: return "请求之前网页发生错误，请求无法继续进行";
      }
    }
  }
  