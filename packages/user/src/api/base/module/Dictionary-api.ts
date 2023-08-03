import axios from 'axios';
import MICRO_CONFIG from '../../platform_config';
import {
  DictionaryTreeVO,
  DictionarySearchTreeVO,
  SubsysGroupRequest,
  SubsysGroupVO,
  FieldGroupVO,
  FieldGroupRequest,
  FieldExplainVO,
  FieldExplainRequest,
  FieldEnumVO,
  FieldEnumRequest
} from "../model/Dictionary-model";
import {ApiResponse} from '../../api-response';

export class DictionaryApi {

  private static urlPrefix = MICRO_CONFIG.isNew?MICRO_CONFIG.base:MICRO_CONFIG.platform;
  //异步加载树节点获取子系统下分组、字段、枚举
  private static getDictionaryTreeGroupUrl = DictionaryApi.urlPrefix + "base/dictionary/sync-fieldgroup-tree/{fatherGroupId}/{fatherType}";

  static async getDictionaryTreeGroup(fatherGroupId: string, fatherType: string): Promise<DictionaryTreeVO[]> {
    const response = await axios.get<ApiResponse<DictionaryTreeVO[]>>(this.getDictionaryTreeGroupUrl.replace('{fatherGroupId}', fatherGroupId).replace('{fatherType}', fatherType));
    return response.data.data;
  }
  //异步加载树节点搜素数据新接口
  private static getDictionarySearchTreeUrl = DictionaryApi.urlPrefix+ "base/dictionary/sync-fieldGroup-tree/null/{key}";

  static async getDictionarySearchTree(key:string):Promise<DictionarySearchTreeVO[]>{
    const response =await axios.get<ApiResponse<DictionarySearchTreeVO[]>>(this.getDictionarySearchTreeUrl.replace('{key}',key));
    return response.data.data;
  }


  //异步加载树节点获取顶层子系统
  private static getDictionaryTreeSystemUrl = DictionaryApi.urlPrefix + "base/dictionary/sync-fieldgroup-tree/{subGuid}";

  static async getDictionaryTreeSystem(subGuid: string): Promise<DictionaryTreeVO[]> {
    const response = await axios.get<ApiResponse<DictionaryTreeVO[]>>(this.getDictionaryTreeSystemUrl.replace("{subGuid}", subGuid));
    return response.data.data;
  }

  //获取可添加的子系统数据
  private static getDictionarySubSystemUrl = DictionaryApi.urlPrefix + "base/dictionary/getSubsystem";

  static async getDictionarySubSystem(): Promise<SubsysGroupVO[]> {
    const response = await axios.get<ApiResponse<SubsysGroupVO[]>>(this.getDictionarySubSystemUrl);
    return response.data.data;
  }

  //添加子系统分组(顶层分组)
  private static addDictionarySubSystemGroupUrl = DictionaryApi.urlPrefix + "base/dictionary/fieldgroups";

  static async addDictionarySubSystemGroup(vo: SubsysGroupRequest): Promise<FieldGroupVO> {
    const response = await axios.post<ApiResponse<FieldGroupVO>>(this.addDictionarySubSystemGroupUrl, vo);
    return response.data.data;
  }

  //更新子系统分组(顶层分组)
  private static updateDictionarySubSystemGroupUrl = DictionaryApi.urlPrefix + "base/dictionary/fieldgroups/{id}";

  static async updateDictionarySubSystemGroup(vo: SubsysGroupRequest, id: string): Promise<FieldGroupVO> {
    const response = await axios.post<ApiResponse<FieldGroupVO>>(this.updateDictionarySubSystemGroupUrl.replace("{id}", id), vo);
    return response.data.data;
  }

  //删除子系统分组
  private static deleteDictionarySubSystemGroupUrl = DictionaryApi.urlPrefix + "base/dictionary/fieldgroups-all/{id}";

  static async deleteDictionarySubSystemGroup(id: string): Promise<SubsysGroupRequest> {
    const response = await axios.post<ApiResponse<SubsysGroupRequest>>(this.deleteDictionarySubSystemGroupUrl.replace("{id}", id));
    return response.data.data;
  }

