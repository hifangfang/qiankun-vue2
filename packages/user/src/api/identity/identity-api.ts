import axios from 'axios';
import MICRO_CONFIG from '../platform_config';
import {ApiResponse} from '../api-response';
import {DepartmentUserInfo, DepartmentResponse, ExternalUserQuery,UpdateRequest, multipleDeptTreeVo,} from './identity-model';
import {
  SearchDeptUserVo,
  DepartmentRequest,
  DepartUsersSearchTreeAllVo,
  UserRequest,
  DepartmentVo,
  UserVo,
  UserExtVo,
  UserSyncRequest,
  ExternalUserVo, DragDeptAndUserSeqRequest, DepartUsersTreeAllVo
} from "./model/department-user-model";
import {PageVo, RoleTabQuery,checkMesageVo} from "@/api/identity/model/Rolemgr-model";

export class IdentityApi {
  //部门员工树 GET
  private static syncDepartmentsUserTreeUrl = MICRO_CONFIG.identity + "department-user/sync-departments-user-tree/{parentid}/{username}/{status}";

  static async syncDepartmentsUserTree(parentid: string, username: string, status: string,bindUserId?,id?):
    Promise<DepartmentUserInfo[]> {
    let url= this.syncDepartmentsUserTreeUrl.replace('{parentid}', parentid).replace('{username}', username)
      .replace('{status}', status)
    if(bindUserId){
      url=url+"?"+bindUserId+"="+id
    }
    const response = await axios.get<ApiResponse<DepartmentUserInfo[]>>(url);
    return response.data.data;
  }

