<template>
  <div class="user-extendinfo-form-page">
    <el-form label-position="right" label-width="120px" ref="userExtValidateForm" size="small" :model="userExtForm"
             :rules="userExtFormRule">
      <el-row>
        <el-col :span="12">
          <el-form-item label="证件类型" prop="certificatetype">
            <el-select v-model="userExtForm.certificatetype">
              <el-option v-for="item in certificatetypeArray"
                         :label="item.name"
                         :value="item.value"
                         :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件号码" prop="certificatecode">
            <el-input class="certificatecodeInput" v-model="userExtForm.certificatecodeTm" minlength="9" @input="desenInputText">
              <!--显示脱敏证件号码              -->
              <span v-if="showAuthenticationIcon&&userExtForm.certificatecodeTm&&userExtForm.id&&(systemUser==1||loginUserId==userExtForm.id)" slot="suffix">
                 <i v-if="unencryptCertificatecode==userExtForm.certificatecodeTm&&userExtForm.certificatecodeTm!=oldCertificatecodeTm"
                    class="iconfont zwpt_viewShow" title="显示全部证件号码" @click="getByIdUnencryptUserAndExt('hidden')"></i>
                 <i v-else class="iconfont zwpt_viewHide" title="显示全部证件号码" @click="getByIdUnencryptUserAndExt('show')"></i>

              </span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="头像">
          <el-input v-model="userExtForm.headportrait" v-if="false"></el-input>
          <el-avatar shape="square" :size="50" :src="userExtForm.headportraitUrl"
                     :key="userExtForm.headportrait"></el-avatar>
          <el-button @click="selectImageBtn" class="selectImage">选择</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="有效时间">
            <el-date-picker
              v-model="effectiveTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="征信分数" prop="creditscore">
            <el-input v-model.number="userExtForm.creditscore"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属省" prop="province">
            <el-select v-model="userExtForm.province" @change="provinceChange">
              <el-option v-for="item in provinceArray"
                         :label="item.name"
                         :value="item.value"
                         :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属市" prop="city">
            <el-select v-model="userExtForm.city" @change="cityChange">
              <el-option v-for="item in cityArray"
                         :label="item.name"
                         :value="item.value"
                         :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属县" prop="county">
            <el-select v-model="userExtForm.county">
              <el-option v-for="item in countyArray"
                         :label="item.name"
                         :value="item.value"
                         :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="电子签名签章">
            <el-button type="primary" @click="showTable">新增电子签章</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item>
            <signatureTable ref="signatureTable"></signatureTable>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>

    <SelectImageUser ref="selectImageUser" @changeSelectImage="changeSelectImageUser"></SelectImageUser>
    <!--查看未脱敏数据，二次认证-->
    <el-dialog
      append-to-body
      class="authenticationDialog loginFormDialog"
      title="用户认证"
      :visible.sync="showAuthentication"
      top="15vh">
      <template slot="title">
        <i class="el-icon-warning"></i><span>查看加密信息需进行二次授权认证</span>
      </template>
      <loginForm :subGuid="subGuid" login-type="authentication" @closeLoginForm="closeLoginForm"></loginForm>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Ref} from "vue-property-decorator";
  import {UserExtVo} from '@/api/identity/model/department-user-model';
  import {IdentityApi} from '@/api/identity/identity-api';
  import {DictionaryApi} from "@/api/base/module/Dictionary-api";
  import SelectImageUser from '@/components/component/selectImage.vue';
  import loginForm from "@/components/component/loginForm.vue";
  import {ElForm} from "element-ui/types/form";
  import signatureTable from "./signature-table.vue"
  import uuidv1 from 'uuid/v1';
  import ColumnCommon from '@/utils/js/common';
  import {getUrlParam} from "@/utils/js/url_path_utils";
  import {LocalStorageUtil} from "@/utils/js/localstorage_utils";
  @Component({
    name: "user-extendinfo-form-page",
    components: {
      SelectImageUser,
      signatureTable,
      loginForm
    }
  })
  export default class UserExtendInfoFormPage extends Vue {
    @Prop() treeNode: any;// 接收父组件传过来的数据
    @Ref() userExtValidateForm!: ElForm;
    userExtForm = {headportrait: ""} as UserExtVo;

    certificatetypeArray = [];
    provinceArray = [] as any;
    cityArray = [] as any;
    countyArray = [];
    effectiveTime = [] as any;
    // 校验证件号码
    //二次认证
    //存储初始脱敏数据
    oldCertificatecodeTm="";
    //未加密的证件号码
    unencryptCertificatecode="";  //侧边栏点击
    showAuthentication=false;
    showAuthenticationIcon=true;
    subGuid:string|null="";
    loginUserId="";
    systemUser = LocalStorageUtil.getItem('systemUser') as any;
    toCheckCertificatecode=true
    async checkCertificatecode(rule, value, callback) {
      if (!value || value.trim() === "") {
        if(this.userExtForm.certificatetype){
          callback(new Error("证件号码不能为空"));
        }
      }else{
        if(value.trim().length<9){
          callback(new Error("长度必须大于9"));
        }
        if(this.toCheckCertificatecode) {
          if (this.userExtForm.certificatetype == '1') {
            let falg = this.CheckIdentityCode(value);
            if (!falg) {
              callback("请输入正确的身份证号码");
            }
          }
          callback();
        }
      }
    }

    userExtFormRule = {
      certificatetype: [{required: true, message: "请输入证件类型", trigger: "blur"}],
      certificatecode: [{required: true, validator: this.checkCertificatecode, trigger: "change"}],
      province: [{required: true, message: "请选择所属省", trigger: "blur"}],
      city: [{required: true, message: "请选择所属市", trigger: "blur"}],
      county: [{required: true, message: "请选择所属县", trigger: "blur"}],
      creditscore: [{type: 'number', message: '征信分数必须为数字值'}]
    };
    async initUserExtForm(id) {
      const response = await IdentityApi.getUserExtWithCondition(id);
      this.userExtForm = response.userExt;
      this.toCheckCertificatecode=false;
      if (response.userExt.certificatetype != null) {
        this.userExtForm.certificatetype = response.userExt.certificatetype.toString();
      }
      if (response.userExt.headportrait != null) {
        this.userExtForm.headportraitUrl = this.MICRO_CONFIG.documentPath + response.userExt.headportrait;
      }

      if (response.userExt.userStartdate != null && response.userExt.userEnddate != null) {
        let list = [] as any;
        let startDate = new Date(response.userExt.userStartdate).getTime() as any;
        let endDate = new Date(response.userExt.userEnddate).getTime() as any;
        list[0]=startDate;
        list[1]=endDate;
        this.effectiveTime =list;
      }
      this.certificatetypeArray = response.cTypeList;
      this.provinceArray = response.sheng;
      if (response.shi != undefined) {
        this.cityArray = response.shi;
      }
      if (response.xian != undefined) {
        this.countyArray = response.xian;
      }
      this.oldCertificatecodeTm=response.userExt.certificatecodeTm;
      console.log(this.oldCertificatecodeTm);
      //电子签名签章列表
      (this.$refs.signatureTable as any).initData(response.sealList,this.treeNode)
    }
    async getByIdUnencryptUserAndExt(value){
      if(value=="show"){
        //没有二次认证解密过 弹出验证弹窗
        this.showAuthentication=true;
        this.subGuid = getUrlParam("subGuid");
      }else{
        // 解密后，再次点击眼睛后，应该像密码登录框一样再恢复成加密的样式
        this.userExtForm.certificatecodeTm=this.oldCertificatecodeTm
      }
    }
    async closeLoginForm(){
      let userId = this.userExtForm.id
      let response = await IdentityApi.getByIdUnencryptUserAndExt(userId);
      this.userExtForm.certificatecodeTm=response.certificatecode;
      this.unencryptCertificatecode=response.certificatecode;
      this.showAuthentication=false;
      //不验证证件号码
      this.toCheckCertificatecode=false;
    }
    selectImageBtn() {
      (this.$refs.selectImageUser as any).show();
    }

    changeSelectImageUser(img) {
      this.userExtForm.headportrait = img;
      this.userExtForm.headportraitUrl = this.MICRO_CONFIG.documentPath + img;
    }

    async save() {
      let sealData=(this.$refs.signatureTable as any).signatureData
      const sealList=[] as any;
      sealData=sealData.filter(item=>(item.sealSn!=""&&item.sealName!=""))
      for(let i=0;i<sealData.length;i++){
        if(sealData[i].isSet&&sealData[i].isSet==true){
          this.$message({message: "请先确定签章信息!", type: "warning"});
          return
        }
      }
      sealData.forEach((item,index)=>{
        const obj={
          "sealGuid": item.sealGuid||'',//uuid值
          "userId": item.userId,//可空 后台⾃动获取userid并赋值
          "sealSn": item.sealSn,
          "sealName": item.sealName,
          "thumbImgBase64":item.thumbImgBase64,//缩略图base64的信息
          "operatestate":item.operatestate, //是临时字段，值为1表⽰这条记录需要后台删除
          "isDefault": item.isDefault
        }
        sealList.push(obj)
      })
      this.userExtValidateForm.validate(async valid => {
        if (valid) {
          //1. 处理当前表单数据
          if (this.effectiveTime.length > 0) {
            this.userExtForm.userStartdate = this.effectiveTime[0];
            this.userExtForm.userEnddate = this.effectiveTime[1];
          }
          this.userExtForm.sealList=sealList
          await IdentityApi.addUserext(this.userExtForm);
          this.initUserExtForm(this.userExtForm.id)
          this.$message({message: "保存成功!", type: "success"});
        } else {
          return false;
        }
      });
    }
    //"8c7d3682-c080-4d4a-947f-af08e64576a2"
    async provinceChange(val) {
      let obj = this.provinceArray.find(function (item) {
        return item.value === val;
      });
      //清空市县数据
      this.userExtForm.city = '';
      this.cityArray = [];

      this.userExtForm.county = '';
      this.countyArray = [];
      let param = {
        parentEnumValue: obj.id,
      }
      const response = await DictionaryApi.getFieldEnumsByLetterName('DistrictCode', '0', param)
      this.cityArray = response;
    }

    async cityChange(val) {
      let obj = this.cityArray.find(function (item) {
        return item.value === val;
      });

      //清空县数据
      this.userExtForm.county = '';
      this.countyArray = [];

      let param = {
        parentEnumValue: obj.id,
      }
      const response = await DictionaryApi.getFieldEnumsByLetterName('DistrictCode', '0', param)
      this.countyArray = response;
    }

    //身份证校验
    cityArr = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆"
    }//, 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
    CheckIdentityCode(code) {
      code = code.trim();
      if (code.length == 0 || code == null || code == undefined) {
        return false;
      }
      let info = ""
      let reg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i;
      if (!reg.test(code)) {
        return false;
      }
      code = code.replace(/x$/i, "a");
      if (this.cityArr[parseInt(code.substr(0, 2))] == null) {
        return false;
      }
      let birthDay = code.substr(6, 4) + "-" + Number(code.substr(10, 2)) + "-" + Number(code.substr(12, 2));
      let d = new Date(birthDay.replace(/-/g, "/"));
      if (birthDay != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
        return false;
      }
      return true;
    }
    //新增table输入框
    showTable(){
      (this.$refs.signatureTable as any).showInput()
    }
    //输入框动态脱敏
    desenInputText(value) {
      this.userExtForm.certificatecode = value;
      this.userExtForm.certificatecodeTm = value;
      this.toCheckCertificatecode=true;
    }
  }
</script>

<style lang="scss">
  .user-extendinfo-form-page {
    .el-form{
      padding: 40px!important;
      .el-form-item {
        float: left;
        width: 100%;
        text-align: left;
        .submit-style{
          position: fixed;
          bottom: 30px;
          text-align: center;
        }
        .menuIcon i {
          position: relative;
          top: 5px;
        }

        .selectImage {
          position: relative;
          left: 10px;
          top: -15px;
        }
        .el-date-editor{
          width: 100%;
        }
        .certificatecodeInput{
          i{
            cursor: pointer;
          }
        }
      }
    }
    .el-form>.el-form-item:last-child {
      text-align: center !important;
    }

    /*    .el-form .el-form-item:last-child {
          text-align: center !important;

          .el-input--small .el-input__inner {
            line-height: 0px !important;
            height: 0px !important;
          }
        }*/
  }
</style>
