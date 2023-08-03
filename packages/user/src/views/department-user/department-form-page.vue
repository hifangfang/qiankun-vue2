<template>
  <div class="department-form-page">
    <el-form label-position="right" label-width="120px" ref="deptValidateForm" size="small" :model="deptForm"
             :rules="deptFormRule">
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构名称" prop="name">
            <el-input class="inputPadding" v-model="deptForm.name" placeholder="机构名称" maxlength="40" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机构编码">
            <el-input class="inputPadding" v-model="deptForm.deptCode" placeholder="机构编码" maxlength="25" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上级机构">
            <el-input v-model="deptForm.parentName" placeholder="上级机构" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址">
            <el-input class="inputPadding" v-model="deptForm.address" placeholder="地址" maxlength="75" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电话">
            <el-input class="inputPadding" v-model="deptForm.telephone" placeholder="电话" maxlength="25" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行政区编码" prop="xzqbm">
            <el-input class="inputPadding" v-model.number="deptForm.xzqbm" placeholder="行政区编码" maxlength="16" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="简述">
            <el-input class="inputPadding" type="textarea" v-model="deptForm.description" placeholder="简述" maxlength="25" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建日期">
            <el-input v-model="deptForm.createdOnstr" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item label="是否禁用">
            <el-switch :active-value="1" :inactive-value="0" v-model="deptForm.disabled"></el-switch>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="网点分支">
            <el-switch :active-value="1" :inactive-value="0" v-model="deptForm.servicePoint"></el-switch>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="网点上线">
            <el-switch :active-value="1" :inactive-value="0" v-model="deptForm.online"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="dataform-bottom">
        <el-button  type="primary" size="small"  @click="save" >保存</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script lang="ts">
  import {Component, Vue, Prop, Ref} from "vue-property-decorator";
  import {DepartmentVo, UserSyncRequest} from "@/api/identity/model/department-user-model";
  import {IdentityApi} from '@/api/identity/identity-api';
  import {KeyvalueApi} from "@/api/base/module/Keyvalue-api";
  import {ElForm} from "element-ui/types/form";
  import Formatter from "@/utils/js/formatter";



  @Component({
    name: "department-form-page"
  })
  export default class DepartmentFormPage extends Vue {
    @Ref() deptValidateForm!: ElForm;
    deptForm = {} as DepartmentVo;

    oldName = "";
    oldXzqbm;

    // 校验部门名称是否重名
    async checkName(rule, value, callback) {
      if (!value || value.trim() === "") {
        callback(new Error("名称不能为空"));
      } else {
        let response;
        if (this.checkSpechars(value)) {
          callback(new Error("机构名称不能包含特殊字符"));
        }
        if (this.oldName != value) {
          response = await IdentityApi.isDeptNameExist(this.deptForm.parentId, value.trim())
        }

        if (response) {
          callback(new Error("此名称已经存在"));
        }
        callback();
      }
    }

    // 校验行政区编码
    async checkXzqbm(rule, value, callback) {
     let response =  await IdentityApi.isXzqbmVerify();
     if(response){
       if (value || value != "") {
         if (!(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value)) {
           callback(new Error('行政区必须为数字值'))
         }
        let responses;
        if (this.oldXzqbm != value) {
          responses = await IdentityApi.isXzqbmDifferent(this.deptForm.parentId, value)
          if (responses.flag == 'true') {
            callback(new Error("必须以父机构行政区编码" + responses.xzqbm + "开头"));
          }
        }
       }
       callback();
     }
       if (!value || value === "") {
        callback(new Error("名称不能为空"));
      } else {
        let response;
        if (this.oldXzqbm != value) {
          response = await IdentityApi.isXzqbmDifferent(this.deptForm.parentId, value)
          if (response.flag == 'true') {
            callback(new Error("必须以父机构行政区编码" + response.xzqbm + "开头"));
          }
        }
        callback();
      }
    }
    deptFormRule = {
      name: [{required: true, validator: this.checkName, trigger: 'blur'}],
      xzqbm: [{required: false, validator: this.checkXzqbm, trigger: 'blur',}]  //required的值根据下文变量获取
    }

    //验证是否包含特殊字符
    checkSpechars(str) {
      let containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#) (\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
      return containSpecial.test(str);
    }

    async initDeptForm(data, type) {
      (this.$refs.deptValidateForm as any).resetFields();
      //根据变量获取机构信息中行政区编码是否可以空值 即该值是否必填
      const xzqbmForDepartment = await KeyvalueApi.getAllKeyValuePropertysByKeys(["xzqbmForDepartmentIsNull"]);
      this.deptFormRule.xzqbm[0].required=xzqbmForDepartment[0].value != '1';
      if (type == "update") {
        const reponse = await IdentityApi.getDepartment(data.id);
        this.deptForm = reponse;
        this.deptForm.xzqbm = Number(reponse.xzqbm);
        this.oldName = reponse.name;
        this.oldXzqbm = Number(reponse.xzqbm);
        if (null != this.deptForm.createdOn && '' != this.deptForm.createdOn) {
          this.deptForm.createdOnstr = Formatter.DateTimeFormatter(null,null,this.deptForm.createdOn);
        }
      } else {
        const reponse = await IdentityApi.getDepartment(data.id);
        this.deptForm = {
          "parentName": reponse.name,
          "parentId": reponse.id,
          "xzqbm": Number(reponse.xzqbm),
          "disabled": 0,
          "servicePoint": 0,
          "online": 0
        } as DepartmentVo;
      }
    }

    async save() {
      this.deptValidateForm.validate(async (valid) => {
        if (valid) {
          const response = await IdentityApi.addDepartment(this.deptForm);
          if (this.MICRO_CONFIG.enableSync) {
            let type;
            if(this.deptForm.id){
              type = 'update';
            }else{
              type = 'create';
            }
            let syncRequest = {
              userId: '',
              type: type,
              deptId: response.id
            } as UserSyncRequest;
            await IdentityApi.userSync(syncRequest);
          }
          this.$message({message: '保存成功', type: 'success'});
          this.$emit("flushTree",this.deptForm.parentId);
        } else {
          return false;
        }
      });
    }


  }
</script>

<style lang="scss">
  .department-form-page {
    .custom-el-save-button{
      position: fixed;
      bottom: 30px;
      text-align: center;
    }
    .el-form .el-form-item {
      float: left;
      width: 100%;
      text-align: left;
    }

    .el-form > .el-form-item:last-child {
      text-align: center !important;
    }
  }
</style>
