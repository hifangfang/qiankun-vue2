import axios from 'axios';
import MICRO_CONFIG from '../../platform_config';
import {ApiResponse} from '../../api-response';
import {
  PageVo,
  RoleTabTreeVo,
  RoleGroupTableQuery,
  RoleGroupVo, RoleSelectTreeVo,
  RolemgrLeftTreeVo,
  RoleTableQuery,
  RoleTabQuery,
  RoleUserVo,
  RoleVo,
  RoleUseDefinePriVo,
  adjustRolesGroupOrRoleVo,
  funcPriQuery,
  funcPriVo,
  QueryTaskVo,
  ProcessDefinitionVo,
  CopyUserRoleVo,
  RolemgrTreeVo,
  updateRoleGroupSequenceVo,
  roleProcdeQuery,
  RoleIdsMenuIdsVo
} from "@/api/identity/model/Rolemgr-model";
import {RoleAllocateVo} from "@/api/identity/model/Rolemgr-model";
import {FuncGroupBaseVO} from "@/api/base/model/Fungroup-item-model";
import { KeyvalueMenuVo, KeyvalueProperty, KeyvalueVo } from '@/api/base/model/Keyvalue-model';

export class RolemgrApi {

  //角色管理侧边栏Tree
  private static getRolemgrLeftTreeUrl = MICRO_CONFIG.identity + "base/rolemgr/sync-roles-group-tree/{groupid}/{type}/{subGuid}";

  static async getRolemgrLeftTree(groupid: string, type: string, subGuid: any): Promise<RolemgrLeftTreeVo[]> {
    const response = await axios.get<ApiResponse<RolemgrLeftTreeVo[]>>
    (this.getRolemgrLeftTreeUrl.replace('{groupid}', groupid).replace('{type}', type).replace('{subGuid}', subGuid));
    return response.data.data;
  }

  //角色管理获取tree全部数据
  // private static getTreeAllUrl = MICRO_CONFIG.identity + "base/rolemgr/sync-roles-group-tree-all/{subGuid}";
  //
  // static async getTreeAllData(subGuid:any): Promise<RolemgrTreeAllVo[]> {
  //   const response = await axios.get<ApiResponse<RolemgrTreeAllVo[]>>
  //   (this.getTreeAllUrl.replace('{subGuid}',subGuid));
  //   return response.data.data;
  // }

  //角色管理 新接口
  private static syncRolesGroupTreeUrl = MICRO_CONFIG.identity + "base/rolemgr/sync-roles-group-tree/{groupId}/{type}/{subGuid}";

  static async syncRolesGroupTree(groupId: string, type: string, subGuid: any): Promise<RolemgrTreeVo[]> {
    const response = await axios.get<ApiResponse<RolemgrTreeVo[]>>
    (this.syncRolesGroupTreeUrl.replace('{groupId}', groupId).replace('{type}', type).replace('{subGuid}', subGuid));
    return response.data.data;
  }


//角色管理搜索数据新接口
  private static getTreeSearchUrl = MICRO_CONFIG.identity + "base/rolemgr/sync-roles-group-tree-all/{subGuid}/{key}";

  static async getRoleTreeAllData(key:string,subGuid:any): Promise<RolemgrTreeVo[]> {
    const response = await axios.get<ApiResponse<RolemgrTreeVo[]>>
    (this.getTreeSearchUrl.replace('{subGuid}', subGuid).replace('{key}', key));
    return response.data.data;
  }

  //角色管理选择框树
  private static getRoleSelectTreeUrl = MICRO_CONFIG.identity + "base/rolemgr/getRolesGroupTree/{groupid}/{type}/{subGuid}";

  static async getRoleSelectTree(groupid: string, type: string, subGuid: string,bindRoleId?,id?): Promise<RoleSelectTreeVo[]> {
    let url=this.getRoleSelectTreeUrl.replace('{groupid}', groupid).replace('{type}', type).replace('{subGuid}',subGuid)
    if(bindRoleId){
      url=url+"?"+bindRoleId+"="+id
    }
    const response = await axios.get<ApiResponse<RoleSelectTreeVo[]>>(url);
    return response.data.data;
  }

  //查询角色组信息
  private static getRoleGroupUrl = MICRO_CONFIG.identity + "base/rolemgr/roles-group-info/{id}";

