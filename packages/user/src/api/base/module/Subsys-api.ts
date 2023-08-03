import axios from 'axios';
import MICRO_CONFIG from '../../platform_config';
import {SubsystemVO, SubsysUpdateRequest,SubsysVo, AppVO} from "../model/Subsys-model";
import {ApiResponse} from '../../api-response';
export class SubsysApi {
    private static urlPrefix = MICRO_CONFIG.isNew?MICRO_CONFIG.base:MICRO_CONFIG.platform;
    // 获取简化版本的子系统
    private static getSubsystemsAllUrl = SubsysApi.urlPrefix + "base/sysconfig/getAllSubSystems";
    static async getSubsystemsAll(): Promise<SubsysVo[]>{
        const response = await axios.get<ApiResponse<SubsysVo[]>>(this.getSubsystemsAllUrl);
        return response.data.data;
    }
    // 获取所有子系统
    private static getAllUrl = SubsysApi.urlPrefix + "base/sysconfig/subsystems-all";
    static async getAll(): Promise<SubsystemVO[]>{
        const response = await axios.get<ApiResponse<SubsystemVO[]>>(this.getAllUrl);
        return response.data.data;
    }

    // 获取所有子系统
    private static getAppListUrl = SubsysApi.urlPrefix + "base/sysconfig/getAppsByRole";
    static async getAppList(vo:any): Promise<SubsystemVO[]>{
      const response = await axios.post<ApiResponse<SubsystemVO[]>>(this.getAppListUrl,vo);
      return response.data.data;
    }
    // 获取单个数据
    private static getByIdUrl = SubsysApi.urlPrefix + "base/sysconfig/subsystems/{id}";
    static async getById(id:string): Promise<SubsystemVO>{
        const response = await axios.get<ApiResponse<SubsystemVO>>
        (this.getByIdUrl.replace('{id}',id));
        return response.data.data;
    }
    // 新增
    private static addUrl = SubsysApi.urlPrefix + "base/sysconfig/subsystems";
    static async add(vo:SubsystemVO): Promise<SubsystemVO>{
        const response = await axios.post<ApiResponse<SubsystemVO>>(this.addUrl, vo);
        return response.data.data;
    }
    // 修改
    private static updateUrl = SubsysApi.urlPrefix + "base/sysconfig/subsystems/{id}";
    static async update(id:string, vo: SubsystemVO): Promise<SubsystemVO>{
        const response = await axios.post<ApiResponse<SubsystemVO>>(this.updateUrl.replace('{id}',id), vo);
        return response.data.data;
    }
    // 删除
    private static deleteUrl = SubsysApi.urlPrefix + "base/sysconfig/deleteApp/{subGuid}";
    static async delete(subGuid:string): Promise<string>{
        const response = await axios.get(this.deleteUrl.replace('{subGuid}',subGuid));
        return response.data.data;
    }
    // 拖拽
    private static dragUrl = SubsysApi.urlPrefix + "base/sysconfig/subsystems/updateSysSequence";
    static async drag(vo:SubsysUpdateRequest): Promise<string>{
        const response = await axios.post<ApiResponse<string>>(this.updateUrl, vo);
        return response.data.data;
    }

    // 更新状态
    private static updateDisabledUrl = SubsysApi.urlPrefix + "base/sysconfig/subsystems/updateDisabled/{id}/{disabled}";
    static async updateDisabled(id:string, disabled:number): Promise<string>{
        const response = await axios.post<ApiResponse<string>>(
            this.updateDisabledUrl.replace("{id}",id).replace("{disabled}",disabled+""));
        return response.data.data;
    }

    // 新增应用
    private static addAppUrl = SubsysApi.urlPrefix + "base/sysconfig/subsystems/addApp";
    static async addApp(vo:Object): Promise<string>{
        const response = await axios.post<ApiResponse<string>>(this.addAppUrl,vo,{
          'headers': {
            'Content-Type': 'multipart/form-data'
          },
        });
        return response.data.data;
    }
    // 编辑更新应用
    private static updateAppUrl = SubsysApi.urlPrefix + "base/sysconfig/subsystems/updateApp";
    static async updateApp(vo:Object): Promise<string>{
        const response = await axios.post<ApiResponse<string>>(this.updateAppUrl,vo,{
          'headers': {
            'Content-Type': 'multipart/form-data'
          },
        });
        return response.data.data;
    }
    // 发布应用
    private static publishAppUrl = SubsysApi.urlPrefix + "base/sysconfig/subsystems/publishApp/{id}";
    static async publishApp(id:string): Promise<string>{
        const response = await axios.post<ApiResponse<string>>(this.publishAppUrl.replace("{id}",id));
        return response.data.data;
    }
  // 新的发布应用  /identity/base/appMember/shareApp
    private static shareAppUrl = MICRO_CONFIG.identity + "base/appMember/shareApp";
    static async shareApp(vo): Promise<string>{
      const response = await axios.post<ApiResponse<any>>(this.shareAppUrl, vo);
      return response.data.data;
    }
    // 根据发布地址子系统
    private static getWithPubUrl = SubsysApi.urlPrefix + "base/sysconfig/getWithPubUrl";
    static async getWithPulishURl(publishUrl:string): Promise<SubsystemVO[]>{
        const url = this.getWithPubUrl + '?publishUrl=' + publishUrl;
        const response = await axios.get<ApiResponse<SubsystemVO[]>>(url);
        return response.data.data;
    }

  // 应用复制
  private static copyAppUrl = SubsysApi.urlPrefix + "base/sysconfig/copyApp";
  static async copyApp(vo:Object): Promise<string>{
    const response = await axios.post<ApiResponse<string>>(this.copyAppUrl, vo);
    return response.data.data;
  }

  //校验应用代码是否重复
  private static checkRepeatUrl = SubsysApi.urlPrefix+"base/sysconfig/subsystems-checkCode/{id}/{subCode}"
  static async checkRepeat(id:string,subCode:string):Promise<any>{
     const response = await axios.get<ApiResponse<string>>(this.checkRepeatUrl.replace("{id}",id).replace("{subCode}",subCode))
     return response.data.data;
  }

  //校验应用名称是否重复  /sysconfig/subsystems-checkName/{id}/{subName}
  private static checkRepeatNameUrl = SubsysApi.urlPrefix+"base/sysconfig/subsystems-checkName/{id}/{subName}"
  static async checkRepeatName(id:any,subName:string):Promise<any>{
    const response = await axios.get<ApiResponse<string>>(this.checkRepeatNameUrl.replace("{id}",id).replace("{subName}",subName))
    return response.data.data
  }
  //获取应用中心列表 已发布的应用 被共享的应用
  private static getAppsByUserUrl = MICRO_CONFIG.identity+"base/appMember/getAppsByUser"
  static async getAppsByUser(vo:any):Promise<any>{
    const response = await axios.post<ApiResponse<string>>(this.getAppsByUserUrl,vo)
    return response.data.data;
  }

  // 获取所有子系统-lu
  private static getApplicationUrl = SubsysApi.urlPrefix + "base/template/getAllTemplate";
  static async getApplicationList(): Promise<SubsystemVO[]>{
    const response = await axios.get<ApiResponse<SubsystemVO[]>>(this.getApplicationUrl);
    return response.data.data;
  }

  // 应用启用
  private static enableAppUrl = SubsysApi.urlPrefix + "base/sysconfig/enableApp";
  static async enableApp(vo:Object): Promise<string>{
  const response = await axios.post<ApiResponse<string>>(this.enableAppUrl, vo);
  return response.data.data;
  }
}
