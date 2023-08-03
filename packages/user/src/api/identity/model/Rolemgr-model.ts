export interface RolemgrLeftTreeVo {
  id: string;
  name: string;
  type: string;
  isLeaf: boolean;
  isParent: boolean;
  pid?: string;
  subGuid?: string;
  children: RolemgrLeftTreeVo[];

}
export interface RolemgrTreeAllVo {
  id: string;
  pid?: string;
  name: string;
  type: string;
  isParent: boolean;
  subGuid?: string;
  isLeaf: boolean;
  children: RolemgrTreeAllVo[];
}
export interface RolemgrTreeVo {
  id: string;
  pid?: string;
  name: string;
  type: string;
  isParent: boolean;
  subGuid?: string;
  isLeaf: boolean;
  children: RolemgrTreeAllVo[];
}
export interface RoleSelectTreeVo {
  id: string;
  name: string;
  type: string;
  leaf: boolean;
  isParent?: boolean;
  pid?: string;
  subGuid?: string;
  children: RoleSelectTreeVo[];
  RoleSelectTreeVo;
  selectd:boolean;
  icon?:string
}

export interface RoleGroupVo {
  id: string;
  name: string;
  description: string;
  sequence: number;
  subGuid: string;
  rev: string;
  url: string;
  subName?: null;
  rolses?: null;
  subSystems?: null;
  subSystemEntity?: null;
  rgName?: null;
  parentId: string;
  noAction?: null;
}

export interface RoleGroupTableQuery {
  pageNum: number;
  pageSize: number;
  id: string;
}

export interface RoleTableQuery {
  pageNum: number;
  pageSize: number;
  groupId: string;
}

export interface PageVo {
  total: number;
  data: [] | any;
  start: number;
  size: number;
}


export interface RoleVo {
  id: string;
  name: string;
  roleGroupId: string;
  description?: null;
  sequence?: null;
  couldnotentrust?: null;
  roleCode?: null;
  canAssignRoles?: null;
  roleSys?: null;
  subGuid: string;
  rev?: null;
  url: string;
  subName: string;
  rgName: string;
  isShareMember: string;
  roleGroup?: null;
  subSystems?: null;
  subSystemEntity?: null;
  roleGroupEntity?: null;
  users?: null;
  noAction?: null;
}

export interface RoleTabQuery {
  roleId: string;
  pageNum: number;
  pageSize: number;
  order?: string;
  sort?: string;
}

export interface RoleUserVo {
  roleId: string,
  userId?: string,
  deptId?: string
}

export interface CopyUserRoleVo {
  id: string,
  userId?: string,
  deptId?: string
}

export interface RoleAllocateVo {
  roleId: string,
  subsystemArray?: string[],
  roleGroupArray?: string[],
  roleArray?: string[],
}

export interface RoleUseDefinePriVo {
  roleId: string,
  subsystemId?: string[],
  priGroupId?: string[],
  priItemId?: string[],
}

export interface RoleTabTreeVo {
  subGuid: string;
  isParent: boolean;
  name: string;
  id: string;
  type: string;
}

export interface adjustRolesGroupOrRoleVo {
  id: string;
  subGuid: string;
  relpid: string;
  type: string;
}

export interface funcPriQuery {
  parentId?: string;
  isItem?: boolean;
  roleid: string;
}

export interface funcPriVo {
  roleId: string;
  funcGroupId?: string;
  funcItemId?: string;
  privilegeId?: string;
}

export interface QueryTaskVo {
  name?: null;
  businessKey: string;
  taskName: string;
  id: string;
}

export interface ProcessDefinitionVo {
  name: string;
  processKey: string;
  id: string;
  category?: null;
}

export interface updateRoleGroupSequenceVo{
  roleGroupId: string;
  moveType: string;
  currentNodeId: string;
  targetNodeId: string;
}

export interface roleProcdeQuery{
  id?: string;
  order?: string;
  procDefKey?: string;
  rev?: string;
  roleId?: string;
  size?: number;
  sort?: string;
  start?: number;
}
export interface checkMesageVo {
  pageNum:number;
  pageSize:number;
  msgType:string;
  businessName:string;
  microName:string;
  requestStartTime:string;
  requestEndTime:string;
  recievePhone:number;
  isSendOk:boolean
}
export interface RoleIdsMenuIdsVo {
  subGuid:string;
  roleIds:string[];
  menuIds:string[];
}