  //发布弹窗下搜索区分机构和人的接口
  private static SearchDeptUserUrl = MICRO_CONFIG.identity + "department-user/search-dept-user/";
  static async SearchDeptUser(SearchDeptUserVo: SearchDeptUserVo): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(
      // this.SearchDeptUserUrl.replace("{searchName}",searchName)
      //   .replace("{type}",type)
      //   .replace("{subGuid}",subGuid)
      this.SearchDeptUserUrl,SearchDeptUserVo
    );
    return response.data.data;
  }

  //用户管理获取tree全部数据
  private static getUsersTreeAllUrl = MICRO_CONFIG.identity + "department-user/sync-departments-user-tree-all";

  static async getUsersTreeAllData(): Promise<DepartUsersTreeAllVo[]> {
    const response = await axios.get<ApiResponse<DepartUsersTreeAllVo[]>>(this.getUsersTreeAllUrl)
    return response.data.data;
  }
  // 用户管理搜索数据新接口
  // private static getUsersSearchTreeUrl = MICRO_CONFIG.identity + "department-user/sync-departments-user-tree-all/{key}";
  // static async getUsersSearchTree(key:string,system:any): Promise<DepartUsersSearchTreeAllVo[]> {
  //   const response = await axios.get<ApiResponse<DepartUsersSearchTreeAllVo[]>>(this.getUsersSearchTreeUrl.replace("{key}",key)+(system ==0?"?isOnlyInstitution=true":""));
  //   return response.data.data;
  // }
  //

  //用户管理搜索特殊字符报错新接口
  private static getUsersSearchTreeUrl = MICRO_CONFIG.identity + "department-user/sync-departments-user-tree-all-key?key={key}";
  static async getUsersSearchTree(key:string,system:any): Promise<DepartUsersSearchTreeAllVo[]> {
    const response = await axios.get<ApiResponse<DepartUsersSearchTreeAllVo[]>>(this.getUsersSearchTreeUrl.replace("{key}",key)+(system ==0?"&isOnlyInstitution=true":""));
    return response.data.data;
  }


  //根据部门id查询出下级部门数据 POST
  private static getDepartRootTabMessageUrl = MICRO_CONFIG.identity + "department-user/getDepartRootTabMessage";

  static async getDepartRootTabMessage(departmentRequest: DepartmentRequest): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.getDepartRootTabMessageUrl, departmentRequest);
    return response.data.data;
  }

  //加载根节点页面的用户数据 POST
  private static getUserRootTabMessageUrl = MICRO_CONFIG.identity + "users/getUserRootTabMessage";

  static async getUserRootTabMessage(userRequest: UserRequest): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.getUserRootTabMessageUrl, userRequest);
    return response.data.data;
  }

  //根据部门id获取部门信息(含父部门信息) GET
  private static getDepartmentUrl = MICRO_CONFIG.identity + "department-user/departmentsInfo/{deptId}";

  static async getDepartment(deptId: string): Promise<DepartmentVo> {
    const response = await axios.get<ApiResponse<DepartmentVo>>(this.getDepartmentUrl.replace("{deptId}", deptId));
    return response.data.data;
  }

  //根据部门id获取子机构列表 POST

  private static getDeptTabMessageUrl = MICRO_CONFIG.identity + "department-user/getDepartTabMessage/{departmentId}";

  static async getDeptTabMessage(departmentId: string, pageBreak: any): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.getDeptTabMessageUrl.replace("{departmentId}", departmentId), pageBreak);
    return response.data.data;
  }

  //根据组织机构id查询员工列表 POST
  private static getUserTabMessageUrl = MICRO_CONFIG.identity + "department-user/getUserTabMessage/{departmentId}";

  static async getUserTabMessage(departmentId: string, pageBreak: any): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.getUserTabMessageUrl.replace("{departmentId}", departmentId), pageBreak);
    return response.data.data;
  }

  //根据组织机构id查询角色列表 POST
  private static getDepartmentRoleTabMessageUrl = MICRO_CONFIG.identity + "department-user/getDepartmentRoleTabMessage/{deptId}";

  static async getDepartmentRoleTabMessage(deptId: string, pageBreak: any): Promise<any> {
    const response = await axios.post<ApiResponse<any[]>>(this.getDepartmentRoleTabMessageUrl.replace("{deptId}", deptId), pageBreak);
    return response.data.data;
  }

  //添加部门 POST
  private static addDepartmentUrl = MICRO_CONFIG.identity + "department-user/addDepartment";

  static async addDepartment(department: DepartmentVo): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.addDepartmentUrl, department);
    return response.data.data;
  }

  //删除部门 POST
  private static deleteSelectedDeptSUrl = MICRO_CONFIG.identity + "department-user/deleteSelectedDepts/{deptId}";

  static async deleteSelectedDepts(deptId: string, deptIds: string[]): Promise<any> {
    await axios.post<ApiResponse<any>>(this.deleteSelectedDeptSUrl.replace("{deptId}", deptId), deptIds);
  }

  //删除部门下关联用户 POST
  private static deleteSelectedUsersUrl = MICRO_CONFIG.identity + "users/deleteSelectedUsers/{departId}";

  static async deleteSelectedUsers(departId: string, userIds: any[]): Promise<any> {
    await axios.post<ApiResponse<any>>(this.deleteSelectedUsersUrl.replace("{departId}", departId), userIds);
  }

  //删除部门和默认角色关联关系(单个删除)
  private static deleteDepartmentRoleRightUrl = MICRO_CONFIG.identity + "department-user/deleteDepartmentRoleRight/{deptId}/{roleId}";

  static async deleteDepartmentRoleRight(deptId: string, roleId: string): Promise<any> {
    await axios.post<ApiResponse<any>>(this.deleteDepartmentRoleRightUrl
      .replace("{deptId}", deptId)
      .replace("{roleId}", roleId));
  }

  //删除部门和默认角色关联关系(批量删除)
  private static deleteSelectedDepartmentRolesUrl = MICRO_CONFIG.identity + "department-user/deleteSelectedDepartmentRoles/{deptId}";

  static async deleteSelectedDepartmentRoles(deptId: string, roleids: string[]): Promise<any> {
    await axios.post<ApiResponse<any>>(this.deleteSelectedDepartmentRolesUrl.replace("{deptId}", deptId), roleids)
  }

  //部门添加角色
  private static addDepartmentRoleUrl = MICRO_CONFIG.identity + "department-user/addDepartmentRole/{deptId}";

  static async addDepartmentRole(deptId: string, deptRoleRequestVo: any): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.addDepartmentRoleUrl.replace("{deptId}", deptId), deptRoleRequestVo);
    return response.data.data;
  }

  //部门添加用户
  private static establishRelationshipOnDeptUserUrl = MICRO_CONFIG.identity + "department-user/establishRelationshipOnDeptUsers/{deptId}";

  static async establishRelationshipOnDeptUser(deptId: string, deptUserRequestVo: any): Promise<any> {
    await axios.post<ApiResponse<any>>(this.establishRelationshipOnDeptUserUrl.replace("{deptId}", deptId), deptUserRequestVo);
  }

  //删除部门
  private static deleteDeptAdjustChildUrl = MICRO_CONFIG.identity + "department-user/deleteDeptAdjustChild/{id}/{pid}";

  static async deleteDeptAdjustChild(id: string, pid: string): Promise<any> {
    await axios.get<ApiResponse<any>>(this.deleteDeptAdjustChildUrl.replace("{id}", id).replace("{pid}", pid));
  }

  //调整机构Tree
  private static getIdentityTreeNotIncludeMyselfAndChildUrl = MICRO_CONFIG.identity + "department-user/identity-tree-notself-notchild/{deptId}/{filterid}/{status}";

  static async getIdentityTreeNotIncludeMyselfAndChild(deptId: string, filterid: string, status: string): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.getIdentityTreeNotIncludeMyselfAndChildUrl
      .replace("{deptId}", deptId)
      .replace("{filterid}", filterid)
      .replace("{status}", status));
    return response.data.data;
  }

  //添加用户 POST
  private static userSaveUrl = MICRO_CONFIG.identity + "users/addUser";

  static async addUser(userForm: UserVo): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.userSaveUrl, userForm);
    return response.data;
  }

  //用户同步 POST
  private static userSyncUrl = MICRO_CONFIG.identity + "sync/userSync";

  static async userSync(syncRequest: UserSyncRequest): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.userSyncUrl, syncRequest);
    return response.data;
  }

  //根据用户id获取用户信息(不包含部门信息)
  private static getByIdUserUrl = MICRO_CONFIG.identity + "users/getByIdUser/{id}";

  static async getByIdUser(id: string): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.getByIdUserUrl.replace("{id}", id));
    return response.data.data;
  }

  //根据用户id获取用户信息(含部门信息)
  private static getByIdUserDepartmentsUrl = MICRO_CONFIG.identity + "users/getByIdUserDepartments/{userId}";

  static async getByIdUserDepartments(userId: string): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.getByIdUserDepartmentsUrl.replace("{userId}", userId));
    return response.data.data;
  }

  //更新用户信息 POST
  private static byIdupdateUserUrl = MICRO_CONFIG.identity + "users/byIdupdateUser/{id}";

  static async byIdupdateUser(id: string, obj: any): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.byIdupdateUserUrl.replace("{id}", id), obj);
    return response.data.data;
  }

  //初始化用户角色列表
  private static getRoleTabMessageUrl = MICRO_CONFIG.identity + "users/getRoleTabMessage/{userId}";

  static async getRoleTabMessage(userId: string, pageBreak: any) {
    const response = await axios.post<ApiResponse<any>>(this.getRoleTabMessageUrl.replace("{userId}", userId), pageBreak);
    return response.data.data;
  }

  //删除用户角色
  private static deleteSelectedRolesUrl = MICRO_CONFIG.identity + "users/deleteSelectedRoles/{userid}";

  static async deleteSelectedRoles(userid: string, roles: any[]): Promise<any> {
    await axios.post<ApiResponse<any>>(this.deleteSelectedRolesUrl.replace("{userid}", userid), roles);
  }

  //增加用户扩展信息
  private static addUserextUrl = MICRO_CONFIG.identity + "users/addUserext";

  static async addUserext(userext: UserExtVo): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.addUserextUrl, userext);
    return response.data.data;
  }

  //根据用户id获取用户扩展信息
  private static getByIdUserExtUrl = MICRO_CONFIG.identity + "users/getByIdUserExt/{id}";

  static async getByIdUserExt(id: string): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.getByIdUserExtUrl.replace("{id}", id));
    return response.data.data;
  }


  //根据用户id获取用户扩展信息包括下拉框值等条件
  private static getUserExtWithConditionUrl = MICRO_CONFIG.identity + "users/getUserExtWithCondition/{id}";

  static async getUserExtWithCondition(id: string): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.getUserExtWithConditionUrl.replace("{id}", id));
    return response.data.data;
  }

  //密码重置
  private static resetPwdUrl = MICRO_CONFIG.identity + "users/resetPwd/{id}";

  static async resetPwd(id: string) {
    await axios.get<ApiResponse<any>>(this.resetPwdUrl.replace("{id}", id));
  }

  private static resetSM3pwdUrl = MICRO_CONFIG.identity + "base/updateSM3Password";

  static async resetSM3pwd(vo: any): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.resetSM3pwdUrl, vo);
    return response.data.data;
  }

  //判断该用户是否办理过环节或者是下个环节办理人员
  private static hasTaskInstanceUrl = MICRO_CONFIG.identity + "users/hasTaskInstance/{userId}";

  static async hasTaskInstance(userId: string): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.hasTaskInstanceUrl.replace("{userId}", userId));
    return response.data.data;
  }

  //删除用户
  private static userDeleteUrl = MICRO_CONFIG.identity + "users/user-delete/{userId}";

  static async userDelete(userId: string): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.userDeleteUrl.replace("{userId}", userId));
    return response.data.data;
  }

  //********************************************外部用户开始****************************************************
  //查询外部用户
  private static getExternalUserTableUrl = MICRO_CONFIG.identity + "base/identity/userouters";

  static async getExternalUserTable(vo: ExternalUserQuery): Promise<PageVo> {
    const response = await axios.get<ApiResponse<PageVo>>(this.getExternalUserTableUrl, {params: vo});
    return response.data.data;
  }

  //获取公钥和私钥
  private static getKeysUrl = MICRO_CONFIG.identity + "base/identity/userouters/getKeys";

  static async getKeys(): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.getKeysUrl);
    return response.data.data;
  }

  //新增外部用户
  private static addExternalUserUrl = MICRO_CONFIG.identity + "base/identity/userouters";

  static async addExternalUser(vo: ExternalUserVo): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.addExternalUserUrl, vo);
    return response.data.data;
  }

  //修改外部用户
  private static updateExternalUserUrl = MICRO_CONFIG.identity + "base/identity/userouters/{id}";

  static async updateExternalUser(id: string, vo: ExternalUserVo): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.updateExternalUserUrl.replace("{id}", id), vo);
    return response.data.data;
  }

  //删除外部用户
  private static deleteExternalUserUrl = MICRO_CONFIG.identity + "base/identity/delete-userouters/{id}";

  static async deleteExternalUser(id: string): Promise<string> {
    const response = await axios.get<ApiResponse<string>>(this.deleteExternalUserUrl.replace("{id}", id));
    return response.data.data;
  }

  //批量删除外部用户
  private static batchDeleteExternalUserUrl = MICRO_CONFIG.identity + "base/identity/userouters/deleteUserOuterSome";

  static async batchDeleteExternalUser(vo: string[]): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.batchDeleteExternalUserUrl, vo);
    return response.data.data;
  }

  //根据ID查询当个外部用户
  private static getExternalUserByIdUrl = MICRO_CONFIG.identity + "base/identity/userouters/{id}";

  static async getExternalUserById(id: string): Promise<ExternalUserVo> {
    const response = await axios.get<ApiResponse<ExternalUserVo>>(this.getExternalUserByIdUrl.replace("{id}", id));
    return response.data.data;
  }

  //判断外部用户名是否重名
  private static isExternalUserNameExistUrl = MICRO_CONFIG.identity + "base/identity/userouters/selectUserByName/{username}";

  static async isExternalUserNameExist(username: string): Promise<boolean> {
    const response = await axios.get<ApiResponse<boolean>>(this.isExternalUserNameExistUrl.replace("{username}", username));
    return response.data.data;
  }

  // 添加部门树
  private static getMultipleDeptUrl = MICRO_CONFIG.identity + "base/identity/selectMultipleDept/{id}/{currentUserName}/{status}";

  static async getMultipleDept(id: string, currentUserName: string, status: string): Promise<multipleDeptTreeVo[]> {
    const response = await axios.get<ApiResponse<multipleDeptTreeVo[]>>(this.getMultipleDeptUrl.replace("{id}", id).replace("{currentUserName}", currentUserName).replace("{status}", status));
    return response.data.data;
  }

  // 添加部门树
  private static selectOuterDeptUrl = MICRO_CONFIG.identity + "base/identity/selectOuterDept";

  static async selectOuterDept(vo): Promise<multipleDeptTreeVo[]> {
    const response = await axios.post<ApiResponse<multipleDeptTreeVo[]>>(this.selectOuterDeptUrl,vo);
    return response.data.data;
  }

  //根据部门ID获取部门信息
  private static getDeptInfoByIdUrl = MICRO_CONFIG.identity + "base/identity/departments/{id}";

  static async getDeptInfoById(id: string): Promise<DepartmentVo> {
    const response = await axios.get<ApiResponse<DepartmentVo>>(this.getDeptInfoByIdUrl.replace("{id}", id));
    return response.data.data;
  }

  //查询该用户名在全表中是否存在
  private static isUserNameExistUrl = MICRO_CONFIG.identity + "users/identity/isUserNameExistInTable/{userName}";

  static async isUserNameExist(userName: string): Promise<boolean> {
    const response = await axios.get<ApiResponse<boolean>>(this.isUserNameExistUrl.replace("{userName}", userName));
    return response.data.data;
  }

  //查询该手机号在全表中是否存在
  private static isTelephoneExistUrl = MICRO_CONFIG.identity + "users/identity/isTelephoneExistInTable/{telephone}";

  static async isTelephoneExist(telephone: string): Promise<boolean> {
    const response = await axios.get<ApiResponse<boolean>>(this.isTelephoneExistUrl.replace("{telephone}", telephone));
    return response.data.data;
  }

  //判断部门名称在某个节点下是否重名
  private static isDeptNameExistUrl = MICRO_CONFIG.identity + "base/identity/isDeptNameExist/{parentDeptId}/{deptName}";

  static async isDeptNameExist(parentDeptId: string, deptName: string): Promise<boolean> {
    const response = await axios.get<ApiResponse<boolean>>(this.isDeptNameExistUrl.replace('{parentDeptId}', parentDeptId).replace('{deptName}',deptName));
    return response.data.data;
  }

  //校验行政区编码
  private static isXzqbmDifferentUrl = MICRO_CONFIG.identity + "base/identity/isXzqbmDifferent/{deptId}/{xzqbmName}";

  static async isXzqbmDifferent(deptId: string, xzqbmName: string): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.isXzqbmDifferentUrl.replace("{deptId}", deptId).replace('{xzqbmName}',xzqbmName));
    return response.data.data;
  }

  //校验行政区编码
  private static isXzqbmVerifyUrl = MICRO_CONFIG.identity + "base/identity/verifyXzq";

  static async isXzqbmVerify(): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.isXzqbmVerifyUrl);
    return response.data.data;
  }

  //保存机构调整
  private static adjustDepartmentUrl = MICRO_CONFIG.identity + "base/identity/adjustDepartment/{id}/{relpid}";

  static async adjustDepartment(id: string, relpid: string): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.adjustDepartmentUrl.replace("{id}", id).replace('{relpid}',relpid));
    return response.data.data;
  }


   //checkOldPs
  private static getcheckPsUrl = (MICRO_CONFIG.isNew ? MICRO_CONFIG.identity : MICRO_CONFIG.platform) + "base/checkPastPwd";

   static async getcheckPastPwd(updateRequest: UpdateRequest): Promise<Boolean> {

     const response = await axios.post<ApiResponse<Boolean>>(this.getcheckPsUrl,updateRequest);
     return response.data.data;
   }


   //updatePwd
  private static getupdatePwdUrl = (MICRO_CONFIG.isNew ? MICRO_CONFIG.identity : MICRO_CONFIG.platform) + "base/update-password";

   static async updatePwd(updateRequest: UpdateRequest): Promise<Boolean> {
     const response = await axios.post<ApiResponse<Boolean>>(this.getupdatePwdUrl,updateRequest);
     return response.data.data;
   }


  private static getpwdCheckUrl = (MICRO_CONFIG.isNew ? MICRO_CONFIG.identity : MICRO_CONFIG.platform) + "base/passWordCheck";
   static async pwdCheck(): Promise<any> {
     const response = await axios.get<ApiResponse<any>>(this.getpwdCheckUrl);
     return response.data.data;
   }


  //拖拽部门
  private static dragDeptSequenceUrl = MICRO_CONFIG.identity + "base/identity/updateDeptSequence";

  static async dragDeptSequence(vo: DragDeptAndUserSeqRequest): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.dragDeptSequenceUrl, vo);
    return response.data.data;
  }

  //拖拽用户
  private static dragUserSequenceUrl = MICRO_CONFIG.identity + "department-user/identity/updateUserSequence";

  static async dragUserSequence(vo: DragDeptAndUserSeqRequest): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.dragUserSequenceUrl, vo);
    return response.data.data;
  }

  //查询安全审计日志
  private static getSecureAuditLogUrl = MICRO_CONFIG.identity + "logmgr/getSecureAuditLog";

  static async getSecureAuditLog(params: any): Promise<PageVo> {
    const response = await axios.get<ApiResponse<PageVo>>(this.getSecureAuditLogUrl, {params: params});
    return response.data.data;
  }

  //根据 uuid 查询链路日志traceId
  private static getSecureTraceIdUrl = MICRO_CONFIG.identity + "logmgr/getTraceId";

  static async getSecureTraceId(params: any): Promise<any> {
    const response = await axios.get<ApiResponse<PageVo>>(this.getSecureTraceIdUrl, {params: params});
    return response.data.data;
  }

  // 根据traceId 获取详细信息
  private static getSecureTraceIdInfoUrl = MICRO_CONFIG.zipKinRequestUrl

  static async getSecureTraceIdInfo(params: any): Promise<any> {
    const response = await axios.get<ApiResponse<PageVo>>(this.getSecureTraceIdInfoUrl + params.traceId);
    return response.data;
  }

  // 安全审计日志导出
  private static getSecureAuditLogExportUrl = MICRO_CONFIG.identity + "logmgr/getSecureAuditLogExport";
  static async getSecureAuditLogExport(params:any): Promise<Object>{
    const response = await axios.post<ApiResponse<Object>>(this.getSecureAuditLogExportUrl,params,{responseType:'blob'});
    return response.data;
  }

  // 安全审计日志获取模块列表
  private static getModuleControllerListUrl = MICRO_CONFIG.identity + "logmgr/getModuleControllerList";
  static async  getModuleControllerList(): Promise<any>{
    const response = await axios.get<ApiResponse<any>>(this.getModuleControllerListUrl);
    return response.data.data;
  }

  //安全审计日志保存（登录）
  private static saveLoginAuditLogUrl = MICRO_CONFIG.identity + "logmgr/saveLoginAuditLog";
  static async saveLoginAuditLog(type:string, message:string): Promise<Boolean> {
    const response = await axios.get<ApiResponse<Boolean>>(this.saveLoginAuditLogUrl+"?type="+type+"&message="+message);
    return response.data.data;
  }

  //部门用户导出
  private static exportDeptUserUrl = MICRO_CONFIG.identity + "department-user/exportDeptUserExcel/{departmentId}";

  static async exportDeptUser(departmentId:string): Promise<Object> {
    const response = await axios.get<ApiResponse<Object>>(this.exportDeptUserUrl.replace('{departmentId}',departmentId),{responseType:'blob'});
    return response.data;
  }

  //数据同步
  private static pullDataUrl = MICRO_CONFIG.identity + "zzding/pullData";

  static async pullData(): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.pullDataUrl);
    return response.data;
  }

  //通过匹配联系电话从浙政钉同步员工信息
  private static syncDingEmployeeByMobileUrl = MICRO_CONFIG.identity + "thirdparty/ding/syncDingEmployeeByMobile";

  static async syncDingEmployeeByMobile(user:UserVo): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.syncDingEmployeeByMobileUrl, user);
    return response.data;
  }


  //通过匹配联系电话从政务钉钉同步员工信息
  private static unbindDingEmployeeByUserIdUrl = MICRO_CONFIG.identity + "thirdparty/ding/unbindDingEmployeeByUserId/{userId}";

  static async unbindDingEmployeeByUserId(userId:string): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(this.unbindDingEmployeeByUserIdUrl.replace("{userId}",userId));
    return response.data;
  }



  //短信发送日志功能中短信查询
  private static checkMessageUrl = MICRO_CONFIG.identity + "logmgr/getMsgSecureAuditLog";

  static async checkMessage(vo:any): Promise<checkMesageVo> {
    const response = await axios.post<ApiResponse<checkMesageVo>>(this.checkMessageUrl,vo);
    return response.data.data;
  }