  static async getRoleGroupById(id: string): Promise<RoleGroupVo> {
    const response = await axios.get<ApiResponse<RoleGroupVo>>
    (this.getRoleGroupUrl.replace('{id}', id));
    return response.data.data;
  }

  // 新增角色组
  private static addRoleGroupUrl = MICRO_CONFIG.identity + "base/rolemgr/rolegroups";

  static async addRoleGroup(vo: RoleGroupVo): Promise<RoleGroupVo> {
    const response = await axios.post<ApiResponse<RoleGroupVo>>(this.addRoleGroupUrl, vo);
    return response.data.data;
  }

  // 修改角色组
  private static updateRoleGroupUrl = MICRO_CONFIG.identity + "base/rolemgr/rolegroups/{id}";

  static async updateRoleGroup(id: string, vo: RoleGroupVo): Promise<RoleGroupVo> {
    const response = await axios.post<ApiResponse<RoleGroupVo>>(this.updateRoleGroupUrl.replace('{id}', id), vo);
    return response.data.data;
  }

  // 查询角色组列表
  private static getRoleGroupTableUrl = MICRO_CONFIG.identity + "base/rolemgr/get-all-rolegroups";

  static async getRoleGroupTable(vo: RoleGroupTableQuery): Promise<PageVo> {
    const response = await axios.post<ApiResponse<PageVo>>(this.getRoleGroupTableUrl, vo);
    return response.data.data;
  }

  //通过角色组id获取角色组下所有的角色id
  private static getAllRoldIdByGroupIdUrl = MICRO_CONFIG.identity + "base/rolemgr/get-allroleidlist-bygroupid";

  static async getAllRoldIdByGroupId(vo: string[]): Promise<[]> {
    const response = await axios.post<ApiResponse<[]>>(this.getAllRoldIdByGroupIdUrl, vo);
    return response.data.data;
  }

  //删除角色组
  private static deleteRoleGroupUrl = MICRO_CONFIG.identity + "base/rolemgr/delete-rolegroups/{id}";

  static async deleteRoleGroupById(id: string): Promise<RoleGroupVo> {
    const response = await axios.get<ApiResponse<RoleGroupVo>>
    (this.deleteRoleGroupUrl.replace('{id}', id));
    return response.data.data;
  }

  // 通过角色组id获取角色组下所有的角色集合(包括角色组名称)
  private static getRoleTableUrl = MICRO_CONFIG.identity + "base/rolemgr/get-roles-down-somegroup";

  static async getRoleTable(vo: RoleTableQuery): Promise<PageVo> {
    const response = await axios.post<ApiResponse<PageVo>>(this.getRoleTableUrl, vo);
    return response.data.data;
  }

  //查询角色信息
  private static getRoleUrl = MICRO_CONFIG.identity + "base/rolemgr/role-info/{roleid}";

  static async getRoleById(id: string): Promise<RoleVo> {
    const response = await axios.get<ApiResponse<RoleVo>>
    (this.getRoleUrl.replace('{roleid}', id));
    return response.data.data;
  }
  //根据角色IDs查询多个角色信息
  private static getRoleInfoListUrl = MICRO_CONFIG.identity + "base/rolemgr/getRoleInfoList";

  static async getRoleInfoList(ids: string[]): Promise<RoleVo[]> {
    const response = await axios.post<ApiResponse<RoleVo[]>>
    (this.getRoleInfoListUrl,ids);
    return response.data.data;
  }

  // 新增角色
  private static addRoleUrl = MICRO_CONFIG.identity + "base/rolemgr/roles-save";

  static async addRole(vo: RoleVo): Promise<RoleVo> {
    const response = await axios.post<ApiResponse<RoleVo>>(this.addRoleUrl, vo);
    return response.data.data;
  }

  // 修改角色
  private static updateRoleUrl = MICRO_CONFIG.identity + "base/rolemgr/roles-save/{id}";

  static async updateRole(id: string, vo: RoleVo): Promise<RoleVo> {
    const response = await axios.post<ApiResponse<RoleVo>>(this.updateRoleUrl.replace('{id}', id), vo);
    return response.data.data;
  }

  // 查询角色下的成员列表
  private static getRoleMemberTableUrl = MICRO_CONFIG.identity + "base/rolemgr/getAllUsersByRoleIdSort";

