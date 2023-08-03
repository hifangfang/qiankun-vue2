export interface SubsysVo {
    subGuid: string;
    subCode: string;
    subName: string;
}
export interface SubsystemVO {
    id: string;
    coverUrl:string;
    subCode: string;
    subName: string;
    subOrder: number;
    subDesc?: string | any;
    defaultStartPage?: string | any;
    loginpage?: any;
    defaultmainframe?: any;
    toppage?: string | any;
    disabled: number;
    rev: string;
    url: string;
    type?: any;
    count?: any;
    maxorder?: any;
    createdTime:string;
    importItems?:[] |any;
    publishTime:string;
    publishUrl:string;
    userId:string;
    staffName:string;
    icon?:string | any;
    publishUser?:string;
    subGuid?:string;
}

export interface SubsysUpdateRequest {
    moveType: string;
    currentNodeId: string;
    targetNodeId: string;
}

export interface AppVO {
    id:string,
    subCode: string;
    subName: string;
    subDesc:string;
    importItems:string[];
    createdTime?:string | any;
    publishTime?:string | any;
    publishUrl?:string | any;
    createdTimeStr?:string;
    publishTimeStr?:string;
    userId:string;
    staffName?:string;
    icon?:string|any;
    coverUrl?:string|any;
}

export interface templateVO {
    id:string,
    subName: string; //应用名称
    subDesc:string;   //描述
    publishUrl?:string | any;  //应用地址
    subCorrelation?:string;  //关联应用
    loginName?:string;   //登录页名称
    userId:string;
    staffName:string;
    icon?:string|any;
}

export interface templateFromBIVO {
    applicationId:string,
    createdBy:string,
    createdTime?:string | any;
    formCode: string,
    formDesc: string,
    formId: string,
    formImg?:string|any;
    formName: string,
    groupId: string,
    isDeleted: number;
    rev: number;
    sourceId: string,
    updatedBy: string,
    updatedTime: string,
}
