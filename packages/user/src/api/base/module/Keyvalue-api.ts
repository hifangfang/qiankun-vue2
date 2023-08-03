import axios from 'axios';
import MICRO_CONFIG from '../../platform_config';
import {SubsystemTreeVo, KeyvalueGroupVo,   PageVo,  KeyvalueGroupDeepVo,DataConnectionInfo, KeyvalueProperty,
  KeyvalueRequest, PageData} from "../model/Keyvalue-model";
import {ApiResponse} from '../../api-response';
import {SubsystemVO} from "@/api/base/model/Subsys-model";

export class KeyvalueApi {
  private static urlPrefix = MICRO_CONFIG.isNew?MICRO_CONFIG.base:MICRO_CONFIG.platform;
  //获取运维和前端框架登录页面的标题名称 type：designer 或者 explorer
  private static getPlatformDesignerOrExplorerTitleByIdUrl = KeyvalueApi.urlPrefix + "base/sysconfig/getPlatformDesignerOrExplorerTitleById/{type}";

  static async getPlatformDesignerOrExplorerTitleById(type: string): Promise<string> {
    const response = await axios.get<ApiResponse<string>>
    (this.getPlatformDesignerOrExplorerTitleByIdUrl.replace('{type}', type));
    return response.data.data;
  }

  //根据子系统id,父级id查询变量分组信息
  private static getSubsystemTreeUrl = KeyvalueApi.urlPrefix + "base/sysconfig/getKeyValueGroupSyncByPIdAndSubId/{parentId}/{subGuid}";

  static async getSubsystemTreeById(parentId: string,subGuid: string): Promise<SubsystemTreeVo[]> {
    const response = await axios.get<ApiResponse<SubsystemTreeVo[]>>
    (this.getSubsystemTreeUrl.replace('{parentId}', parentId).replace('{subGuid}', subGuid));
    return response.data.data;
  }


  //查询编号信息
  private static getKeyvalueGroupUrl = KeyvalueApi.urlPrefix + "base/sysconfig/keyvaluegroups/{id}";

  static async getKeyvalueGroupById(id: string): Promise<KeyvalueGroupVo> {
    const response = await axios.get<ApiResponse<KeyvalueGroupVo>>
    (this.getKeyvalueGroupUrl.replace('{id}', id));
    return response.data.data;
  }

  //查询编号信息
  private static getKeyGroupByParentIdUrl = KeyvalueApi.urlPrefix + "base/sysconfig/getKeyGroupTabMessage/{id}";

  static async getKeyGroupByParentId(id: string,params:Object): Promise<PageVo> {
    const response = await axios.get<ApiResponse<PageVo>>
    (this.getKeyGroupByParentIdUrl.replace('{id}', id),{params:params});
    return response.data.data;
  }

  //查询键名称是否重复
  private static isKeyPropertyNameExistUrl = KeyvalueApi.urlPrefix + "base/sysconfig/isKeyPropertyNameExist/{parentId}";

  static async isKeyPropertyNameExist(groupId: string,propertyName: string): Promise<boolean> {
    const headers = {
      'Content-Type': 'application/text'
    }
    //post string类型参数时 application/text；直接传递string值
    const response = await axios.post<ApiResponse<boolean>>
    (this.isKeyPropertyNameExistUrl.replace('{parentId}', groupId),propertyName, {headers:headers} );
    return response.data.data;
  }

  //当前分组或其他分组下已存在该配置项键名称
  private static isKeyPropertyKeyExistUrl = KeyvalueApi.urlPrefix + "base/sysconfig/isKeyPropertyKeyExist";

  static async isKeyPropertyKeyExist(vo: any): Promise<boolean> {
    const response = await axios.post<ApiResponse<boolean>>(this.isKeyPropertyKeyExistUrl,vo);
    return response.data.data;
  }
    //分页查询分组下的键值信息
    private static getKeyPropertyByGroupIdUrl = KeyvalueApi.urlPrefix + "base/sysconfig/getKeyPropertyTabMessage/{id}";

    static async getKeyPropertyByGroupId(id: string,params:Object): Promise<PageVo> {
      const response = await axios.get<ApiResponse<PageVo>>
      (this.getKeyPropertyByGroupIdUrl.replace('{id}', id),{params:params});
      return response.data.data;
    }
   // 过滤子系统
   private static filterSubsystemUrl = KeyvalueApi.urlPrefix + "base/sysconfig/keyvaluefilterSubsystem";

   static async filterSubsystem(vo: any): Promise<SubsystemVO> {
     const response = await axios.post<ApiResponse<SubsystemVO>>(this.filterSubsystemUrl, vo);
     return response.data.data;
   }
  // 新增变量
  private static addKeyvalueGroupUrl = KeyvalueApi.urlPrefix + "base/sysconfig/keyvaluegroups";

  static async addKeyvalueGroup(vo: KeyvalueGroupVo): Promise<KeyvalueGroupVo> {
    const response = await axios.post<ApiResponse<KeyvalueGroupVo>>(this.addKeyvalueGroupUrl, vo);
    return response.data.data;
  }

  // 修改编号
  private static updateKeyvalueGroupUrl = KeyvalueApi.urlPrefix + "base/sysconfig/keyvaluegroups/{id}";

  static async updateKeyvalueGroup(id: string, vo: KeyvalueGroupVo): Promise<KeyvalueGroupVo> {
    const response = await axios.post<ApiResponse<KeyvalueGroupVo>>(this.updateKeyvalueGroupUrl.replace('{id}', id), vo);
    return response.data.data;
  }

