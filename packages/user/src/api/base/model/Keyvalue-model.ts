// export interface SubsystemTreeVo {
//   subGuid: string;
//   isParent: boolean;
//   isLeaf: boolean;
//   name: string;
//   id: string;
//   type: string;
// }
export interface SubsystemTreeVo {
  subGuid: string;
  isParent: boolean;
  isLeaf: boolean;
  name: string;
  id: string;
  type: string;
  datatype:null|string;
}

export interface KeyPartEditFormTreeDataVo {

}

export interface KeyvalueGroupVo {
  id: string;
  caption: string;
  parent?: string;
  parentGroupName:string;
  type:string;
  description:string;
  subGuid:string;
  sequence?: number;
  url?: string;
  subSystemName?: null;
  radioType?:string
}

export interface KeyvalueGroupDeepVo{
  id: string;
  caption: string;
  parent?: string;
  parentGroupName:string;
  type:string;
  description:string;
  subGuid?: string;
  sequence?: number;
  url?: string;
  subSystemName?: null;
  keyValueProperties:KeyvalueProperty;
}
export interface KeyvalueProperty{
  id:string;
  key:string;
  value:string;
  caption:string;
  groupId:string;
  subGuid:string;
  description?:string;
  parentGroupName?:string|null;
  fieldType?:string|null;
  keyvaluePropertyOptions?:KeyvaluePropertyOption[] | null;
}
export interface KeyvaluePropertyOption{
  id:string;// 主键id
  optionKey:string;// 选项键名称
  optionValue:string;// 选项键值
  propertyId:string;// 键值对id
  sequence:number;
  canDelete:number;
  rev:number|null;
}
export interface DataConnectionInfo {
  databaseType:string;
  url: string;
  userName: string;
  passWord: string;
}
export interface KeyvalueMenuVo {
  id: string;
  menuName: string;
  menuType: string;
  pageUrl: string;
  privilegeCode: number;
  rev: string;
  menuSort: string;
  visual: string;
  groupId: number;
  subGuid: string;
  sequence: number;
  modifyable: string;
  icon: string;
}

export interface KeyvalueVo {
  id: string;
  name: string;
  aliasName: string;
  snRule: string;
  snLength: number;
  stepLength: number;
  genMode: string;
  resetMode: string;
  snValue: number;
  rev: string;
  url: string;
  subGuid: string;
  sequence: number;
  parentId: string;
  subName?: null;
  curValue?: null;
}

export interface SerialTableVo {
  pageNum: string;
  pageSize: string;
  parentId: string;
}

export interface SerialSubSysVo {
  id: string;
  subGuid: string;
  aliasName: string;
}

export interface PageVo {
  recordsTotal: number;
  data: [] | any;
  start: number;
  size: number;
  key:string;
}

export interface KeyvalueRequest {
  pageNum: number;
  pageSize: number;
  sort?:string;
  order?:string;
}
export interface PageData {
  data?: (any)[] | null;
  size: number;
  total: number;
  start: number;
}