//   获取用户管理-角色列表添加角色
  private static catchAssignableRolesForUserUrl = MICRO_CONFIG.identity + "users/identity/catchAssignableRolesForUser/{userId}/{groupid}/{type}/{subGuid}";
  static async catchAssignableRolesForUser(userId,groupid,type,subGuid): Promise<string> {
    let url=this.catchAssignableRolesForUserUrl.replace("{userId}",userId).replace("{groupid}",groupid).replace("{type}",type).replace("{subGuid}",subGuid)
    const response = await axios.get<ApiResponse<string>>(url);
    return response.data.data;
  }

  //用户管理过滤角色适配机构
  private static catchAssignableDeptForUserUrl = MICRO_CONFIG.identity + "users/identity/catchAssignableRolesForDept/{deptId}/{groupid}/{type}/{subGuid}";
  static async catchAssignableDeptForUser(deptId,groupid,type,subGuid): Promise<string> {
    let url=this.catchAssignableDeptForUserUrl.replace("{deptId}",deptId).replace("{groupid}",groupid).replace("{type}",type).replace("{subGuid}",subGuid)
    const response = await axios.get<ApiResponse<string>>(url);
    return response.data.data;
  }

//   获取当前操作用户没有的角色接口
  private static getUnOperateRoleUrl = MICRO_CONFIG.identity + "base/rolemgr/unOperateRole";
  static async getUnOperateRole(vo:any): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.getUnOperateRoleUrl,vo);
    return response.data.data;
  }

  //   获取当前操作用户没有的角色接口
  private static allowDeleteBingUrl = MICRO_CONFIG.identity + "users/allowDeleteBing/{username}";
  static async allowDeleteBing(username:string): Promise<string> {
    const response = await axios.get<ApiResponse<string>>(this.allowDeleteBingUrl.replace('{username}',username));
    return response.data.data;
  }


 //wxy 20220607一键排序
 private static oneClickSortUrl = MICRO_CONFIG.identity + "department-user/oneClickSort";
 static async oneClickSort(){
   const response = await axios.get<ApiResponse<string>>(this.oneClickSortUrl);
   return response.data.data;
 }
