<template>
  <div>
    <div class="user-form-page">
      <el-form
        label-position="right"
        label-width="120px"
        ref="userValidateForm"
        size="small"
        :model="userForm"
        :rules="userFormRule">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input
                class="inputPadding"
                v-model="userForm.username"
                placeholder="登录名（中文或大、小写英文字母或数字）"
                maxlength="50"
                show-word-limit
                :disabled="!!userForm.id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职员姓名" prop="staffName">
              <el-input
                class="inputPadding"
                v-model="userForm.staffName"
                placeholder="职员姓名"
                maxlength="25"
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="userForm.id ? 24 : 12">
            <el-form-item label="所在机构" prop="departments">
              <div class="deptTag">
                <el-tag
                  v-for="dept in userForm.departments"
                  :key="dept.name"
                  size="medium"
                  @close="handleClose(dept)"
                  closable>
                  {{ dept.name }}</el-tag>
                <el-tag
                  class="custom-el-tag"
                  size="medium"
                  @click="addDept"
                  style="
                    color: #606266;
                    border: 1px solid #c0c4cc;
                    background-color: #ffffff;
                  ">+添加</el-tag>
              </div>
            </el-form-item>
            <el-col :span="12">
              <el-form-item label="主职机构" prop="mainPositionDeptId" v-if="userForm.mainPositionDeptName">
                <el-input
                  disabled
                  class="inputPadding"
                  v-model="userForm.mainPositionDeptName"
                  placeholder="主职机构"
                  show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col v-if="userForm.id ? false : true">
            <el-form-item label="初始密码">
              <el-input
                v-model="userForm.passWord"
                :placeholder="defaultPassWord"
                :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户编码">
              <el-input
                class="inputPadding"
                v-model="userForm.userCode"
                placeholder="用户编码"
                maxlength="9"
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="联系电话"
              prop="telephone"
              class="telephoneForm">
              <el-input
                @input="desenInputText"
                @blur="toShowAuthenticationIcon"
                v-model="userForm.telephoneTm"
                placeholder="联系电话">
                <span slot="suffix" v-if="showAuthenticationIcon&&userForm.telephoneTm&&userForm.id&&(systemUser==1||loginUserId==userForm.id)">
                  <i  v-if="this.unencryptTelePhone==userForm.telephoneTm&&userForm.telephoneTm!=oldTelePhoneTm" class="iconfont zwpt_viewShow" title="显示全部联系电话" @click="getByIdUnencryptUserAndExt('hidden')"></i>
                  <i  v-else class="iconfont zwpt_viewHide" title="显示全部联系电话" @click="getByIdUnencryptUserAndExt('show')"></i>
                </span>
              </el-input>
              <el-tooltip
                class="zwpt-infor-box"
                effect="dark"
                placement="bottom">
                <div slot="content">
                  <span>1、手机号支持浙政钉绑定；</span><br />
                  <span>2、座机号请按照的“区号-座机号码”的格式输入，如"0571-54123471"。</span>
                </div>
                <i class="zwpt_infor2 iconfont" style="vertical-align: middle"></i>
              </el-tooltip>
              <el-button
                v-if="!userForm.dingId && showBtn && this.showEnable.value != '0'"
                type="primary"
                size="small"
                v-preventReClick
                @click="syncDingEmployee">浙政钉绑定</el-button>
              <el-button
                v-if="userForm.dingId"
                type="primary"
                size="small"
                v-preventReClick
                @click="unbindDingEmployee">解绑浙政钉</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录模式">
              <el-select v-model="userForm.loginMode">
                <el-option
                  v-for="option in loginModeOptions"
                  :label="option.label"
                  :value="option.value"
                  :key="option.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户类型">
              <el-select v-model="userForm.systemUser" :disabled = "loginUserName!='admin' || userForm.username =='admin'" >
                <el-option
                  v-for="option in systemUserOptions"
                  :label="option.label"
                  :value="option.value"
                  :key="option.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--      <el-row>-->
        <!--        <el-col :span="12">-->
        <!--          <el-form-item label="指纹1">-->
        <!--            <div>-->
        <!--              <el-button class="fingerprintEntering">录入</el-button>-->
        <!--              <el-button class="fingerprintClear">清除</el-button>-->
        <!--            </div>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <!--        <el-col :span="12">-->
        <!--          <el-form-item label="指纹2">-->
        <!--            <div>-->
        <!--              <el-button class="fingerprintEntering">录入</el-button>-->
        <!--              <el-button class="fingerprintClear">清除</el-button>-->
        <!--            </div>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <!--      </el-row>-->
        <el-row>
          <el-form-item label="简述">
            <el-input
              type="textarea"
              v-model="userForm.description"
              maxlength="150"
              show-word-limit></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="禁用账号">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="userForm.disabled"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停止接收办件">
              <el-switch
                :active-value="'1'"
                :inactive-value="'0'"
                v-model="userForm.itest"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  >
          <el-col :span="12" v-if="userForm.disabled === 1">
            <el-form-item label="禁用原因">
              <el-input
              type="textarea"
              v-model="userForm.disableReason"
              maxlength="200"
              show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="userForm.itest === '1'" style="float: right">
            <el-form-item label="停收办件原因" style="float: left ">
              <el-input
              type="textarea"
              v-model="userForm.stpAptTaskCause"
              maxlength="200"
              show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="固定登录IP方式">
              <el-select v-model="userForm.flxedIpModel" placeholder="请选择">
                <el-option
                  v-for="option in flxedIpModelOptions"
                  :label="option.label"
                  :value="option.value"
                  :key="option.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="固定登录IP地址">
              <el-input
                v-model="userForm.flxedLoginIp"
                placeholder="固定登录IP地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="IP段起始地址">
              <el-input
                v-model="userForm.flxedLoginStarip"
                placeholder="固定登录IP段起始地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IP段截止地址">
              <el-input
                v-model="userForm.flxedLoginEndip"
                placeholder="固定登录IP段截止地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" class="districtForm">
            <el-form-item label="所在行政区">
              <el-select
                v-model="userForm.districts"
                multiple
                @remove-tag="removeLabels">
                <el-option
                  v-for="item in baseDis"
                  :label="item.districtName"
                  :value="item.id"
                  :key="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="0px">
              <el-button type="primary" size="small" @click="addDialog">添加</el-button>
              <!--              <el-button type="primary" size="small" @click="remove"-->
              <!--                >移除</el-button-->
              <!--              >-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="formbutton-bottom-center">
          <el-button type="primary" size="small" v-preventReClick @click="save">保存</el-button>
        </el-form-item>
      </el-form>
      <dept-tree-dialog
        ref="depttree"
        class="department-tree-dialog"
        @saveDeptData="saveDeptData"></dept-tree-dialog>
    </div>
    <div>
      <el-dialog
        class="relate"
        title="行政区"
        :visible.sync="dialogVisible"
        append-to-body
        width="40%">
        <el-tree
          v-if="dialogVisible"
          show-checkbox
          :data="treeData"
          :props="props"
          ref="tree"
          node-key="id"
          :default-expanded-keys="defaultKeys"
          @check-change="handleCheckChange">
          <span
            class="custom-tree-node hover-tree-node"
            slot-scope="{ node, data }"
            :title="data.name">
            <svg v-if="data.parentId == '-1'" class="icon" aria-hidden="true">　　
              <use xlink:href="#zwpt_L1-open"></use>
            </svg>
            <svg v-else class="icon" aria-hidden="true">　　
              <use xlink:href="#zwpt_fileOpen"></use>
            </svg>
            <!--                 <svg v-else class="icon" aria-hidden="true">-->
            <!--          　　      <use :xlink:href="data.icon"></use>-->
            <!--                 </svg>-->
            <div :title="data.name" class="title">{{ data.name }}</div>
          </span>
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="relateDistrict" size="mini">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog
      append-to-body
      class="bindDialog"
      title="提示"
      :visible.sync="bindDialogVisible"
      width="30%">
      <span style="font-size: 17px">该手机号已经被【{{this.deptNameOfOtherUserWhoOwnTheDingId }}】部门下的用户【{{ this.otherUserOwnTheDingId }}】绑定，<br>是否强制解绑该用户？<br></span>
      <span style="color:red">说明：<br> 1.强制解绑会清空该用户的联系电话和浙政钉ID;<br>2.如果点击取消，当前联系电话将清空，需要重新填写</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unBindUserTel " size="mini">取 消</el-button>
        <el-button type="primary" @click="unBindUser" size="mini">确 定</el-button>

      </span>
    </el-dialog>
    <el-dialog
      append-to-body
      class="bindDialog"
      title="提示"
      :visible.sync="confirmUnBindDingIdDialogVisible"
      width="30%">
      <span style="font-size: 17px">该手机号对应的浙政钉ID已经被【{{this.deptNameOfOtherUserWhoOwnTheDingId }}】部门下的用户【{{ this.otherUserOwnTheDingId }}】绑定，<br>是否强制解绑该用户?<br></span>
      <span style="color:red">说明：强制解绑会清空该用户的联系电话和浙政钉ID</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="confirmUnBindDingIdDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="ownTheDingId" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!--查看未脱敏数据，二次认证-->
    <el-dialog
      append-to-body
      class="authenticationDialog loginFormDialog"
      title="用户认证"
      :visible.sync="showAuthentication"
      top="15vh"
      v-if="showAuthentication">
      <template slot="title">
        <i class="el-icon-warning"></i><span>查看加密信息需进行二次授权认证</span>
      </template>
      <loginForm :subGuid="subGuid" loginType="authentication" @closeLoginForm="closeLoginForm"></loginForm>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
  import { IdentityApi } from "@/api/identity/identity-api";
  import { BaseApi } from "@/api/base/base-api";
  import {UserVo, UserSyncRequest,} from "@/api/identity/model/department-user-model";
  import DeptTreeDialog from "@/views/department-user/department-tree-dialog.vue";
  import { ElForm } from "element-ui/types/form";
  import { administraticApi } from "@/api/identity/module/administratic-api";
  //获取全局通信bus
  import bus from "@/utils/js/bus.js";
  import loginForm from "@/components/component/loginForm.vue";
  import {getUrlParam} from "@/utils/js/url_path_utils";
  import {LocalStorageUtil} from "@/utils/js/localstorage_utils";
  @Component({
    name: "user-form-page",
    components: {
      DeptTreeDialog,
      loginForm
    },
  })
  export default class UserFormPage extends Vue {
    @Ref() userValidateForm!: ElForm;
    dialogVisible = false;
    bindDialogVisible = false;//强制解绑弹框
    confirmUnBindDingIdDialogVisible = false;
    treeData = [];
    userFormData = {};
    districts = [];
    baseDis = [];
    showBtn = false;
    toCheckTelephone=true;
    props = {
      label: "name",
      id: "id",
      children: "children",
      isLeaf: "leaf",
    };
    defaultKeys = [];
    //其他绑定了对应dingId的用户
    otherUserOwnTheDingId = ''
    //其他绑定了对应dingId的用户的部门名称
    deptNameOfOtherUserWhoOwnTheDingId = ''
    //浙政钉id或者联系电话被其他用户绑定时，记录这个用户的id
    newUserId = ''
    userForm = {
      telephone: "",
      telephoneTm:"", //脱敏格式电话号码
      id: "",
      staffName: "",
      username: "",
      dingId: "",
      districts: [] as any,
      departments: [] as any[],
      systemUser: 0,
      disabled: 0,
      itest: 0,
      mainPositionDeptId: "",
      mainPositionDeptName: "",
      chgDeptVos:[]
    } as UserVo;
    loginModeOptions = [
      { label: "仅账号", value: 0 },
      // {"label": "仅指纹", "value": 1},
      // {"label": "账号或指纹", "value": 2},
      // {"label": "账号且指纹", "value": 3},
      { label: "加密狗", value: 5 },
      { label: "默认", value: 4 },
    ] as any[];

    systemUserOptions = [
      { label: "普通用户", value: 0 },
      { label: "系统管理员", value: 1 },
    ] as any[];

    flxedIpModelOptions = [
      { label: "无", value: 0 },
      { label: "固定IP", value: 1 },
      { label: "固定IP段", value: 2 },
    ] as any[];

    loginUserName = window.localStorage.getItem('username');
    oldUserName = "";
    oldTelePhone = "";
    oldTelePhoneTm = "";
    unencryptTelePhone="";
    oldDepartments: any = [];
    //默认密码
    defaultPassWord = "";
    parentData: any = [];
    itemData = {
      code: "",
      id: "",
      name: "",
    }; //
    bindType = "district";
    chgDeptVos=[] as any;
    originDepartments=[] as any;
    showPage = false;
    showEnable = {};
    //二次认证
    showAuthentication=false;
    showAuthenticationIcon=true;
    subGuid:string|null="";
    loginUserId="";
    systemUser = LocalStorageUtil.getItem('systemUser') as any;
    unBindUserTel(){
      this. bindDialogVisible = false
      this. userForm.telephone = ''
      this. userForm.telephoneTm = ''
    }

    remove() {}
    created() {
      bus.$on("refreshUserList", async () => {})
      this.isEnable()
    //  获取当前登录用户的id
      this.loginUserId = LocalStorageUtil.getItem("userId") || getUrlParam("userId")
    }

    //控制用户管理的浙政钉绑定按钮不显示
    async isEnable(){
      let propertyKeys=['isEnableZzdBind']
      let params={
        subGuid:'',
        propertyKeys:propertyKeys
      }
      const data:any = await BaseApi.getCodeValuePropertysByKeys(params)
      if(data && data.length > 0){
        this.showEnable = data[0];
      }
    }

    //主职机构
    getMainName() {
      const mainObj = this.userForm.departments.find((item) => {
        return item.id === this.userForm.mainPositionDeptId;
      });
      if (mainObj) {
        this.userForm.mainPositionDeptName = mainObj.name;
      } else {
        this.userForm.mainPositionDeptName = "";
      }
    }
    //行政区管理左侧获取全部树结构列表
    async getTreeList() {
      const response: any = await administraticApi.getAlladiministratic("null");
      this.treeData = response;
    }
    addDialog() {
      this.dialogVisible = true;
    }
    handleCheckChange(data, checked, indeterminate) {
      this.itemData = data;
    }
    //关联行政区
    relateDistrict(data) {
      const checkNodes = (this.$refs.tree as any).getCheckedNodes();
      let nodes = checkNodes.map((ele) => ({
        districtCode: ele.code,
        id: ele.id,
        districtName: ele.name,
      }));
      let userId = this.userForm.id;
      if (nodes.length > 0) {
        const params = {
          districts: nodes,
          userId: userId,
          bindType: "district",
        };
        administraticApi.relateuserList(params).then((res) => {
          this.dialogVisible = false;
          if (res.data.msg == "请求成功") {
            this.$message({
              type: "success",
              message: "关联成功!",
            });
            this.dialogVisible = false;
            const data = {
              id: userId,
            };
            const type = "update";
            this.initUserForm(data, type);
          } else {
            this.$message({
              type: "error",
              message: "关联失败!",
            });
            this.dialogVisible = false;
          }
        });
      } else {
        this.$message({
          type: "warning",
          message: "请选择关联用户!",
        });
      }
    }
    //移除行政区
    async removeLabels(item) {
      let params = {
        ids: [item],
      };
      let userId = this.userForm.id;
      const response: any = await administraticApi.userDeleteuserListMore(
        userId,
        params
      );
      this.$message({ message: "删除成功!", type: "success" });
    }
    //页面加载获取用户默认密码
    mounted() {
      this.getSysConfig();
      this.getTreeList();
    }
    async getSysConfig() {
      //response-json数据
      const response = await BaseApi.getSysConfig();
      this.defaultPassWord = response.defaultPassWord;
    }
    // 校验部门名称是否重名
    async checkUserName(rule, value, callback) {
      if (!value || value.trim() === "") {
        callback(new Error("用户名不能为空"));
      }
      else {
        if (value.indexOf(" ") != -1) {
          callback(new Error("不能含有空格"));
        }
        let reNumber = /^\d+$/;
        let reNeNumber = /^-\d+$/;
        let reRealNumber1 = /^[1-9]\d*[.]\d+$/;
        let reRealNumber2 = /^0[.]\d+$/;
        let reNeRealNumber1 = /^-[1-9]\d*[.]\d+$/;
        let reNeRealNumber2 = /^-0[.]\d+$/;
        // let usernameReg = /^[a-z0-9]*$/;
        let reg = /^[\u4e00-\u9fa5a-z0-9]*$/; //可以为中文正则表达式
        let regNumVal =/[`~!@#$^&*()=|{}':;',\[\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]/; //只可以输入大小写字母以及汉字，数字
        let check = /^0?(1)[0-9]{10}$/.test(value);  //纯数字只能是电话号码即1开头的11位数字
        if (!check) {
          check = !(
            reRealNumber1.test(value) ||
            reRealNumber2.test(value) ||
            reNeRealNumber1.test(value) ||
            reNeRealNumber2.test(value) ||
            reNumber.test(value) ||
            regNumVal.test(value) ||
            reNeNumber.test(value)
          );
        }
        if (!check) {
          callback(
            new Error("用户名只能小写字母或数字组成,不能全是数字(可以是手机号码)")
          );
        } else {
          let response;
          let username = value.trim();
          if (this.userForm.id == "") {
            response = await IdentityApi.isUserNameExist(username);
          } else {
            if (this.oldUserName != username) {
              response = await IdentityApi.isUserNameExist(username);
            }
          }
          if (response) {
            callback(new Error("此用户名已存在"));
          }
          callback();
        }
      }
    }
    //手机号码验证
    async checkTelephone(rule, value, callback) {
      if (value) {
        if(this.toCheckTelephone){
          let reg1 = /^1[3456789]\d{9}$/; //手机号
          let reg2 = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/; //座机电话
          if (reg1.test(value)) {
            this.showBtn = true;
          } else if (reg2.test(value)) {
            this.showBtn = false;
          }
          if (!reg1.test(value) && !reg2.test(value)) {
            callback(new Error("请输入正确的手机或座机号码"));
          } else {
            let response;
            let telephone = value.trim();
            if (this.oldTelePhone != telephone) {
              let mobile =this.userForm.telephone
              let userId = this.userForm.id
              response = await IdentityApi.checkBind(mobile,userId);
              let userName = response.userName
              let deptName =response.deptName
              this.newUserId = response.userId
              this.otherUserOwnTheDingId = userName
              this.deptNameOfOtherUserWhoOwnTheDingId = deptName
              if (response.status == 1) {
                callback(new Error("此手机号已被其他用户注册,请确认后再尝试"));
                this.showPage = true;
                this.bindDialogVisible = true;
              }
            }
            callback();
          }
        }
      } else {
        this.showBtn = false;
      }
    }
    //表单验证
    userFormRule = {
      username: [
        { required: true, validator: this.checkUserName, trigger: "blur" },
      ],
      staffName: [{ required: true, message: "请输入职员姓名", trigger: "blur" }],
      departments: [
        { required: true, message: "请选择所在机构", trigger: "blur" },
      ],
      telephone: [
        { required: false, validator: this.checkTelephone, trigger: "change" },
      ],
    };
    //联系电话输入赋值
    desenInputText(value) {
      this.showAuthenticationIcon=false;
      this.userForm.telephone = value;
      this.userForm.telephoneTm = value;
      this.toCheckTelephone=true;
    }
    toShowAuthenticationIcon(){
      this.showAuthenticationIcon=true;
    }
    async initUserForm(data, type) {
      this.baseDis = [];
      this.showBtn = false;
      this.toCheckTelephone=false;
      (this.$refs.userValidateForm as any).resetFields();
      if (type == "update") {
        const response = await IdentityApi.getByIdUserDepartments(data.id);
        this.originDepartments=[...response.departments]
        this.userForm = response;
        if (this.userForm.mainPositionDeptId) {
          this.getMainName();
        } else {
          this.userForm.mainPositionDeptName = "";
        }
        if (this.userForm.telephone) {
          this.showBtn = true;
        }
        let arr = [] as any;
        if (response.districts && response.districts.length > 0) {
          this.baseDis = response.districts;
          this.baseDis.forEach((item: any) => {
            arr.push(item.id);
          });
        } else {
          this.baseDis = [];
        }
        this.userForm.districts = arr;
        this.oldUserName = response.username;
        this.oldTelePhone = response.telephone;
        this.oldTelePhoneTm=response.telephoneTm;
        this.oldDepartments = response.departments;
      } else {
        const response = await IdentityApi.getDepartment(data.id);
        let departments = [] as any[];
        departments.push({ id: response.id, name: response.name });
        //id等为undefined时不能触发双向绑定，所以初始为空串
        this.userForm = {
          telephone: "",
          id: "",
          staffName: "",
          username: "",
          dingId: "",
          departments: departments,
          systemUser: 0,
          disabled: 0,
          itest: 0,
        } as UserVo;
      }
      this.parentData = data;
    }

    addDept() {
      (this.$refs.depttree as any).show();
    }
    saveDeptData(nodes) {
      for (let i = 0; i < nodes.length; i++) {
        let flag = true;
        this.userForm.departments.forEach((item) => {
          if (item.id == nodes[i].id) {
            flag = false;
          }
        });
        if (flag) {
          this.userForm.departments.push({
            id: nodes[i].id,
            name: nodes[i].name,
          });
          // const index=this.chgDeptVos.findIndex(ele=>ele.id===nodes[i].id)
          // if(index>-1){
          //   if(this.chgDeptVos[index].chgMod=='2'||this.chgDeptVos[index].chgMod=='del'){
          //     this.chgDeptVos[index].chgMod==='add'
          //   }
          // }else{
          //   const obj:any={
          //     deptId:nodes[i].id,
          //     deptName:nodes[i].name,
          //     chgMod:'add'
          //   }
          //   this.chgDeptVos.push(obj)
          // }
        }
      }
    }
    async getByIdUnencryptUserAndExt(value){
      if(value=="show"){
        //二次认证 弹出验证弹窗
        this.showAuthentication=true;
        this.subGuid = getUrlParam("subGuid");
      }else{
        // 解密后，再次点击眼睛后，应该像密码登录框一样再恢复成加密的样式
        this.userForm.telephoneTm=this.oldTelePhoneTm
      }
    }
    async closeLoginForm(){
      let userId = this.userForm.id
      let response = await IdentityApi.getByIdUnencryptUserAndExt(userId);
      this.userForm.telephoneTm=response.telephone;
      this.unencryptTelePhone=response.telephone
      this.showAuthentication=false
      //不验证电话
      this.toCheckTelephone=false
    }
    async syncDingEmployee() {
      let userId = this.userForm.id
      let mobile = this.userForm.telephone
      let response = await IdentityApi.checkUserBind(mobile,userId);
      if(response.status =='1'){
        this.deptNameOfOtherUserWhoOwnTheDingId = response.deptName;
        this.otherUserOwnTheDingId = response.userName;
        this.newUserId = response.userId;
        this.confirmUnBindDingIdDialogVisible = true
      }else if(response.status =='0'){
        try {
          let response = await IdentityApi.syncDingEmployeeByMobile(this.userForm);
          if (!this.userForm.id) {
            this.userForm.username = response.data.accountCode;
            this.userForm.id = response.data.userId;
            this.userForm.staffName = response.data.employeeName;
            this.$emit("flushTree");
          }
          this.userForm.dingId = response.data.dingId;
          //同步成功则记录telephone，username信息
          this.oldTelePhone = this.userForm.telephone;
          this.oldUserName = this.userForm.username;
          this.$message({ message: "绑定成功!", type: "success" });
          (this.$refs.userValidateForm as any).clearValidate('telephone');
        } catch (e) {

        }
      }
      // if(this.showPage){
      //   this.bindDialogVisible = true;
      //   let userId = this.userForm.id
      //   let mobile = this.userForm.telephone
      //   let response = await IdentityApi .checkBind(mobile,userId)
      //   console.log(response)
      // }else{
        // (this.$refs.userValidateForm as any).validateField(
        //   ["telephone"],
        //   async (Error) => {
        //     if (!Error) {
        //       let response = await IdentityApi.syncDingEmployeeByMobile(this.userForm);
        //       console.log(response)
        //       if (!this.userForm.id) {
        //         this.userForm.username = response.data.accountCode;
        //         this.userForm.id = response.data.userId;
        //         this.userForm.staffName = response.data.employeeName;
        //         this.$emit("flushTree");
        //       }
        //       this.userForm.dingId = response.data.dingId;
        //       //同步成功则记录telephone，username信息
        //       this.oldTelePhone = this.userForm.telephone;
        //       this.oldUserName = this.userForm.username;
        //       this.$message({ message: "绑定成功!", type: "success" });
        //     } else {
        //       console.log(Error);
        //     }
        //   }
        // );
      // }
    }
    //强制解绑其他浙政钉用户,绑定自己
    async ownTheDingId(){
      let response1 = await IdentityApi.unBind(this.newUserId);
      this.$message({ message: "解绑成功!", type: "success" });
      try {
        let response = await IdentityApi.syncDingEmployeeByMobile(this.userForm);
        if (!this.userForm.id) {
          this.userForm.username = response.data.accountCode;
          this.userForm.id = response.data.userId;
          this.userForm.staffName = response.data.employeeName;
          this.$emit("flushTree");
        }
        this.userForm.dingId = response.data.dingId;
        //同步成功则记录telephone，username信息
        this.oldTelePhone = this.userForm.telephone;
        this.oldUserName = this.userForm.username;
        this.$message({ message: "绑定成功!", type: "success" });
        (this.$refs.userValidateForm as any).clearValidate('telephone');
      } catch (e) {

      } finally {
        this.confirmUnBindDingIdDialogVisible = false;
      }




    }
    //强制解绑浙政钉用户
    async unBindUser(){
      const response = await IdentityApi.unBind(this.newUserId);
      this.$message({ message: "解绑成功!", type: "success" });
      (this.$refs.userValidateForm as any).clearValidate('telephone')
      this.bindDialogVisible = false;


    }
    async unbindDingEmployee() {
      const response = await IdentityApi.unbindDingEmployeeByUserId(
        this.userForm.id
      );
      this.userForm.dingId = "";
      this.$message({ message: "解绑成功", type: "success" });
    }

    async save() {
      this.userValidateForm.validate(async (valid) => {
        if (valid) {
          //行政区移除

          // const newArr = [];
          // this.userForm.districts.forEach((item) => {
          //   this.baseDis.find((items) => {
          //     if (items.id == item) {
          //       newArr.push(items);
          //     }
          //   });
          // });
          // console.log(newArr);
          // this.userForm.districts = newArr;

          //1. 处理当前表单数据
          this.userForm.chgDeptVos=this.compareData(this.originDepartments,this.userForm.departments)
          this.userForm.telephoneTm="";
          const response = await IdentityApi.addUser(this.userForm);
          if (this.MICRO_CONFIG.enableSync) {
            let type;
            if (this.userForm.id) {
              type = "update";
            } else {
              type = "create";
            }
            let syncRequest = {
              userId: response.data.id,
              type: type,
              deptId: "",
            } as UserSyncRequest;
            await IdentityApi.userSync(syncRequest);
          }
          //成功则记录telephone，username信息
          this.oldTelePhone = this.userForm.telephone;
          this.oldUserName = this.userForm.username;
          //成功时记录用户id
          this.userForm.id = response.data.id;
          // this.initUserForm(response.data,"update")
          this.userForm.telephoneTm=response.data.telephoneTm
          //用户修改所在机构 刷新树节点
          const departments = this.filterRepeat(
            this.oldDepartments.concat(this.userForm.departments)
          );
          departments.forEach((dep) => {
            this.$emit("flushTree", dep.id);
          });

          this.$message({ message: "保存成功!", type: "success" });
        } else {
          return false;
        }
      });
    }

    compareData(beforeArr,afterArr){
      let add=[] as any,
          del=[] as any,
          cenObj={} as any
    //  把beforeArr数组去重放入cenObj
      for(let i=0;i<beforeArr.length;i++){
        cenObj[beforeArr[i].id]=beforeArr[i]
      }
    //  遍历afterArr,查看其元素是否在cenObj中
      for(let j=0;j<afterArr.length;j++){
        if(!cenObj[afterArr[j].id]){
          const obj={
            deptId:afterArr[j].id,
            deptName:afterArr[j].name,
            chgMod:'add',
          }
          add.push(obj)
        }else {
          delete cenObj[afterArr[j].id]
        }
      }
      for (let k in cenObj){
        const obj={
          deptId:cenObj[k].id,
          deptName:cenObj[k].name,
          chgMod:'del',
        }
        del.push(obj)
      }
      const arr=[].concat(add,del)
      return arr
    }

    filterRepeat(arr) {
      // 去掉相同id的项目
      /*
        @element: 当前遍历到的元素。
        @index: 当前遍历到的索引。
        @self: 数组本身。
        */
      arr = arr.filter((element, index, self) => {
        return self.findIndex((el) => el.id === element.id) === index;
      });
      return arr;
    }

    async handleClose(dept) {
      const res = await IdentityApi.allowDeleteBing(this.userForm.username);
      if (res) {
        let departments = this.userForm.departments;
        let newDepartments = [] as any[];
        departments.forEach((item)=> {
          if (item.id != dept.id) {
            newDepartments.push(item);
          }
          // else{
            // const index=this.chgDeptVos.findIndex(ele=>ele.id===dept.id)
            // if(index>-1){
            //   if(this.chgDeptVos[index].chgMod=='1'||this.chgDeptVos[index].chgMod=='add'){
            //     this.chgDeptVos[index].chgMod==='del'
            //   }
            // }else{
            //   const obj:any={
            //     deptId:dept.id,
            //     deptName:dept.name,
            //     chgMod:'del'
            //   }
            //   this.chgDeptVos.push(obj)
            // }
          // }
        });
       this.userForm.departments = newDepartments;
       this.getMainName();
      } else {
      this.$message("用户有办件未完成,不允许删除");
      }
    }
  }
</script>

<style lang="scss">
  .user-form-page {
    .deptTag {
      text-align: left;

      .el-tag el-tag--medium el-tag--light {
        color: #616266;
      }

      ::v-deep .custom-el-tag el-tag el-tag--medium el-tag--light {
        border: 1px solid #d3d4d6;
      }
    }

    .el-form .el-form-item {
      float: left;
      width: 100%;
      text-align: left;
    }

    .fingerprintEntering {
      border-radius: 4px;
      border: 1px solid #ecf3ff;
      background-color: #ecf3ff;
      color: #467cf3;
      margin-left: 5px;
    }

    .fingerprintClear {
      border-radius: 4px;
      border: 1px solid #ffb7b9;
      background-color: #ffebed;
      color: #ff5e67;
      margin-left: 10px;
    }

    .telephoneForm {
      .el-form-item__content {
        display: flex;

        .el-button {
          margin-left: 5px;
        }
        i{
          cursor: pointer;
        }
      }
    }
    .districtForm {
      .el-form-item__content {
        display: flex;
        .el-button {
          margin-left: 5px;
        }
      }
    }
  }
  .bindDialog{
    .el-dialog__body {
      max-height: 40% !important ;
      overflow: auto;
      padding: 10px 20px;
      height: 150px;
    }
    .dialog-footer{
      font-size: 20px;
    }
  }
  .relate {
    .custom-tree-node {
      display: flex;
      .icon {
        margin-top: 4px;
        margin-right: 2px;
      }
    }
    .el-dialog {
      margin-top: calc((100vh - 540px) / 2) !important;
      margin-bottom: calc((100vh - 540px) / 2) !important;
    }
    .el-dialog__body {
      max-height: 70% !important ;
      overflow: auto;
      padding: 10px 20px;
      height: 400px;
    }
  }
  .department-tree-dialog {
    /deep/.el-dialog {
      text-align: left;
      height: 500px;
      width: 30%;

      /deep/ .el-form {
        padding: 0 !important;
      }

      /deep/.dialog-footer {
        text-align: right;
      }

      /deep/ .el-tree-node__content {
        color: black;
      }
      /deep/.el-dialog__body {
        padding: 10px 20px;
        box-sizing: border-box;
      }
    }
  }
  .filter-dialog-tree {
    height: 370px;
    overflow: auto;
  }
</style>
