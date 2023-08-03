import axios from 'axios';
import MICRO_CONFIG from '../../platform_config';
import {ApiResponse} from "@/api/api-response";

export class signnatureApi{
  //通过appkey获取浙江省政府电子云签章列表信息
  //GET /getUserSealList
  private static getUserSealListUrl="/sign/getUserSealList?"
  static  async getUserSealList(appKey:string): Promise<any>{
    let url = this.getUserSealListUrl;
    if (null != appKey) {
      url =url+"appKey="+appKey;
    }
    const response = await axios.get<ApiResponse<any>>(url);
    return response.data.data;
  }

  //通过sealSn获取浙江省政府电子云签章列表信息
  //GET /sign/getSealDetail?sealsn=xxx
  private static getSealDetailUrl="/sign/sign/getSealDetail?"
  static  async getSealDetail(sealSn:string,token:string): Promise<any>{
    let url = this.getSealDetailUrl;
    if (null != sealSn) {
      url =url+"sealSn="+sealSn;
    }
    const response = await axios.get<ApiResponse<any>>(url,{
      headers: {
        'Content-Type': 'application/json',
        'X-Gisq-Token': token
      }
    });
    return response.data.data;
  }
}
