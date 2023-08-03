export interface DepartmentUserInfo {
  isParent: string;
  name: string;
  rootIsAdmin: string;
  pid: string;
  id: string;
  type: string;
  treeStatus: boolean;
  selected:boolean;
  status: string;
  disabled:boolean;

}

export interface DepartmentResponse {
  departmentId: string;
  departmentName: string;
  address: string;
  deptPids: string;
  departmentPname: string;
  telephone: string;
  xzqbm: string;
  createdOn: string;
  parentId: string;
}

export interface ExternalUserQuery {
  size:number;
  start:number;
}


export interface UpdateRequest {
  username?:string|null;
  password:string;
  pastPwd:string;
  modulus?:string|null;
  exponent?:string|null;
}

export interface multipleDeptTreeVo {
  isParent: boolean;
  name: string;
  pid?: string;
  halfCheck: boolean;
  id: string;
  type: string;
  status: string;
}


