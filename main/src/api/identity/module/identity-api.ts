import axios from "axios";
import MICRO_CONFIG from "../../platform-config";
import { Api_response } from "../../api_response";
export class IdentityApi {
  static getpwdCheckUrl = (MICRO_CONFIG.isNew ? MICRO_CONFIG.identity : MICRO_CONFIG.platform) + "base/passWordCheck";
  static async pwdCheck(): Promise<any> {
    const response = await axios.get<Api_response<any>>(this.getpwdCheckUrl);
    return response.data.data;
  }
}