//根据父机构id查询下面所有的子机构和子机构下面的子机构
  private static getIterateDeptEthnicGroupUrl = MICRO_CONFIG.identity + "department-user/iterateDeptEthnicGroup/{depId}";
  static async getIterateDeptEthnicGroup(depId){
    let  url=this.getIterateDeptEthnicGroupUrl.replace("{depId}",depId)
    const response = await axios.get<ApiResponse<string>>(url);
    return response.data.data;
  }

  //判断浙政钉是否绑定用户
  private static checkBindUrl = MICRO_CONFIG.identity + "thirdparty/ding/checkUserInfoOfMobileBind";
  static async checkBind(mobile:string, userId:string): Promise<Boolean> {
    const response = await axios.get<ApiResponse<Boolean>>(this.checkBindUrl+"?mobile="+mobile+"&userId="+userId);
    return response.data.data;
  }

  //解绑浙政钉用户
  private static unBindUrl = MICRO_CONFIG.identity + "thirdparty/ding/unbindDingEmployeeByUserId/{userId}";
  static async unBind( userId:string): Promise<Boolean> {
    const response = await axios.get<ApiResponse<Boolean>>(this.unBindUrl.replace('{userId}',userId)+'?isClearMobile='+'true');
    return response.data.data;
  }

  //检查指定手机号关联的浙政钉ID被其他哪些用户绑定过
  private static checkUserBindUrl = MICRO_CONFIG.identity + "thirdparty/ding/checkUserBindInfoOfDingMobile";
  static async checkUserBind( mobile:string, userId:string): Promise<any> {
    const response = await axios.get<ApiResponse<Boolean>>(this.checkUserBindUrl+"?mobile="+mobile+"&userId="+userId);
    return response.data.data;
  }


  //菜单，应用越权
  private static checkViewUrlPrivalige = MICRO_CONFIG.identity+"/users/identity/checkViewUrlPrivalige/{userId}/{subGuids}";
  static async checkViewPrivalige(userId,subGuids): Promise<String> {
    const response = await axios.get<ApiResponse<String>>(this.checkViewUrlPrivalige.replace('{userId}',userId).replace("{subGuids}",subGuids));
    return response.data.data;
  }
  //根据子系统id 获取登录用户相关的密码验证信息
  private static getLoginUserPlatInfoUrl = MICRO_CONFIG.identity + "getLoginUserPlatInfo/{type}/{subGuid}";
  static async getLoginUserPlatInfo(type:string,subGuid: string) {
    const response = await axios.get<ApiResponse<any>>(this.getLoginUserPlatInfoUrl.replace("{type}", type).replace("{subGuid}", subGuid));
    return response.data.data;
  }
  //根据子系统id 获取登录用户相关的密码验证信息
  private static getByIdUnencryptUserAndExtUrl = MICRO_CONFIG.identity + "users/getByIdUnencryptUserAndExt/{userId}";
  static async getByIdUnencryptUserAndExt(userId) {
    const response = await axios.get<ApiResponse<any>>(this.getByIdUnencryptUserAndExtUrl.replace("{userId}", userId));
    return response.data.data;
  }
  // 获取platform的配置属性
  static async getPlatformConfig() {
    const response = await axios.get<ApiResponse<any>>(MICRO_CONFIG.base + 'selfconfig/getFrontConfigs/platform');
    return response.data.data;
  }
}