  // 按id删除编号分组级联删除配置项信息
  private static deleteKeyvalueGroupUrl = KeyvalueApi.urlPrefix + "base/sysconfig/keyGroupPropertyDelete/{id}";

  static async deleteKeyvalueGroup(id: string,menuT?:string): Promise<string> {
    if(menuT){
      //删除配置应用菜单的信息
      const response = await axios.get(this.deleteKeyvalueGroupUrl.replace('{id}', id)+"?menuT="+menuT);
      return response.data.data;
    }else{
      const response = await axios.get(this.deleteKeyvalueGroupUrl.replace('{id}', id));
      return response.data.data;
    }

  }

  // Table批量删除编号分组级联删除配置项信息
  private static batchDeleteKeyvalueGroupUrl = KeyvalueApi.urlPrefix + "base/sysconfig/deleteSelectedKeyGroups";

  static async batchDeleteKeyvalueGroup(vo:[]): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.batchDeleteKeyvalueGroupUrl, vo);
    return response.data.data;
  }

  // 根据分组id查询其信息以及对应所有子项信息
  private static getKeyvalueGroupAndPropertyUrl = KeyvalueApi.urlPrefix + "base/sysconfig/keyValueGroupAndProperty/{id}";

  static async getKeyvalueGroupAndProperty(id: string): Promise<KeyvalueGroupDeepVo> {
    const response = await axios.get(this.getKeyvalueGroupAndPropertyUrl.replace('{id}', id));
    return response.data.data;
  }
  // 更新分组id对应的档案类或者Datasource的键值信息
  private static updateDefaultKeyValuePropertyUrl = KeyvalueApi.urlPrefix + "base/sysconfig/defaultKeyValuePropertyUpdate";

  static async updateDefaultKeyValueProperty(vo: KeyvalueGroupDeepVo): Promise<KeyvalueGroupDeepVo> {
    const response = await axios.post(this.updateDefaultKeyValuePropertyUrl,vo);
    return response.data.data;
  }

  // 测试数据源配置
  private static testDatasourceUrl = KeyvalueApi.urlPrefix + "base/sysconfig/dataBaseTest";

  static async testDatasource(vo: DataConnectionInfo): Promise<String> {
    const response = await axios.post(this.testDatasourceUrl,vo);
    return response.data.data;
  }

  // 根据propertyid 获取键值信息
  private static getKeyPropertyByIdUrl = KeyvalueApi.urlPrefix + "base/sysconfig/keyValuePropertyInfo/{id}";

  static async getKeyPropertyById(id:string): Promise<KeyvalueProperty> {
    const response = await axios.get<ApiResponse<KeyvalueProperty>>(this.getKeyPropertyByIdUrl.replace('{id}', id));
    return response.data.data;
  }
  // 新增类型为自定义的分组信息
  private static addKeyPropertyUrl = KeyvalueApi.urlPrefix + "base/sysconfig/keyvaluepropertys";

  static async addKeyProperty(vo: KeyvalueProperty): Promise<KeyvalueProperty> {
    const response = await axios.post(this.addKeyPropertyUrl,vo);
    return response.data.data;
  }
  // 更新类型为自定义的分组信息
  private static updateKeyPropertyUrl = KeyvalueApi.urlPrefix + "base/sysconfig/keyvaluepropertys/{id}";

  static async updateKeyProperty(id,vo: KeyvalueProperty): Promise<KeyvalueProperty> {
    const response = await axios.post(this.updateKeyPropertyUrl.replace('{id}', id),vo);
    return response.data.data;
  }

  ///sysconfig/del-keyvaluepropertys/{id}
  // 按id删除键值表
  private static deleteKeyvaluePropertyUrl = KeyvalueApi.urlPrefix + "base/sysconfig/deletekeyvaluepropertys/{id}";

  static async deleteKeyvalueProperty(id: string): Promise<string> {
    const response = await axios.get(this.deleteKeyvaluePropertyUrl.replace('{id}', id));
    return response.data.data;
  }

  // Table批量删除键值级联删除键值的配置项信息
  private static batchDeleteSelectedPropertysUrl = KeyvalueApi.urlPrefix + "base/sysconfig/deleteSelectedPropertysForLogo";

  static async batchDeleteSelectedPropertys(vo:[]): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.batchDeleteSelectedPropertysUrl, vo);
    return response.data.data;
  }

  //分页查询分组下的键值信息
  private static getKeyPropertyBySubGuidUrl = KeyvalueApi.urlPrefix + "base/sysconfig/getKeyValueBySubGuid/{subGuid}";

  static async getKeyPropertyBySubGuid(subGuid: string, params:KeyvalueRequest): Promise<PageData[]> {
    const response = await axios.post<ApiResponse<PageData[]>>
    (this.getKeyPropertyBySubGuidUrl.replace('{subGuid}', subGuid),params);
    return response.data.data;
  }


  //根据键值项key的集合获取所有键值项
  private static getAllKeyValuePropertysByKeysUrl = KeyvalueApi.urlPrefix + "base/sysconfig/getAllKeyValuePropertysByKeys";

  static async getAllKeyValuePropertysByKeys(vo: string[]): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.getAllKeyValuePropertysByKeysUrl,vo);
    return response.data.data;
  }

  //查询该分组名字是否存在
  private static isKeyGroupNameExistUrl = KeyvalueApi.urlPrefix + "base/sysconfig/isKeyGroupNameExist/{parentId}";

  static async isKeyGroupNameExist(parentId:string, vo: {}): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.isKeyGroupNameExistUrl.replace('{parentId}', parentId),vo);
    return response.data.data;
  }



}
