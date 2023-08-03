
  export interface DatumListResponse {
    bizdefDatumGroupResponse?: (BizdefDatumGroupResponse)[] | any;
    bizDatumResponse?: (BizDatumResponse)[] | any;
  }

  export interface SubsystemTreeVo {
    subGuid: string;
    isParent: boolean;
    isLeaf: boolean;
    name: string;
    id: string;
    type: string;
  }

  export interface BizdefDatumGroupResponse {
    revision?: number|null;
    datumgroupId?: string|null;
    bizdefGuid?: string|null;
    parentId?: string|null;
    subGuid?: string|null;
    groupName: string;
    parentgroupName?: String|null;
    groupDesc: string;
    seqOrder?: number|null;
    id: string;
    revisionNext?: number|null;
  }


  export interface BizFormListResponse {
    bizFormGroupResponse?: (BizdefFormGroupResponse)[] | any;
    bizFormResponse?: (BizdefFormResponse)[] | any;
  }

  export interface BizdefFormGroupResponse {
    revision?: number|null;
    formGroupId?: string|null;
    bizDefGuid?: string|null;
    groupName: string;
    groupDesc?: string|null;
    rev?: String|null;
    seqOrder?: number|null;
    id: string;
    parentGroupGuid?: string|null;
    subGuid?: string|null;
    parentgroupName?: String|null;
  }


  export interface BizdefFormResponse {
    revision?: number|null;
    formGuid?: string|null;
    bizDefGuid?: string|null;
    formType?: string|null;
    name: string;
    formUrl?: string|null;
    formUrl2?: string|null;
    code: string;
    groupGuid?: string|null;
    url?: string|null;
    parentId?: string|null;
    subGuid?: string;
    allowInstDynamic?: boolean|false;
    formCategory?: string|null;
    id?: string|null;
    isSet?: boolean|null;
  }
 
  



  export interface ResourceGroupResponse {
    rev?: number|null;
    id?: string;
    name?: any;
    parentId?: string|null;
    sequence?: string|null;  
    subGuid?: string|null;
  }


  
  export interface ResourceItemResponse {
    rev?: number|null;
    id?: string;
    realName?: string|null;
    virtualName?: string;
    groupId?: string|null;  
    subGuid?: string|null;
    uploadTime?:Date|null;
    resourceType?:string|null;
    sequence?:string|null;
    img?:string|null;
    url?:string|null;
  }


  export interface BizDatumResponse {
    datumGuid?: string|null;
    subGuid?:string|null;
    bizDefGuid?: string|null;
    datumGroupGuid?: string|null;
    name: string;
    receiveType?: string|null;
    datumPrerequisite?: string|null;
    originalQuantity?: number|null;
    copyQuantity?: number|null;
    seqOrder?: number|null;
    provider?: string|null;
    provideType?: string|null;
    id?: string|null;
    description?: string|null;
    isSet?: boolean|null;
  }
 
  export interface BizDatumRequest {
    
    parentGuid?: string|null;
    subGuid?: string|null;
    datumGroupGuid?:string|null;
    name?:string|null;
}


export interface BizFormRequest {
    
  parentGuid?: string|any;
  subGuid?: string|null;
  bizDefGuid?: string|null;
  formName?:string|any;
}

export interface ResourceRequest {
    
  id: string;
  subGuid: string;
}



export interface SubsysVo {
  subGuid: string;
  subCode: string;
  subName: string;
}
export interface SubsystemVO {
  id: string;
  subCode: string;
  subName: string;
  datumGroupId: string;
}
export interface BizGroupRequest {
  datumgroupId?: string|null;
  bizdefGuid?: string|null;
  groupName: string;
  groupDesc?: string|null;
  subName?: string|null;
  subGuid?:string|null;
  parentId?: string|null;
  parentGroupGuid?:string|any;
  
}


export interface SubsysUpdateRequest {
  moveType: string;
  currentNodeId: string;
  targetNodeId: string;
}