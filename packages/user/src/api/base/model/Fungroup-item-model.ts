export interface FuncGroupBaseVO {
  id: string;
  name: string;
  subGuid: string;
  parentFuncgroupId?: string | null;
  disabled: number;
  iconPath?: string | null;
  funcgroups?: (FuncGroupVO)[] | null;
  funcitems?: (FuncItemVO)[] | null;
  privilege?: (PrivilegeVo) | null;
}


export interface FuncGroupVO {
  id: string;
  name: string;
  subGuid: string;
  parentFuncgroupId?: null;
  iconPath?: null;
  funcgroups?: null;
  funcitems?: null;
  disabled?: number | null;
  sequence?: null;
  description?: string | null;
  createdOn?: null;
  createdOnStr?:any;
  type?: null;
  parentFuncGroupName?: null;
  subSystemName?: string | null;
  rev?: null;
}

export interface FuncItemVO {
  id: string;
  name: string;
  pagePath: string;
  funcGroupId: string;
  formType?: string,
  formWay?:string,
  formId?: string,
  funcCode: string;
  iconPath: string | null;
  selectedIconPath?: string | null;
  shortcutIconPath?: string | null;
  shortcutSelectedIconPath?: string | null;
  commonItem?: number | null;
  showMode?: number | null;
  defaultOpen?: number | null;
  subGuid: string;
  disabled: number;
  sequence?: null;
  funcgroupId: string;
  createdOn?: null;
  createdOnStr?: any;
  description?: null;
  funcFrequent?: null;
  funcExtendDef?: null;
  rev?: null;
  parentFuncGroupName?: null;
  subSystemName?: null;
  subSystemMap?: null;
  shortcutIconPathUrl?:string | null;
  shortcutSelectedIconPathUrl?:string | null;
}

export interface PrivilegeVo {
  id: string;
  name?: null;
  privilegeCode?: null;
  privilegeGroupId?: null;
  description?: null;
  subGuid?: null;
  rev: number;
}


export interface FuncGroupQuery {
  id?: string;
  name?: string;
  disabled?: number;
  parentFuncgroupId: string;
  subGuid?: string;
  start: number;
  size: number;
  order?: string;
  sort?: string;
}

export interface FuncItemQuery {
  id?: string;
  name?: string;
  disabled?: number;
  funcGroupId: string;
  subGuid?: string;
  start: number;
  size: number;
  order?: string;
  sort?: string;
}

export interface PageData {
  data?: [] | any;
  size: number;
  total: number;
  start: number;
}

export interface PrivilegSaveRequest {
  funcitemId:string;
  subIds?:string[];
  roleIds?:string[];
  groupIds?:string[];
}

export interface RolePrivilegeRequst {
  funcitemId:string;
  pageNum: number;
  pageSize: number;
  order?:string;
  sort?:string;
}

export interface AdjustRequst {
  adjutIds:string[];
  type: string;
  targetPid: string;
  sourcePid:string;
}

export interface AdjustGroupOrItemRequest {
  currentNodePid:string;
  moveType: string;
  currentNodeId: string;
  currentNodeType: string;
  targetNodePid?:string;
  targetNodeId:string;
  targetNodeType?:string;
}
