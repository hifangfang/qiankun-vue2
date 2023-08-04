import axios from 'axios';
import MICRO_CONFIG from '../../platform-config';
import {Api_response} from '../../api_response';
import {CipherRequest, DepartmentRegisterForm, PersonRegisterForm} from "../model/register-model";

export class RegisterApi {
    //企业注册
    private static getdepartmentRegisterUrl = MICRO_CONFIG.identity + 'department-user/dregister-save';
    static async getdepartmentRegister(params:any): Promise<CipherRequest[]> {
    const response = await axios.post<Api_response<CipherRequest[]>> (this.getdepartmentRegisterUrl,params);
    return response.data.data;
    }

    //用户注册
    private static getuserRegisterUrl = MICRO_CONFIG.identity + 'department-user/register-user-save';
    static async getuserRegister(params:any): Promise<CipherRequest[]> {
    const response = await axios.post<Api_response<CipherRequest[]>> (this.getuserRegisterUrl,params);
    return response.data.data;
    }

    //获取企业类型
    private static getdepartmentTypeUrl = MICRO_CONFIG.identity + 'department-user/getDepartmentsByParentId/05a19c05-1ed7-11e9-9d7f-b0359f24ae97';
    static async getdepartmentType(): Promise<DepartmentRegisterForm[]> {
    const response = await axios.get<Api_response<DepartmentRegisterForm[]>> (this.getdepartmentTypeUrl);
    return response.data.data;
    }
    //获取企业分类下面的企业
    private static getdepartmentnameUrl = MICRO_CONFIG.identity + 'department-user/getDepartmentsByParentId/{departmentId}';
    static async getdepartmentname(departmentId:string): Promise<DepartmentRegisterForm[]> {
    const response = await axios.get<Api_response<DepartmentRegisterForm[]>> (this.getdepartmentnameUrl.replace('{departmentId}', departmentId));
    return response.data.data;
    }

    //获取个人企业分类下面的企业
    private static getpersonnameUrl = MICRO_CONFIG.identity + 'department-user/getDepartmentsByParentId/{departmentId}';
    static async getpersonname(departmentId:string): Promise<PersonRegisterForm[]> {
    const response = await axios.get<Api_response<PersonRegisterForm[]>> (this.getpersonnameUrl.replace('{departmentId}', departmentId));
    return response.data.data;
    }

    //企业名称是否已经存在
    private static getisDeptIdNumberExistInUrl = MICRO_CONFIG.identity + 'department-user/isDepartNameExistInTable?deptName={deptName}';
    static async getisDeptIdNumberExistIn(deptName:string): Promise<DepartmentRegisterForm[]> {
    const response = await axios.get<Api_response<DepartmentRegisterForm[]>> (this.getisDeptIdNumberExistInUrl.replace('{deptName}', deptName));
    return response.data.data;
    }

    //查看企业证件号是否已经存在
    private static getDepartmentIdNumExistsUrl = MICRO_CONFIG.identity + 'department-user/isDepartmentIdNumExist?idType={idType}&idNum={idNum}';
    static async getDepartmentIdNumExists(idType:string,idNum:any): Promise<DepartmentRegisterForm[]> {
    const response = await axios.get<Api_response<DepartmentRegisterForm[]>> (this.getDepartmentIdNumExistsUrl.replace('{idType}', idType).replace('{idNum}', idNum));
    return response.data.data;
    }

    //查看证件号是否已经存在
    private static getDepartmentIdNumExistUrl = MICRO_CONFIG.identity + 'department-user/isDepartmentIdNumExist?idType={idType}&idNum={idNum}';
    static async getDepartmentIdNumExist(idType:string,idNum:any): Promise<PersonRegisterForm[]> {
    const response = await axios.get<Api_response<PersonRegisterForm[]>> (this.getDepartmentIdNumExistUrl.replace('{idType}', idType).replace('{idNum}', idNum));
    return response.data.data;
    }

    //企业用户名是否存在
    private static getUserNameExistUrl = MICRO_CONFIG.identity + 'users/identity/isUserNameExistInTable/{userName}';
    static async getUserNameExist(userName:any): Promise<DepartmentRegisterForm[]> {
    const response = await axios.get<Api_response<DepartmentRegisterForm[]>> (this.getUserNameExistUrl.replace('{userName}', userName));
    return response.data.data;
    }

