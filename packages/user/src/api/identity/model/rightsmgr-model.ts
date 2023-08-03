export interface RightsmgrLeftTreeVo {
    id: string;
    name: string;
    subGuid?: string;
    subName?: string;
}

export interface RightsmgrGroupVo {
    id: string;
    name: string;
    sequence: number;
    description: string;
    parentGroupId: string;
    subGuid: string;
    subName: string;
    rev: string;
}

export interface RightsmgrVo {
    id: string;
    name: string;
    privilegeCode: string;
    privilegeGroupId: string;
    groupName: string;
    description: string;
    subGuid: string;
    subName: string;
    rev: string;
}

export interface RightsmgrTableQuery {
    privilegeGroupGuid: string;
    start: number;
    size: number;
}

export interface RightsmgrGroupTableQuery {
    parentGroupGuid: string;
    start: number;
    size: number;
}

export interface PageData {
    data?: [] | any;
    size: number;
    total: number;
    start: number;
}

export interface rolePrivilegeVo {
  privilegeId:string;
  subIds: [] | any;
  groupIds: [] | any;
  roleIds: [] | any;
}

export interface rolePageVo {
  id?: string,
  order?:string,
  privilegeId:string,
  rev?:string,
  roleId: string,
  size: number,
  sort?:string,
  start: number
}
