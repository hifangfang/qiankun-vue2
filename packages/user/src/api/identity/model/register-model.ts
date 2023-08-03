export interface DepartmentRegisterForm {
    city:string;
    contactName:string;
    county:string;
    departmentTypeId:string;
    departname:string;
    idNumber:string;
    idType:string;
    password1:string;
    password2:string;
    phone:string;
    province:string;
    username:string
}

export interface CipherRequest {
    cipher:string;
}
export interface PersonRegisterForm {
    password2: string;
    password1: string;
    certificatecode:string;
    certificatetype:string;
    city:string;
    county:string;
    deptid:string;
    deptname:string;
    province:string;
    staffName:string;
    telephone:string;
    username:string
}