     //个人用户名是否存在
     private static getpresonUserNameExistUrl = MICRO_CONFIG.identity + 'users/identity/isUserNameExistInTable/{userName}';
     static async getpresonUserNameExist(userName:any): Promise<PersonRegisterForm[]> {
     const response = await axios.get<Api_response<PersonRegisterForm[]>> (this.getpresonUserNameExistUrl.replace('{userName}', userName));
     return response.data.data;
     }

    //获取枚举分组，枚举字段和枚举值
    private static getdictionaryUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.base:MICRO_CONFIG.platform )+ 'base/dictionary/sync-fieldgroup-tree/{fatherGroupId}/{fatherType}';
    static async getdictionary(fatherGroupId:string,fatherType:string): Promise<DepartmentRegisterForm[]> {
    const response = await axios.get<Api_response<DepartmentRegisterForm[]>> (this.getdictionaryUrl.replace('{fatherGroupId}', fatherGroupId).replace('{fatherType}', fatherType));
    return response.data.data;
    }


    //获取地区和用户中心
    private static getAllUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.base :MICRO_CONFIG.platform)+ 'base/dictionary/getFieldGroupByName/root/通用';
    static async getAll(): Promise<DepartmentRegisterForm[]> {
    const response = await axios.get<Api_response<DepartmentRegisterForm[]>> (this.getAllUrl);
    return response.data.data;
    }

    //获取地区
    private static getdiquUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.base :MICRO_CONFIG.platform) + 'base/dictionary/sync-fieldgroup-tree/{diquid}/{diqutype}';
    static async getdiqu(diquid:string,diqutype:string): Promise<DepartmentRegisterForm[]> {
    const response = await axios.get<Api_response<DepartmentRegisterForm[]>> (this.getdiquUrl.replace('{diquid}', diquid).replace('{diqutype}', diqutype));
    return response.data.data;
    }
    //获取个人地区
    private static getpersondiquUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.base :MICRO_CONFIG.platform) + 'base/dictionary/sync-fieldgroup-tree/{diquid}/{diqutype}';
    static async getpersondiqu(diquid:string,diqutype:string): Promise<PersonRegisterForm[]> {
    const response = await axios.get<Api_response<PersonRegisterForm[]>> (this.getpersondiquUrl.replace('{diquid}', diquid).replace('{diqutype}', diqutype));
    return response.data.data;
    }

    //获取用户中心
    private static getyhzxUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.base :MICRO_CONFIG.platform) + 'base/dictionary/sync-fieldgroup-tree/{yhzxid}/{yhzxtype}';
    static async getyhzx(yhzxid:any,yhzxtype:any): Promise<DepartmentRegisterForm[]> {
    const response = await axios.get<Api_response<DepartmentRegisterForm[]>> (this.getyhzxUrl.replace('{yhzxid}', yhzxid).replace('{yhzxtype}', yhzxtype));
    return response.data.data;
    }

    //获取省市县
    private static getProvinciascityUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.base :MICRO_CONFIG.platform) + 'base/dictionary/sync-fieldgroup-tree/{ssqid}/{ssqtype}';
    static async getProvinciascity(ssqid:string,ssqtype:string): Promise<DepartmentRegisterForm[]> {
    const response = await axios.get<Api_response<DepartmentRegisterForm[]>> (this.getProvinciascityUrl.replace('{ssqid}',ssqid).replace('{ssqtype}',ssqtype));
    return response.data.data;
    }

    //获取个人省市县
    private static getpersonProvinciascityUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.base :MICRO_CONFIG.platform) + 'base/dictionary/sync-fieldgroup-tree/{ssqid}/{ssqtype}';
    static async getpersonProvinciascity(ssqid:string,ssqtype:string): Promise<PersonRegisterForm[]> {
    const response = await axios.get<Api_response<PersonRegisterForm[]>> (this.getpersonProvinciascityUrl.replace('{ssqid}', ssqid).replace('{ssqtype}', ssqtype));
    return response.data.data;
    }



    //获取个人证件类型
    private static getpersondocumenetTypeUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.base :MICRO_CONFIG.platform) + 'base/dictionary/sync-fieldgroup-tree/{grzjid}/{grzjtype}';
    static async getpersondocumenetType(grzjid:string,grzjtype:string): Promise<PersonRegisterForm[]> {
    const response = await axios.get<Api_response<PersonRegisterForm[]>> (this.getpersondocumenetTypeUrl.replace('{grzjid}', grzjid).replace('{grzjtype}', grzjtype));
    return response.data.data;
    }

    //获取企业证件类型
    private static getdepartmentdocumenetTypeUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.base :MICRO_CONFIG.platform) + 'base/dictionary/sync-fieldgroup-tree/{qyzjid}/{qyzjtype}';
    static async getdepartmentdocumenetType(qyzjid:string,qyzjtype:string): Promise<DepartmentRegisterForm[]> {
    const response = await axios.get<Api_response<DepartmentRegisterForm[]>> (this.getdepartmentdocumenetTypeUrl.replace('{qyzjid}', qyzjid).replace('{qyzjtype}', qyzjtype));
    return response.data.data;
    }



    //获取省
    private static getProvinciasUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.base :MICRO_CONFIG.platform) + 'base/dictionary/sync-fieldgroup-tree/{sid}/{stype}';
    static async getProvincias(sid:string,stype:string): Promise<DepartmentRegisterForm[]> {
    const response = await axios.get<Api_response<DepartmentRegisterForm[]>> (this.getProvinciasUrl.replace('{sid}', sid).replace('{stype}', stype));
    return response.data.data;
    }

    //获取个人省
    private static getpersonProvinciasUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.base :MICRO_CONFIG.platform) + 'base/dictionary/sync-fieldgroup-tree/{sid}/{stype}';
    static async getpersonProvincias(sid:string,stype:string): Promise<PersonRegisterForm[]> {
    const response = await axios.get<Api_response<PersonRegisterForm[]>> (this.getpersonProvinciasUrl.replace('{sid}', sid).replace('{stype}', stype));
    return response.data.data;
    }


    //获取市
    private static getcityUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.base :MICRO_CONFIG.platform) + 'base/dictionary/sync-fieldgroup-tree/{cityid}/enumGroups';
    static async getcity(cityid:string): Promise<DepartmentRegisterForm[]> {
    const response = await axios.get<Api_response<DepartmentRegisterForm[]>> (this.getcityUrl.replace('{cityid}', cityid));
    return response.data.data;
    }

    //获取个人市
    private static getpesoncityUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.base :MICRO_CONFIG.platform) + 'base/dictionary/sync-fieldgroup-tree/{cityid}/enumGroups';
    static async getpesoncity(cityid:string): Promise<PersonRegisterForm[]> {
    const response = await axios.get<Api_response<PersonRegisterForm[]>> (this.getpesoncityUrl.replace('{cityid}', cityid));
    return response.data.data;
    }

    //获取区
    private static getcountryUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.base :MICRO_CONFIG.platform) + 'base/dictionary/sync-fieldgroup-tree/{countryid}/enumGroups';
    static async getcountry(countryid:string): Promise<DepartmentRegisterForm[]> {
    const response = await axios.get<Api_response<DepartmentRegisterForm[]>> (this.getcountryUrl.replace('{countryid}', countryid));
    return response.data.data;
    }

    //获取个人区
    private static getperosncountryUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.base :MICRO_CONFIG.platform)+ 'base/dictionary/sync-fieldgroup-tree/{countryid}/enumGroups';
    static async getperosncountry(countryid:string): Promise<PersonRegisterForm[]> {
    const response = await axios.get<Api_response<PersonRegisterForm[]>> (this.getperosncountryUrl.replace('{countryid}', countryid));
    return response.data.data;
    }

    //获取Rsa信息
    private static getRsadataUrl = MICRO_CONFIG.isNew?MICRO_CONFIG.identity + 'getRsaInform':MICRO_CONFIG.identity + 'department-user/getRsaInform';
    static async getRsadata(): Promise<DepartmentRegisterForm[]> {
    const response = await axios.get<Api_response<DepartmentRegisterForm[]>> (this.getRsadataUrl);
    return response.data.data;
    }




}
