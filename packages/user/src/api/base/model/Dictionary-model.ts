export interface DictionaryTreeVO {
  enumLevel:string;
  isParent: boolean;
  groupLetterName: string;
  name: string;
  pid: string;
  id: string;
  subGuid:string;
  type: string;
}
export interface DictionarySearchTreeVO {
  id: string;
  pid?: string;
  name: string;
  type: string;
  isParent: boolean;
  subGuid?: string;
  isLeaf: boolean;
  children:DictionarySearchTreeVO[]
}

export interface SubsysGroupRequest {
  id:string;
  subGuid: string;
  subSystemName: string;
  groupDesc: string;
}

export interface SubsysGroupVO{ //返回可添加的子系统数据
  id:string;
  subGuid: string;
  subName: string;
  subCode: string;
}

export interface FieldGroupVO{
  id: string;
  fatherGroupId:string;
  groupLetterName: string;
  groupChineseName: string;
  groupDesc: string;
  groupOrder: number;
  rev: string;
  url: string;
  fatherChineseName: string;
  subGuid:string;
  subSystemName: string;
}

export interface FieldGroupRequest{
  id: string;
  fatherGroupId:string;
  groupLetterName: string;
  groupChineseName: string;
  groupDesc: string;
  groupOrder: number;
  rev: string;
  url: string;
  fatherChineseName: string;
  subGuid:string;
  subSystemName: string;
}

export interface FieldExplainRequest {
  id: string;
  fldLetterName: string;
  fldChineseName: string;
  fldType: string;
  fldLength: number;
  fldPrecision: number;
  fldDesc: string;
  ownerName?: null;
  fldGroupId: string;
  fldOrder: number;
  rev: string;
  url: string;
  fatherChineseName: string;
  subGuid:string;
}

export interface FieldExplainVO {
  id: string;
  fldLetterName: string;
  fldChineseName: string;
  fldType: string;
  fldLength: number;
  fldPrecision: number;
  fldDesc: string;
  ownerName?: null;
  fldGroupId: string;
  fldOrder: number;
  rev: string;
  url: string;
  fatherChineseName: string;
  subGuid:string;
}

export interface FieldEnumRequest {
  id: string;
  fldExpId: string;
  parentEnumValue: string;
  enumValue: string;
  enumName: string;
  enumLevel: number;
  enumDesc: string;
  enumStatus: number;
  useFrequency?: null;
  enumOrder: number;
  enumGroupCode?: null;
  enumValueother?: null;
  enumValueother1?: null;
  rev: string;
  url: string;
  fatherEnumValue: string;
  subGuid:string;
}

export interface FieldEnumVO {
  id: string;
  fldExpId: string;
  parentEnumValue: string;
  enumValue: string;
  enumName: string;
  enumLevel: number;
  enumDesc: string;
  enumStatus: number;
  useFrequency?: null;
  enumOrder: number;
  enumGroupCode?: null;
  enumValueother?: null;
  enumValueother1?: null;
  rev: string;
  url: string;
  fatherEnumValue: string;
  subGuid:string;
}

