export interface DepartmentVo {
  id?: string | null;
  name: string;
  sequence: number;
  disabled?: number;
  createdOn?: null;
  createdOnstr?:any;
  telephone: string;
  address: string;
  description: string;
  parentId: string;
  parentName: string;
  projectCode: string;
  publicuser: string;
  smsNumber: number;
  deptCode: string;
  manageroleId: string;
  xzqbm: number;
  servicePoint: number;
  online: number;
}
export interface DepartUsersSearchTreeAllVo {

}

export interface DepartmentRequest {
  pagesize: number;
  pagenum: number;
  sortType?: string | any;
  sortName?: string | any;
  deptName?: string | any;
  deptXzqbm?: string | any;
  nodeid: string;
}

export interface UserRequest {
  pagesize: number;
  pagenum: number;
  sortType: string;
  sortName: string;
  userNameQuery: string;
  staffNameQuery: string;
  source: string;
  verifyType: string;
  deptName: string;
  deptId: string;
}

export interface UserSyncRequest {
  userId: string;
  type: string;
  deptId: string;
}

export interface UserVo {
  id: string;
  deptid?: string;
  changeDept?: string | any;
  username: string;
  passWord?: string;
  staffName: string;
  departments: any[];
  userCode?: string | any;
  telephone?: string | any;
  telephoneTm?:string|any;
  loginMode?: number;
  systemUser: number;
  fingerstring?: string | any;
  fingerImage?: string | any;
  fingerstringAnnother?: string | any;
  fingerImageAnnother?: string | any;
  description?: string | any;
  disabled?: number;
  itest?: string | any;
  flxedIpModel?: number;
  flxedLoginIp?: string | any;
  flxedLoginStarip?: string | any;
  flxedLoginEndip?: string | any;
  dingId?: string | any;
  districts?:string | any;
  chgDeptVos?:string[]|undefined[]
  mainPositionDeptId:string;
  mainPositionDeptName:string;
}

export interface ExternalUserVo {
  id?: string; // ID
  username: string; // 用户名
  publicKey: string; // 公钥
  privateKey: string; // 私钥
  department: string; // 部门
  privilege: string; // 权限
  createDate?: string; // 创建时间
  rev?: string; // 版本号
  url?: string; // Rest Url
}

export interface UserExtVo {
  id: string;
  certificatetype?: string;
  certificatecode?: string;
  certificatecodeTm?:string;
  userStartdate?: string;
  userEnddate?: string;
  flxedLoginStarip: string;
  flxedLoginEndip: string;
  creditscore?: string;
  rev: string;
  flxedLoginIp: string;
  headportrait?: string|null;
  province?: string;
  city?: string;
  county?: string;
  flxedIpModel: number;
  url: string;
  headportraitUrl?:string|null;
  sealList:any[]
}

export interface DragDeptAndUserSeqRequest {
  parentDeptId: string;
  moveType: string;
  currentNodeId: string;
  targetNodeId: string;
}

export interface DepartUsersTreeAllVo {
 id:string;
 pid?:string;
 children:DepartUsersTreeAllVo[];
}
export interface SearchDeptUserVo {
  searchName:string;
  type:string;
  subGuid:string;
}


