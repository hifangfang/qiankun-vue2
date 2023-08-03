import axios from 'axios';
import { ApiResponse} from "@/api/api-response";

export class administraticApi {
  //行政区管理左侧树展开
  // private static getAlladiministraticUrl ='/base/district/asyncDistrictTree/{parentId}';
  // static async getAlladiministratic(parentId:string): Promise<any>{
  //   const response = await axios.get<ApiResponse<any>>(this.getAlladiministraticUrl.replace("{parentId}",parentId));
  //   return response.data.data;
  // }
  // //行政区左侧树下级展开新接口
  private static getAlladiministraticUrl ='/base/district/asyncDistrictTree-recursion/{parentId}';
  static async getAlladiministratic(parentId:string): Promise<any>{
    const response = await axios.get<ApiResponse<any>>(this.getAlladiministraticUrl.replace("{parentId}",parentId));
    return response.data.data;
  }

  //子级行政区详情展示
  private static getdistrictFormUrl ='/base/district/detailsDistrict/{districtId}';
  static async getdistrictForm(districtId:string): Promise<any>{
    const response = await axios.get<ApiResponse<any>>(this.getdistrictFormUrl.replace("{districtId}",districtId));
    return response.data.data;
  }

  //添加子级行政区
  private static addDistrictFormUrl ='/base/district/districtChange';
  static async addDistrictForm(vo:any): Promise<any>{
    const response = await axios.post<ApiResponse>(this.addDistrictFormUrl,vo);
    return response.data.data;
  }

  //修改子级行政区
  private static reviseDistrictFormUrl ='/base/district/updateDistrict';
  static async reviseDistrictForm(vo:any): Promise<any>{
    const response = await axios.post<ApiResponse>(this.reviseDistrictFormUrl,vo);
    return response.data.data;
  }

  //子级行政区分页查询
  private static checkDistrictFormUrl ='base/district/pageSonDistricts';
  static async checkDistrictForm(vo:any): Promise<any>{
    const response = await axios.post<ApiResponse>(this.checkDistrictFormUrl,vo);
    return response.data.data;
  }

  //批量删除子级行政区
  private static deleteDistrictUrl ='/base/district/removeDistricts';
  static async deleteDistrict(vo:any): Promise<any>{
    const response = await axios.post<ApiResponse>(this.deleteDistrictUrl,vo);
    return response.data.data;
  }

  //行政区用户列表批量-单项删除
  private static deleteuserListMoreUrl ='/base/district/removeDistrictUsers';
  static async deleteuserListMore(vo:any): Promise<any>{
    const response = await axios.post<ApiResponse>(this.deleteuserListMoreUrl,vo);
    return response.data.data;
  }

  //行政区用户列表详情及分页查询
  private static checkuserListUrl ='/base/district/pageUserDistricts';
  static async checkuserList(vo:any): Promise<any>{
    const response = await axios.post<ApiResponse>(this.checkuserListUrl,vo);
    return response.data.data;
  }

  //子级行政区用户关联
  private static relateuserListUrl ='/base/district/relateUserDistricts';
  static async relateuserList(vo:any): Promise<any>{
    const response = await axios.post<ApiResponse>(this.relateuserListUrl,vo);
    return response;
  }

  //获取已经绑定的行政区
  private static bindListUrl ='/base/district/bindedDistrictUsers/{districtId}';
  static async bindList(districtId:string): Promise<any>{
    const response = await axios.get<ApiResponse>(this.bindListUrl.replace("{districtId}",districtId));
    return response.data.data;
  }
  //用户管理移除行政区
  private static userDeleteuserListMoreUrl ='/base/district/relateRemoveUserDistrict/{userId}';
  static async userDeleteuserListMore(userId:string,vo:any): Promise<any> {
    const response = await axios.post<ApiResponse>(this.userDeleteuserListMoreUrl.replace("{userId}",userId), vo);
    return response.data.data;
  }

  //获取行政区接口  /district/getLazyDistrict/
  private static getLazyDistrictUrl ='/base/district/getLazyDistrict/{parentId}';
  static async getLazyDistrict(parentId:string): Promise<any>{
    const response = await axios.get<ApiResponse<any>>(this.getLazyDistrictUrl.replace("{parentId}",parentId));
    return response.data.data;
  }





  }
