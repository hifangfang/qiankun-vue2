import axios from 'axios';
import MICRO_CONFIG from '../../platform-config';
import {ApiResponse} from '../../api-response';
export class IdentityApi {
  private static getpwdCheckUrl = (MICRO_CONFIG.isNew ? MICRO_CONFIG.identity : MICRO_CONFIG.platform) + "base/passWordCheck";
   static async pwdCheck(): Promise<any> {
     const response = await axios.get<ApiResponse<any>>(this.getpwdCheckUrl);
     return response.data.data;
   }
}