  static async getRoleMemberTable(vo: RoleTabQuery): Promise<PageVo> {
    const response = await axios.post<ApiResponse<PageVo>>(this.getRoleMemberTableUrl, vo);
    return response.data.data;
  }

  // 删除一个或者多个成员(角色Tab)
  private static batchDeleteRoleUsersUrl = MICRO_CONFIG.identity + "base/rolemgr/deleteUsersList";

  static async batchDeleteRoleUser(vo: string[]): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.batchDeleteRoleUsersUrl, vo);
    return response.data.data;
  }

  // 查询角色下的菜单权限列表
  private static getRoleFuncPriTableUrl = MICRO_CONFIG.identity + "base/rightsmgr/getRolePriByRoleId";

  static async getRoleFuncPriTable(vo: RoleTabQuery): Promise<PageVo> {
    const response = await axios.post<ApiResponse<PageVo>>(this.getRoleFuncPriTableUrl, vo);
    return response.data.data;
  }

  // 删除一个或者多个菜单权限(角色Tab)
  private static batchDeleteRoleFuncPriUrl = MICRO_CONFIG.identity + "base/rightsmgr/deleteFuncPriList";

  static async batchDeleteRoleFuncPri(vo: string[]): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.batchDeleteRoleFuncPriUrl, vo);
    return response.data.data;
  }

  // 查询角色下的自定义权限列表
  private static getCustomizePriTableUrl = MICRO_CONFIG.identity + "base/rightsmgr/role-userdefine-pri-grid";

  static async getCustomizePriTable(vo: RoleTabQuery): Promise<PageVo> {
    const response = await axios.post<ApiResponse<PageVo>>(this.getCustomizePriTableUrl, vo);
    return response.data.data;
  }

  // 删除一个或者多个菜单权限(角色Tab)
  private static batchDeleteCustomizePriUrl = MICRO_CONFIG.identity + "base/rightsmgr/delete-usedefinePri-list";

  static async batchDeleteCustomizePri(vo: string[]): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.batchDeleteCustomizePriUrl, vo);
    return response.data.data;
  }

  // 查询角色下的自定义权限列表
  private static getAssignableRoleTableUrl = MICRO_CONFIG.identity + "base/roleallocate/find-role-allocates";

  static async getAssignableRoleTable(vo: RoleTabQuery): Promise<PageVo> {
    const response = await axios.post<ApiResponse<PageVo>>(this.getAssignableRoleTableUrl, vo);
    return response.data.data;
  }

  // 删除一个或者多个菜单权限(角色Tab)
  private static batchDeleteAssignableRoleUrl = MICRO_CONFIG.identity + "base/roleallocate/delete-role-allocate";

  static async batchDeleteAssignableRole(vo: string[]): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.batchDeleteAssignableRoleUrl, vo);
    return response.data.data;
  }

  //Tree菜单 -通过子系统id获取子系统下所有的角色id
  private static getAllRoleIdBySubIdUrl = MICRO_CONFIG.identity + "base/rolemgr/get-allroleidlist-bysubid/{id}";

  static async getAllRoleIdBySubId(id: string): Promise<[]> {
    const response = await axios.get<ApiResponse<[]>>(this.getAllRoleIdBySubIdUrl.replace('{id}', id));
    return response.data.data;
  }
  //Tree菜单 -通过子系统id获取子系统下所有的角色id
  private static getAllRolelistBySubidUrl = MICRO_CONFIG.identity + "base/rolemgr/get-allRolelistBySubid/{id}";

  static async getAllRoleBySubId(id: string): Promise<[]> {
    const response = await axios.get<ApiResponse<[]>>(this.getAllRolelistBySubidUrl.replace('{id}', id));
    return response.data.data;
  }

  //-根据角色id和菜单id查询角色菜单
  private static getRoleMenuByRoleIdAndMenuIdUrl = MICRO_CONFIG.identity + "base/rolemgr/getRoleMenuByRoleIdAndMenuId/{roleid}/{menuid}";

  static async getRoleMenuByRoleIdAndMenuId(roleid: string,menuid: string): Promise<[]> {
    const response = await axios.get<ApiResponse<[]>>(this.getRoleMenuByRoleIdAndMenuIdUrl.replace('{roleid}', roleid).replace('{menuid}', menuid));
    return response.data.data;
  }
  //-根据角色id查询角色菜单
  private static getRoleMenuByRoleIdUrl = MICRO_CONFIG.identity + "base/rolemgr/getRoleMenuByRoleId/{roleId}";

  static async getRoleMenuByRoleId(roleId: string): Promise<[]> {
    const response = await axios.get<ApiResponse<[]>>(this.getRoleMenuByRoleIdUrl.replace('{roleId}', roleId));
    return response.data.data;
  }
  //-根据菜单id查询角色菜单
  private static getRoleMenuByMunuIdUrl = MICRO_CONFIG.identity + "base/rolemgr/getRoleMenuByMunuId/{menuId}";

  static async getRoleMenuByMunuId(menuId: string): Promise<[]> {
    const response = await axios.get<ApiResponse<[]>>(this.getRoleMenuByMunuIdUrl.replace('{menuId}', menuId));
    return response.data.data;
  }

    //添加角色与菜单
  private static addRoleMenuUrl = MICRO_CONFIG.identity + "base/rolemgr/addRoleMenu/{roleid}/{menuid}/{subguid}";

  static async addRoleMenu(roleid: string,menuid: string,subguid: string): Promise<[]> {
    const response = await axios.post<ApiResponse<[]>>(this.addRoleMenuUrl.replace('{menuid}', menuid).replace('{subguid}', subguid).replace('{roleid}', roleid));
    return response.data.data;
  }
  //添加角色与菜单(批量)
  private static batchAddRoleMenuUrl = MICRO_CONFIG.identity + "base/rolemgr/batchAddRoleMenu";

  static async batchAddRoleMenu(roleIdsMenuIdsVo: RoleIdsMenuIdsVo): Promise<[]> {
    const response = await axios.post<ApiResponse<[]>>(this.batchAddRoleMenuUrl,roleIdsMenuIdsVo);
    return response.data.data;
  }
  //添加角色与菜单(Tree-批量)
  private static saveRoleMenusUrl = MICRO_CONFIG.identity + "base/rolemgr/saveRoleMenus/";

  static async saveRoleMenus(vo: any): Promise<boolean> {
    const response = await axios.post<ApiResponse<boolean>>(this.saveRoleMenusUrl,vo);
    return response.data.data;
  }
  //删除角色与菜单(批量)
  private static deleteRoleMenuListUrl = MICRO_CONFIG.identity + "base/rolemgr/deleteRoleMenuList";

  static async deleteRoleMenuList(ids: Array<string>): Promise<boolean> {
    const response = await axios.post<ApiResponse<boolean>>(this.deleteRoleMenuListUrl,ids);
    return response.data.data;
  }
  //根据用户id、subguid查询有权限看到的菜单项
  private static getMenuByUserIdAndSubGuidUrl = MICRO_CONFIG.identity + "base/rolemgr/getMenuByUserIdAndSubGuid/{userId}/{subGuid}";

  static async getMenuByUserIdAndSubGuid(userId: string,subGuid: string): Promise<KeyvalueMenuVo[]> {
    const response = await axios.get<ApiResponse<KeyvalueMenuVo[]>>(this.getMenuByUserIdAndSubGuidUrl.replace('{userId}', userId).replace('{subGuid}', subGuid));
    return response.data.data;
  }




  //Tree菜单-删除子系统
  private static deleteRoleSubsystemUrl = MICRO_CONFIG.identity + "base/rolemgr/subsystem-delete/{id}";

  static async deleteRoleSubsystem(id: string): Promise<string> {
    const response = await axios.get<ApiResponse<string>>(this.deleteRoleSubsystemUrl.replace('{id}', id));
    return response.data.data;
  }

  //RoleTab -角色下添加用户
  private static addRoleUserUrl = MICRO_CONFIG.identity + "base/rolemgr/addUsersInRole";

  static async addRoleUser(vo: RoleUserVo): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.addRoleUserUrl, vo);
    return response.data.data;
  }

  //RoleTab -获取用户
  private static acquireUserUrl = MICRO_CONFIG.identity + "base/rolemgr/acquireUsersId";

  static async acquireUsersId(vo: RoleUserVo): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.acquireUserUrl, vo);
    return response.data.data;
  }

  //RoleTab -可分配角色树展示
  private static getRoleAllocateTreeUrl = MICRO_CONFIG.identity + "base/roleallocate/sync-role-allocate-tree/{id}/{type}/{roleid}";

  static async getRoleAllocateTree(id: string, type: string, roleid: string): Promise<RoleTabTreeVo[]> {
    const response = await axios.get<ApiResponse<RoleTabTreeVo[]>>(this.getRoleAllocateTreeUrl.replace('{id}', id).replace('{type}', type).replace('{roleid}', roleid));
    return response.data.data;
  }

  //RoleTab -角色添加可分配权限
  private static addRoleAllocaterUrl = MICRO_CONFIG.identity + "base/roleallocate/add-role-allocate";

  static async addRoleAllocate(vo: RoleAllocateVo): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.addRoleAllocaterUrl, vo);
    return response.data.data;
  }

  //RoleTab -自定义权限树展示
  private static getUseDefinePriTreeUrl = MICRO_CONFIG.identity + "base/rightsmgr/sync-group-tree-usedefine-pri/{id}/{type}/{roleid}";

  static async getUseDefinePriTree(id: string, type: string, roleid: string): Promise<RoleTabTreeVo[]> {
    const response = await axios.get<ApiResponse<RoleTabTreeVo[]>>(this.getUseDefinePriTreeUrl.replace('{id}', id).replace('{type}', type).replace('{roleid}', roleid));
    return response.data.data;
  }

  //RoleTab -角色添加自定义权限
  private static addUseDefinePriUrl = MICRO_CONFIG.identity + "base/rightsmgr/add-role-usedefine-pri";

  static async addUseDefinePri(vo: RoleUseDefinePriVo): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.addUseDefinePriUrl, vo);
    return response.data.data;
  }

  //调整角色 TREE 显示
  private static getAdjustRoleTreeUrl = MICRO_CONFIG.identity + "base/rolemgr/rolesgroup-tree-notparent/{filterid}/{id}/{type}";

  static async getAdjustRoleTree(filterid: string, id: string, type: string): Promise<RoleTabTreeVo[]> {
    const response = await axios.get<ApiResponse<RoleTabTreeVo[]>>(this.getAdjustRoleTreeUrl.replace('{filterid}', filterid).replace('{id}', id).replace('{type}', type));
    return response.data.data;
  }

  //判断角色名称是否存在
  private static isRoleNameExistUrl = MICRO_CONFIG.identity + "base/rolemgr/isRoleNameExist/{name}/{pId}";

  static async isRoleNameExist(name: string, pId: string): Promise<boolean> {
    const response = await axios.get<ApiResponse<boolean>>(this.isRoleNameExistUrl.replace('{name}', name).replace('{pId}', pId));
    return response.data.data;
  }
  //判断角色名称是否存在
  private static isRoleNameExistBySubGuidUrl = MICRO_CONFIG.identity + "base/rolemgr/isRoleNameExistBySubGuid/{name}/{subGuid}";

  static async isRoleNameExistBySubGuid(name: string, subGuid: string): Promise<boolean> {
    const response = await axios.get<ApiResponse<boolean>>(this.isRoleNameExistBySubGuidUrl.replace('{name}', name).replace('{subGuid}', subGuid));
    return response.data.data;
  }


  //保存调整完的角色或者角色组
  private static adjustRolesGroupOrRoleUrl = MICRO_CONFIG.identity + "base/rolemgr/adjustRolesGroupOrRole";

  static async adjustRolesGroupOrRole(vo: adjustRolesGroupOrRoleVo): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.adjustRolesGroupOrRoleUrl, vo);
    return response.data.data;
  }

  //调整角色组 TREE 显示
  private static getAdjustRoleGroupTreeUrl = MICRO_CONFIG.identity + "base/rolemgr/rolesgroup-tree-notself-notparent/{filterid}/{id}/{type}";

  static async getAdjustRoleTreeGroup(filterid: string, id: string, type: string): Promise<RoleTabTreeVo[]> {
    const response = await axios.get<ApiResponse<RoleTabTreeVo[]>>(this.getAdjustRoleGroupTreeUrl.replace('{filterid}', filterid).replace('{id}', id).replace('{type}', type));
    return response.data.data;
  }

  //查询该角色组名字是否存在(某个子系统下不重复)
  private static isRoleGroupNameExistUrl = MICRO_CONFIG.identity + "base/rolemgr/isGroupNameExist/{groupName}/{pid}";

  static async isRoleGroupNameExist(groupName: string, pid: string): Promise<boolean> {
    const response = await axios.get<ApiResponse<boolean>>(this.isRoleGroupNameExistUrl.replace('{groupName}', groupName).replace('{pid}', pid));
    return response.data.data;
  }

  //RoleTab -菜单权限树展示
  private static getFuncPriTreeUrl = (MICRO_CONFIG.isNew?MICRO_CONFIG.identity:MICRO_CONFIG.platform) + "base/funcmgr/sync-group-item-tree-role-pri";

  static async getFuncPriTree(vo: funcPriQuery): Promise<FuncGroupBaseVO> {
    const response = await axios.post<ApiResponse<FuncGroupBaseVO>>(this.getFuncPriTreeUrl, vo);
    return response.data.data;
  }

  //RoleTab -角色添加自定义权限
  private static addFuncPriUrl = MICRO_CONFIG.identity + "base/rightsmgr/addRolePri";

  static async addFuncPri(vo: funcPriVo): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.addFuncPriUrl, vo);
    return response.data.data;
  }

  //判断角色是否可以删除时
  private static judgeDeleteRoleUrl = MICRO_CONFIG.identity + "base/rolemgr/judgeDeleteRole/{roleid}/{subGuid}";

  static async judgeDeleteRole(roleid: string,subGuid: string): Promise<string> {
    const response = await axios.get<ApiResponse<string>>(this.judgeDeleteRoleUrl.replace("{roleid}", roleid).replace("{subGuid}",subGuid));
    return response.data.data;
  }

  //获取角色id
  private static acquireRoleIdUrl = MICRO_CONFIG.identity + "base/rolemgr/acquireRoleId";

  static async acquireRoleId(vo: any): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.acquireRoleIdUrl, vo);
    return response.data.data;
  }

  //通过角色id删除角色下的信息
  private static deleteRoleInfoByRoleIdUrl = MICRO_CONFIG.identity + "base/rolemgr/deleteRoleInfoByRoleId/{id}";

  static async deleteRoleInfoByRoleId(id: string): Promise<string> {
    const response = await axios.get<ApiResponse<string>>(this.deleteRoleInfoByRoleIdUrl.replace("{id}", id));
    return response.data.data;
  }

  //角色关联-正在办理的环节table
  private static queryTaskUrl = MICRO_CONFIG.identity + "base/rolemgr/get-querytask";

  static async queryTask(vo: RoleTabQuery): Promise<QueryTaskVo> {
    const response = await axios.post<ApiResponse<QueryTaskVo>>(this.queryTaskUrl, vo);
    return response.data.data;
  }

  //角色关联-流程定义table
  private static processDefinitionUrl = MICRO_CONFIG.identity + "base/rolemgr/process-definitions";

  static async processDefinition(vo: RoleTabQuery): Promise<ProcessDefinitionVo> {
    const response = await axios.post<ApiResponse<ProcessDefinitionVo>>(this.processDefinitionUrl, vo);
    return response.data.data;
  }

  //角色关联-流程可启动权限tree
  private static processStartDefinitionUrl = MICRO_CONFIG.identity + "base/rolemgr/process-tree";

  static async processStartDefinition(vo: any): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.processStartDefinitionUrl, vo);
    return response.data.data;
  }

  //角色关联-解除关联
  private static reliefRoleStartPriUrl = MICRO_CONFIG.identity + "base/rolemgr/relief-roleStart-pri";

  static async reliefRoleStartPri(vo: any): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.reliefRoleStartPriUrl, vo);
    return response.data.data;
  }

  //建立用户与角色的关联关系
  private static establishRelationshipOnUserRoleUrl = MICRO_CONFIG.identity + "base/rolemgr/establishRelationshipOnUserRole";

  static async establishRelationshipOnUserRole(vo: any): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(this.establishRelationshipOnUserRoleUrl, vo);
    return response.data.data;
  }

  //复制用户角色权限
  private static copyUserRoleUrl = MICRO_CONFIG.identity + "base/rolemgr/copyUserRole";

  static async copyUserRole(vo: CopyUserRoleVo): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.copyUserRoleUrl, vo);
    return response.data.data;
  }

  //表单角色tree完整的数据
  private static getAllRoleTreesUrl = MICRO_CONFIG.identity + "base/rolemgr/getAllRolesTree/{groupid}/{type}/{subGuid}";

  static async getAllRoleTrees(groupid: string, type: string, subGuid: string): Promise<any> {
    const response = await axios.get<ApiResponse<any>>
    (this.getAllRoleTreesUrl.replace('{groupid}', groupid).replace('{type}', type).replace('{subGuid}', subGuid));
    return response.data.data;
  }

  //根据角色id集合判断有效id数量
  private static getRolesCountUrl = MICRO_CONFIG.identity + "base/rolemgr/getRolesCount";
  static async getRolesCount(vo: string[]): Promise<any> {
    const response = await axios.post<ApiResponse<string>>(this.getRolesCountUrl, vo);
    return response.data.data;
  }

  private static getActivityRolesCountUrl = MICRO_CONFIG.identity + "base/rolemgr/getActivityRolesCount";
  static async getActivityRolesCount(vo: any): Promise<any> {
    const response = await axios.post<ApiResponse<string>>(this.getActivityRolesCountUrl, vo);
    return response.data.data;
  }

  // 拖拽角色组
  private static updateRoleGroupSequenceUrl = MICRO_CONFIG.identity + "base/rolemgr/updateRoleGroupSequence";

  static async updateRoleGroupSequence(vo: updateRoleGroupSequenceVo): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.updateRoleGroupSequenceUrl, vo);
    return response.data.data;
  }

  // 拖拽角色
  private static updateRoleSequenceUrl = MICRO_CONFIG.identity + "base/rolemgr/updateRoleSequence";

  static async updateRoleSequence(vo: updateRoleGroupSequenceVo): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.updateRoleSequenceUrl, vo);
    return response.data.data;
  }

  // 查询角色流程权限关联列表（分页查询）
  private static roleprocdefsUrl = MICRO_CONFIG.identity + "base/rolemgr/roleprocdefs";

  static async roleprocdefs(vo: roleProcdeQuery): Promise<PageVo> {
    const response = await axios.post<ApiResponse<PageVo>>(this.roleprocdefsUrl,vo);
    return response.data.data;
  }

  // /identity/base/rolemgr/batchAddRoleProDef
  private static batchAddRoleProDefUrl = MICRO_CONFIG.identity + "base/rolemgr/batchAddRoleProDef";

  static async batchAddRoleProDef(vo: any): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.batchAddRoleProDefUrl, vo);
    return response.data.data;
  }

  // 删除一个或者多个菜单权限流程  identity/base/rolemgr/deleteRoleProcDefList
  private static deleteRoleProcDefListUrl = MICRO_CONFIG.identity + "base/rolemgr/deleteRoleProcDefList";

  static async deleteRoleProcDefList(vo: string[]): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(this.deleteRoleProcDefListUrl, vo);
    return response.data.data;
  }

  // 根据用户名和subguid判断子系统是否含应用管理员或系统管理员  identity/base/rolemgr/selectHavaAdminBySubGuidAndUsername
  private static selectHavaAdminBySubGuidAndUsernameUrl = MICRO_CONFIG.identity + "base/rolemgr/selectHavaAdminBySubGuidAndUsername/{username}/{subGuid}";

  static async selectHavaAdminBySubGuidAndUsername(username,subGuid: string): Promise<boolean> {
    const response = await axios.get<ApiResponse<boolean>>(this.selectHavaAdminBySubGuidAndUsernameUrl.replace("{username}", username).replace("{subGuid}",subGuid));
    return response.data.data;
  }
  //判断角色是否可调整角色组
  private static allowRoleAdjustUrl = MICRO_CONFIG.identity + "/base/rolemgr/allowRoleAdjust/{roleGroupId}/{rootId}/{type}";
  static async allowRoleAdjust(roleGroupId,rootId: string,type): Promise<boolean> {
    let url=this.allowRoleAdjustUrl.replace("{roleGroupId}",roleGroupId).replace("{rootId}",rootId).replace("{type}",type)
    const response = await axios.get<ApiResponse<boolean>>(url);
    return response.data.data;
  }
  //根据menuId删除角色菜单关联记录
  private static deleteRoleMenuByMenuIdUrl = MICRO_CONFIG.identity + "base/rolemgr/deleteRoleMenuByMenuId/{menuId}";

  static async deleteRoleMenuByMenuId(menuId: string): Promise<boolean> {
    const response = await axios.post<ApiResponse<boolean>>(this.deleteRoleMenuByMenuIdUrl.replace("{menuId}", menuId));
    return response.data.data;
  }
}
