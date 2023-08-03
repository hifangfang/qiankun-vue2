import axios from 'axios';
import MICRO_CONFIG from '../../platform-config';
import { ApiResponse } from '../../api-response';
// @ts-ignore
import { PlatformInfo } from "../model/base-model";
export class BaseApi {
  // 获取登录后的公共信息
  private static getPlatInfoUrl = (MICRO_CONFIG.isNew ? MICRO_CONFIG.identity : MICRO_CONFIG.platform) + "getPlatInfo/explorer";

  static async getPlatInfo(): Promise<PlatformInfo> {
    const response = await axios.get<ApiResponse<PlatformInfo>>(this.getPlatInfoUrl);
    return response.data.data;
  }
  //根据变量Key获取变量值
  private static getCodeValuePropertysByKeysUrl = MICRO_CONFIG.base + "base/sysconfig/getCodeValuePropertysByKeys"
  static async getCodeValuePropertysByKeys(vo: any): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.getCodeValuePropertysByKeysUrl, vo);
    return response.data.data;
  }

  //实现标题名称自定义
  private static getCommonSubGuidUrl = MICRO_CONFIG.base + "base/getCommonSubGuid"
  static async getCommonSubGuid(): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.getCommonSubGuidUrl);
    return response.data.data;
  }
}