  //根据id查询分组信息(包括子系统分组),节点点击事件
  private static getDictionaryGroupByIdURL = DictionaryApi.urlPrefix + "base/dictionary/fieldgroup-info/{id}";

  static async getDictionaryGroupById(id: string): Promise<FieldGroupVO> {
    const response = await axios.get<ApiResponse<FieldGroupVO>>(this.getDictionaryGroupByIdURL.replace('{id}', id));
    return response.data.data;
  }

  //添加分组
  private static addDictionaryGroupUrl = DictionaryApi.urlPrefix + "base/dictionary/fieldgroups";

  static async addDictionaryGroup(vo: SubsysGroupRequest): Promise<FieldGroupRequest> {
    const response = await axios.post<ApiResponse<FieldGroupRequest>>(this.addDictionaryGroupUrl, vo);
    return response.data.data;
  }

  //更新分组
  private static updateDictionaryGroupUrl = DictionaryApi.urlPrefix + "base/dictionary/fieldgroups/{id}";

  static async updateDictionaryGroup(vo: FieldGroupRequest, id: string): Promise<SubsysGroupRequest> {
    const response = await axios.post<ApiResponse<FieldGroupRequest>>(this.updateDictionaryGroupUrl.replace("{id}", id), vo);
    return response.data.data;
  }

  //删除分组
  private static deleteDictionaryGroupUrl = DictionaryApi.urlPrefix + "base/dictionary/fieldgroups-all/delete/{id}";

  static async deleteDictionaryGroup(id: string): Promise<SubsysGroupRequest> {
    const response = await axios.post<ApiResponse<SubsysGroupRequest>>(this.deleteDictionaryGroupUrl.replace("{id}", id));
    return response.data.data;
  }

  //根据id查询字段信息,节点点击事件
  private static getDictionaryExplainsByIdUrl = DictionaryApi.urlPrefix + "base/dictionary/fieldexplain-info/{id}";

  static async getDictionaryExplainsById(id: string): Promise<FieldExplainVO> {
    const response = await axios.get<ApiResponse<FieldExplainVO>>(this.getDictionaryExplainsByIdUrl.replace('{id}', id));
    return response.data.data;
  }

  //添加字段
  private static addDictionaryExplainsUrl = DictionaryApi.urlPrefix + "base/dictionary/fieldexplains";

  static async addDictionaryExplains(vo: FieldExplainRequest): Promise<FieldExplainRequest> {
    const response = await axios.post<ApiResponse<FieldExplainRequest>>(this.addDictionaryExplainsUrl, vo);
    return response.data.data;
  }

  //更新字段
  private static updateDictionaryExplainsUrl = DictionaryApi.urlPrefix + "base/dictionary/fieldexplains/{id}";

  static async updateDictionaryExplains(vo: FieldExplainRequest, id: string): Promise<FieldExplainRequest> {
    const response = await axios.post<ApiResponse<FieldExplainRequest>>(this.updateDictionaryExplainsUrl.replace("{id}", id), vo);
    return response.data.data;
  }

  //删除字段
  private static deleteDictionaryExplainsUrl = DictionaryApi.urlPrefix + "base/dictionary/deleteFieldexplains/{id}";

  static async deleteDictionaryExplains(id: string): Promise<SubsysGroupRequest> {
    const response = await axios.post<ApiResponse<SubsysGroupRequest>>(this.deleteDictionaryExplainsUrl.replace("{id}", id));
    return response.data.data;
  }

  //根据id查询枚举信息,节点点击事件
  private static getDictionaryEnumByIdURL = DictionaryApi.urlPrefix + "base/dictionary/fieldenums-all/{id}";

  static async getDictionaryEnumById(id: string): Promise<FieldEnumVO> {
    const response = await axios.get<ApiResponse<FieldEnumVO>>(this.getDictionaryEnumByIdURL.replace('{id}', id));
    return response.data.data;
  }


  //添加枚举
  private static addDictionaryEnumsUrl = DictionaryApi.urlPrefix + "base/dictionary/fieldenums";

