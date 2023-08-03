import axios from 'axios';
import MICRO_CONFIG from '../../platform_config';
import { DatumListResponse, BizFormListResponse, BizDatumRequest,ResourceItemResponse, ResourceGroupResponse,ResourceRequest,BizFormRequest, SubsystemVO, BizdefDatumGroupResponse, BizGroupRequest, BizDatumResponse, BizdefFormGroupResponse, BizdefFormResponse } from "../model/Resource-model";
import { ApiResponse } from '../../api-response';
export class ResourceApi {
  private static urlPrefix = MICRO_CONFIG.isNew?MICRO_CONFIG.base:MICRO_CONFIG.platform;
  //获取所有子系统
  private static getAllUrl = MICRO_CONFIG.bizmodel + "bpf/definitions/getAll/{id}";
  static async getAll(id: string): Promise<SubsystemVO[]> {
    const response = await axios.get<ApiResponse<SubsystemVO[]>>(this.getAllUrl.replace('{id}', id));
    return response.data.data;
  }
   //获取资源
   private static getresourceGroupAllUrl = ResourceApi.urlPrefix + "base/sysconfig/resourceGroupTree";

   static async resourceGroupTree(resourceRequest: ResourceRequest): Promise<ResourceGroupResponse[]> {
     const response = await axios.post<ApiResponse<ResourceGroupResponse[]>>(this.getresourceGroupAllUrl, resourceRequest);
     return response.data.data;
   }


   //菜单获取资源
   private static getresourceTreeAllUrl = ResourceApi.urlPrefix + "base/sysconfig/resourceTree";

   static async resourceTree(resourceRequest: ResourceRequest): Promise<ResourceGroupResponse[]> {
     const response = await axios.post<ApiResponse<ResourceGroupResponse[]>>(this.getresourceTreeAllUrl, resourceRequest);
     return response.data.data;
   }



   //获取资源详细信息
   private static getItemDetailInfoAllUrl = ResourceApi.urlPrefix + "base/getItemDetailInfo/{id}/{subGuid}";
   static async getItemDetailInfo(id: string,subGuid:string): Promise<ResourceItemResponse[]> {

     const response = await axios.get<ApiResponse<ResourceItemResponse[]>>(this.getItemDetailInfoAllUrl.replace('{id}', id).replace('{subGuid}', subGuid));
     return response.data.data;
   }
}
