export interface PlatformInfo {
  title: string;
  version: string;
  deptId: string;
  deptName: string;
  xzqdm?: any;
  userId: string;
  staffName: string;
  platformExplorerDiagramUrl: string;
  roles: string;
  modulus:string;
  exponent:string;
  systemUser:string;
  lockScreen:any;
  waterMark?:any;
  ip?:any;
  roleCodes?:any;
  pullData?:any;
}
export interface FuncGroupItemsVO {
  subGuid: string;
  funcitems?: (FuncItemBaseVO)[] | null;
  subName: string;
  funcgroups?: (FuncGroupBaseVO)[] | null;
}
export interface FuncItemBaseVO {
  funcitemId: string;
  subGuid: string;
  selectedIconPath: string;
  funcGroupId: string;
  funcItemName: string;
  shortcutIconPath: string;
  defaultOpen: number;
  showMode: number;
  shortcutSelectedIconPath: string;
  commonItem: number;
  pagePath: string;
  iconPath: string;
}
export interface FuncGroupBaseVO {
  subGuid: string;
  funcitems?: (FuncItemBaseVO)[] | null;
  funcGroupId: string;
  funcgroups?: (FuncGroupBaseVO)[] | null;
  funcGroupPid: string;
  iconPath: string;
  funcGroupName: string;
}

export interface FuncQueryRequest {
  frontFrame: string;
  commonItem: string;
  disabled: string;
  subguids?: (string)[] | null;
}

export interface SysConfig {
  defaultPassWord: string;
}