  static async addDictionaryEnums(vo: FieldEnumRequest): Promise<FieldEnumRequest> {
    const response = await axios.post<ApiResponse<FieldEnumRequest>>(this.addDictionaryEnumsUrl, vo);
    return response.data.data;
  }

  //更新枚举
  private static updateDictionaryEnumsUrl = DictionaryApi.urlPrefix + "base/dictionary/fieldenums/{id}";

  static async updateDictionaryEnums(vo: FieldEnumRequest, id: string): Promise<FieldEnumRequest> {
    const response = await axios.post<ApiResponse<FieldEnumRequest>>(this.updateDictionaryEnumsUrl.replace("{id}", id), vo);
    return response.data.data;
  }

  //删除枚举
  private static deleteDictionaryEnumsUrl = DictionaryApi.urlPrefix + "base/dictionary/fieldenums-all/{id}";

  static async deleteDictionaryEnums(id: string): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.deleteDictionaryEnumsUrl.replace("{id}", id));
    return response.data.data;
  }

  //查看枚举字段下面的枚举值
  private static getFieldEnumsByLetterNameURL = DictionaryApi.urlPrefix + "base/dictionary/fields/name/{letterName}/{level}/enums";

  static async getFieldEnumsByLetterName(letterName: string,level:string,vo:{}): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.getFieldEnumsByLetterNameURL.replace('{letterName}', letterName).replace('{level}',level),{params:vo});
    return response.data.data;
  }

  //数据导出导出
  private static exportFieldDataUrl = DictionaryApi.urlPrefix + "base/dictionary/enumDataExportExcel";

  static async exportFieldData(vo:any): Promise<Object> {
    const response = await axios.post<ApiResponse<Object>>(this.exportFieldDataUrl,vo,{responseType:'blob'});
    return response.data;
  }

  //查看枚举字段下面的枚举值
  private static getFieldSubTreeURL = DictionaryApi.urlPrefix + "base/dictionary/sync-fieldSubguid-tree/{id}/{subGuid}";

  static async getFieldSubTree(id: string,subGuid:string): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.getFieldSubTreeURL.replace('{id}', id).replace('{subGuid}',subGuid));
    return response.data.data;
  }

  //更新拖拽节点
  private static updateDicElmentSequenceUrl = DictionaryApi.urlPrefix + "base/dictionary/update-dicElment-sequence";

  static async updateDicElmentSequence(vo: any): Promise<any> {
    const response = await axios.post<ApiResponse<FieldEnumRequest>>(this.updateDicElmentSequenceUrl, vo);
    return response.data.data;
  }

  //根据subGuid和字段code获取枚举   GET  /base/dictionary/getEnumBySubGuidAndCode/{subGuid}/{fldLetterName}
  private static getEnumBySubGuidAndCodeURL = DictionaryApi.urlPrefix + "base/dictionary/getEnumBySubGuidAndCode/{subGuid}/{fldLetterName}";

  static async getEnumBySubGuidAndCode(subGuid: string,fldLetterName:string): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.getEnumBySubGuidAndCodeURL.replace('{subGuid}', subGuid).replace('{fldLetterName}',fldLetterName));
    return response.data.data;
  }

  //根据subGuid和字段code获取枚举   GET  /base/dictionary/getEnumBySubGuidAndCodeRecursive/{subGuid}/{fldLetterName}
  private static getEnumBySubGuidAndCodeRecursiveURL = DictionaryApi.urlPrefix + "base/dictionary/getEnumBySubGuidAndCodeRecursive/{subGuid}/{fldLetterName}";

  static async getEnumBySubGuidAndCodeRecursive(subGuid: string,fldLetterName:string): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.getEnumBySubGuidAndCodeRecursiveURL.replace('{subGuid}', subGuid).replace('{fldLetterName}',fldLetterName));
    return response.data.data;
  }

  //根据subGuid获取字段   GET /base/dictionary/getFieldExplains/{subGuid}
  private static getFieldExplainsURL = DictionaryApi.urlPrefix + "base/dictionary/getFieldExplains/{subGuid}";

  static async getFieldExplains(subGuid: string): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.getFieldExplainsURL.replace('{subGuid}', subGuid));
    return response.data.data;
  }
}
