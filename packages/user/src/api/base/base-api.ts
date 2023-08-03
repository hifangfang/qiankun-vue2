import axios from 'axios';
import MICRO_CONFIG from '../platform_config';
import {ApiResponse} from '../api-response';
import {PlatformInfo,SysConfig} from './base-model';
export class BaseApi {
    private static funcmgrUrlPrefix = MICRO_CONFIG.isNew?MICRO_CONFIG.identity:MICRO_CONFIG.platform;
    private static baseUrlPrefix = MICRO_CONFIG.isNew?MICRO_CONFIG.base:MICRO_CONFIG.platform;
    // 获取登录后的公共信息
    private static getPlatInfoUrl = (MICRO_CONFIG.isNew ? MICRO_CONFIG.identity : MICRO_CONFIG.platform) + "getPlatInfo/explorer";

    static async getPlatInfo(): Promise<PlatformInfo>{
        const response = await axios.get<ApiResponse<PlatformInfo>>(this.getPlatInfoUrl);
        return response.data.data;
    }
  //获取系统配置项
  private static getSysConfigUrl = BaseApi.baseUrlPrefix + "selfconfig/getConfigs";
  static async getSysConfig(): Promise<any>{
    const response = await axios.get<ApiResponse<any>>(this.getSysConfigUrl);
    return response.data.data;
  }
  //根据变量Key获取变量值
  private static getCodeValuePropertysByKeysUrl = MICRO_CONFIG.base + "base/sysconfig/getCodeValuePropertysByKeys"
  static async getCodeValuePropertysByKeys(vo: any): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.getCodeValuePropertysByKeysUrl, vo);
    return response.data.data;
  }
  //实现标题名称自定义
  private static changeTitleUrl=  MICRO_CONFIG.base+"base/sysconfig/getCodeValuePropertysByKeys"
  static async changeTitle(vo:any):Promise<any>{
    const response =await axios.post<ApiResponse<any>>(this.changeTitleUrl,vo);
    return response.data.data;
  }

}
