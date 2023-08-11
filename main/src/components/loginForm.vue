<template>
  <div class="main-login-box">
    <!--启用验证码登录      -->
    <el-tabs
      v-if="showCodeLogin && loginType !== 'authentication'"
      v-model="activeName"
      class="login-type-wrap"
      @tab-click="handleClick"
    >
      <el-tab-pane name="password">
        <span slot="label">
          <i class="iconfont zwpt_mimadenglu"></i>
          <span>密码登录</span>
        </span>
        <el-form
          ref="AccountForm"
          :model="account"
          :rules="rules"
          label-position="left"
          label-width="0px"
          class="demo-ruleForm loginform"
        >
          <el-form-item prop="username">
            <i class="iconfont zwpt_username"></i>
            <el-input
              type="text"
              v-model="account.username"
              placeholder="请输入账号"
              class="input_set"
              autofocus
              auto-complete="off"
              :disabled="getLoginFormShow() ? true : false"
            ></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <i class="iconfont zwpt_password-login"></i>
            <!--                              :type="((readonly && account.pwd) || account.pwd)?'password':'text'"
-->
            <el-input
              v-if="getLoginFormShow()"
              :type="passwordType"
              :readonly="readonly"
              auto-complete="confirm-password"
              v-model="account.pwd"
              placeholder="请输入登录密码"
              class="input_set"
              @keyup.enter.native="handleLogin"
              @focus="changAttr($event, 'focus')"
              @blur="changAttr($event, 'blur')"
              @input="changAttr($event, 'input')"
              @click.native="clickEvt"
              ref="password"
            ></el-input>
            <el-input
              v-else
              :type="passwordType"
              v-model="account.pwd"
              :autofocus="pwdFocus"
              auto-complete="off"
              @keyup.enter.native="handleLogin"
              placeholder="请输入登录密码"
              class="input_set"
            ></el-input>
            <i style="cursor: pointer" class="iconfont" :class="passwordIcon" @click="isShowPassword"></i>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="code">
        <span slot="label">
          <i class="iconfont zwpt_yanzhengmadenglu"></i>
          <span>验证码登录</span>
        </span>
        <el-form
          ref="codeForm"
          :model="codeLogin"
          :rules="codeRules"
          label-position="left"
          label-width="0px"
          class="demo-ruleForm loginform"
        >
          <el-form-item prop="mobile">
            <i class="iconfont zwpt_shoujihao"></i>
            <el-input
              :disabled="getLoginFormShow() ? true : false"
              type="text"
              v-model="codeLogin.mobileTm"
              @input="getMobile"
              autofocus
              auto-complete="off"
              placeholder="请输入手机号"
              class="input_set"
            ></el-input>
          </el-form-item>
          <el-form-item prop="mobileCode">
            <i class="iconfont zwpt_shoujiyanzhengma"></i>
            <el-input
              v-model="codeLogin.mobileCode"
              placeholder="请输入短信验证码"
              @keyup.enter.native="handleLogin"
              class="input_set"
            ></el-input>
            <el-button type="text" class="getCode" @click="getMobileCode">{{ codeText }}</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!--未启用验证码登录-->
    <div v-else>
      <span class="login-password-wrap">
        <span>{{ loginType == "authentication" ? "密码认证" : "密码登录" }}</span>
      </span>
      <el-form
        ref="AccountForm"
        :model="account"
        :rules="rules"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm loginform"
      >
        <el-form-item prop="username">
          <i class="iconfont zwpt_username"></i>
          <el-input
            type="text"
            v-model="account.username"
            placeholder="请输入账号"
            class="input_set"
            autofocus
            auto-complete="off"
            :disabled="getLoginFormShow() ? true : false"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <i class="iconfont zwpt_password-login"></i>
          <el-input
            v-if="getLoginFormShow()"
            :type="passwordType"
            :readonly="readonly"
            auto-complete="confirm-password"
            v-model="account.pwd"
            placeholder="请输入登录密码"
            class="input_set"
            @keyup.enter.native="handleLogin"
            @focus="changAttr($event, 'focus')"
            @blur="changAttr($event, 'blur')"
            @input="changAttr($event, 'input')"
            @click.native="clickEvt"
            ref="password"
          ></el-input>
          <el-input
            v-else
            :type="passwordType"
            v-model="account.pwd"
            :autofocus="pwdFocus"
            auto-complete="off"
            @keyup.enter.native="handleLogin"
            placeholder="请输入登录密码"
            class="input_set"
          ></el-input>
          <i style="cursor: pointer" class="iconfont" :class="passwordIcon" @click="isShowPassword"></i>
        </el-form-item>
      </el-form>
    </div>
    <div class="rememberpassword" label-width="15px">
      <el-checkbox v-if="!getLoginFormShow()" v-model="checked">记住密码</el-checkbox>
      <span v-if="!getLoginFormShow()" class="registerbtn" @click="register">用户注册</span>
    </div>
    <div class="loginbtn" @click="handleLogin">
      <el-button type="text" :loading="loading">登录</el-button>
    </div>
    <span v-if="tokenFail" class="footer-text">重新登录后，若出现数据丢失可手动刷新页面查看</span>
  </div>
</template>
<script>
import { AuthApi } from "@/api/auth/auth-api.ts";
import { IdentityApi } from "@/api/identity/module/identity-api.ts";
import { BaseApi } from "@/api/base/module/base-api.ts";
import { WaterMarkService } from "@/utils/js/water-mark.service.js";
import bus from "@/utils/js/bus.js";
import ColumnCommon from "@/utils/js/common.js";
// import { WebSoketAPI } from "@/api/websoket/websoket-api.ts";
import { getUrlParam } from "@/utils/js/urlpath-utils.js";
import { LocalStorageUtil } from "@/utils/js/localforage-utils.js";
export default {
  props: {
    // 是否是token失效弹窗
    tokenFail: {
      type: Boolean,
      default: false,
    },
    subGuid: {
      type: String,
      default: "",
    },
    // 登录类型:tokenFail-登录失效弹窗；authentication-二次验证获取脱敏数据弹窗
    loginType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      account: {
        username: "",
        pwd: "",
      },
      pwdFocus: false,
      checked: false,
      rules: {
        username: [{ required: true, message: "账号不能为空", trigger: "change" }],
        pwd: [{ required: true, message: "登录密码不能为空", trigger: "change" }],
      },
      passwordType: "",
      passwordIcon: "zwpt_viewHide",
      activeName: "password",
      //手机验证码
      codeLogin: {
        mobile: "",
        mobileTm: "",
        mobileCode: "",
      },
      codeRules: {
        mobile: [
          {
            validator: (rule, value, callback) => {
              let mobile = /^0?(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])[0-9]{8}$/;
              if (value == "" || value == undefined) {
                callback(new Error("手机号不能为空"));
              } else {
                if (mobile.test(value)) {
                  return callback();
                } else {
                  callback(new Error("手机号码格式不正确"));
                }
              }
            },
            required: true,
            trigger: "change",
          },
        ],
        mobileCode: [{ required: true, message: "短信验证码不能为空", trigger: "change" }],
      },
      codeText: "获取验证码",
      codeTime: 0,
      showCodeLogin: false,
      websoket: "",
      readonly: false,
    };
  },
  created() {
    this.clickChange();
    //获取登录组件相关状态及显示
    this.getLoginFormShow();
    var rememberPassword = window.localStorage.getItem("rememberPassword");
    //  记住密码功能 获取保存的密码   密码加密
    let Base64 = require("js-base64").Base64;
    if (rememberPassword == "true") {
      this.checked = true;
      this.account.username = localStorage.username;
      if (!this.getLoginFormShow()) {
        this.account.pwd = Base64.decode(localStorage.password);
      }
    }
    //token失效 锁屏弹窗 处理账户名和手机号
    console.log(this.tokenFail, this.subGuid, this.loginType);
    if (this.getLoginFormShow()) {
      if (this.subGuid) {
        let userInfo = this.getAppObjectKeyValue(this.subGuid, "userinfo");
        userInfo = ColumnCommon.isJSON(userInfo) ? JSON.parse(userInfo) : userInfo;
        //bi存在配置项 是否往appObject里存储userinfo用户信息
        this.account.username = decodeURIComponent(
          !this.isEmpty(userInfo) ? userInfo.user_name : localStorage.user_name
        );
        const beforeTelephone = this.getAppObjectKeyValue(this.subGuid, "beforeTelephone");
        //获取脱敏电话
        const beforeTelephoneTm = this.getAppObjectKeyValue(this.subGuid, "beforeTelephoneTm");
        this.codeLogin.mobile = beforeTelephone ? beforeTelephone : "";
        this.codeLogin.mobileTm = beforeTelephoneTm ? beforeTelephoneTm : "";
      } else {
        this.account.username = localStorage.username;
        this.codeLogin.mobile = localStorage.beforeTelephone;
        this.codeLogin.mobileTm = localStorage.beforeTelephoneTm;
      }
    }
    this.passwordType = this.getLoginFormShow() ? "text" : "password";
  },
  methods: {
    async clickChange() {
      let propertyKeys = ["SMSVerificationCodeLogin"];
      let params = {
        subGuid: this.subGuid,
        propertyKeys: propertyKeys,
      };
      const data = await BaseApi.getCodeValuePropertysByKeys(params);
      if (data.length > 0) {
        //获取变量配置的是否启用验证码登录功能
        const codeLoginData = data.filter((item) => item.key == "SMSVerificationCodeLogin");
        this.showCodeLogin = codeLoginData.length > 0 && codeLoginData[0].value == "1" ? true : false;
      }
    },
    getLoginFormShow() {
      //登录失效弹窗或二次验证获取脱敏数据弹窗
      if (this.tokenFail || this.loginType == "authentication") {
        return true;
      } else {
        return false;
      }
    },
    //取消浏览器记住密码
    changAttr(e, type) {
      if (type === "focus") {
        if (e) {
          e.stopPropagation();
          e.preventDefault();
        }
        setTimeout(() => {
          this.readonly = false;
        }, 100);
      } else if (type === "blur") {
        if (e) {
          e.stopPropagation();
        }
        this.readonly = true;
      } else {
        if (e) {
          if (this.passwordIcon == "zwpt_viewHide") {
            this.passwordType = "password";
          }
        } else {
          this.readonly = true;
          this.passwordType = "text";
        }
      }
    },
    clickEvt() {
      if (this.$refs.password) {
        this.$refs.password.$refs.input.onmousedown = (evt) => {
          if (evt) {
            evt.preventDefault();
            evt.stopPropagation();
          }
          if (this.account.pwd === "" || this.readonly) {
            this.$refs.password.$refs.input.blur();
            setTimeout(() => {
              this.$refs.password.$refs.input.focus();
            }, 0);
            if (this.passwordIcon == "zwpt_viewHide") {
              this.passwordType = "password";
            }
          }
          return false;
        };
      }
    },
    isShowPassword() {
      if (this.passwordType == "password") {
        this.passwordType = "text";
        this.passwordIcon = "zwpt_viewShow";
      } else {
        this.passwordType = "password";
        this.passwordIcon = "zwpt_viewHide";
      }
    },
    async register() {
      this.$router.push({ path: "/register" });
    },
    getMobile(value) {
      this.codeLogin.mobile = value;
    },
    async handleLogin() {
      //密码登录
      if (this.activeName == "password" || !this.showCodeLogin) {
        this.$refs.AccountForm.validate(async (valid) => {
          if (valid) {
            let result = {
              username: this.account.username,
              password: this.account.pwd,
              checked: this.checked,
            };
            this.loading = true;
            try {
              setTimeout(() => {
                this.loading = false;
              }, 1000);
              const res = await AuthApi.login(result.username, result.password, this.subGuid);
              //登录成功之后跳转及页面刷新
              await this.handelLoginSuccess(res);
              //记录是否记住密码
              // this.$store.commit("changeRemember",result)
            } catch (e) {
              console.log(e);
              this.loading = false;
            }
          }
        });
      } else {
        this.$refs.codeForm.validate(async (valid) => {
          if (valid) {
            let result = {
              mobileCode: this.codeLogin.mobileCode,
              mobile: this.codeLogin.mobile,
              checked: this.checked,
            };

            this.loading = true;
            try {
              setTimeout(() => {
                this.loading = false;
              }, 1000);
              const res = await AuthApi.phonecodeLogin(result, this.subGuid);
              //登录成功之后跳转及页面刷新
              await this.handelLoginSuccess(res);
            } catch (e) {
              this.loading = false;
            }
          }
        });
      }
    },
    //  获取短信验证码
    async getMobileCode() {
      if (this.codeTime > 0) return;
      this.$refs.codeForm.validateField(["mobile"], async (Error) => {
        if (!Error) {
          const param = {
            subGuid: "",
            telephone: this.codeLogin.mobile,
          };
          await AuthApi.sendMobileCode(param);
          this.openTimer();
        } else {
          console.log(Error);
        }
      });
    },
    async getPlatInfo() {
      // add by lyh 2019-12-18 获取标题部门等相关信息
      const platinfo = await BaseApi.getPlatInfo();
      localStorage.setItem("deptName", platinfo.deptName);
      localStorage.setItem("staffName", platinfo.staffName);
      localStorage.setItem("userId", platinfo.userId);
      localStorage.setItem("deptId", platinfo.deptId);
      localStorage.setItem("xzqdm", platinfo.xzqdm);
      localStorage.setItem("roles", platinfo.roles);
      localStorage.setItem("modulus", platinfo.modulus);
      localStorage.setItem("exponent", platinfo.exponent);
      localStorage.setItem("systemUser", platinfo.systemUser);
      localStorage.setItem("lockScreen", platinfo.lockScreen);
      localStorage.setItem("waterMark", platinfo.waterMark);
      localStorage.setItem("ip", platinfo.ip);
      localStorage.setItem("roleCodes", platinfo.roleCodes);
      localStorage.setItem("pullData", platinfo.pullData); //用户管理-数据同步
      this.$emit("changeStarfName", platinfo.staffName);
      //添加流程回放地址
      localStorage.setItem("platformExplorerDiagramUrl", platinfo.platformExplorerDiagramUrl);
    },
    openTimer() {
      this.codeTime = 60;
      this.handleTimer();
    },
    handleTimer() {
      if (this.codeTime > 0) {
        this.codeTime--;
        setTimeout(this.handleTimer, 1000);
      } else {
        this.codeTime = 0;
      }
      this.codeText = this.codeTime > 0 ? this.codeTime + "s后重新获取" : "获取验证码";
    },
    //处理登录之后的跳转及刷新
    async handelLoginSuccess(res) {
      if (this.getLoginFormShow()) {
        if (this.subGuid) {
          bus.$emit("showBiLoginpageUrl", { isDialog: false, subGuid: this.subGuid });
          const subGuid = this.subGuid;
          // 子应用的storage需要替换
          //appObject是规定取值的key，每个应用的值以json的形式存在这里
          let appObjectStr = localStorage.getItem("appObject");
          if (appObjectStr) {
            //转为json格式，然后取到当前应用的值
            let appObject = JSON.parse(appObjectStr);
            let appInfo = appObject[subGuid];
            //appInfo有时格式是string有时格式为object，这里判断一下，类型为string的时候再执行JSON.parse，否则会出错
            if (appInfo instanceof String || typeof appInfo === "string") {
              appInfo = JSON.parse(appObject[subGuid]);
            }
            //因为是set，所以将值修改后再保存一下
            appInfo["userinfo"] = res;
            appInfo["tokenLost"] = false;
            appObject[subGuid] = appInfo;
            localStorage.setItem("appObject", JSON.stringify(appObject));
          }
          //同一个账号 子应用级别重新登录锁屏消失，运维平台锁屏也消失
          const token = localStorage.getItem("X-Gisq-Token");
          const appToken = LocalStorageUtil.getItem("X-Gisq-Token");
          if (token === appToken) {
            localStorage.setItem("tokenLost", "false");
          }
        } else {
          //锁屏页面 重新登录
          this.initSoket();
          localStorage.setItem("tokenLost", "false");
          //同一个账号 运维平台重新登录锁屏消失，相同账号的子应用锁屏也消失
          this.setAppObjectTokenLost();
        }
        //抛出关闭事件
        this.$emit("closeLoginForm");
      } else {
        //获取系统变量
        await this.getPlatInfo();
        //获取密码校验规则
        let data = await IdentityApi.pwdCheck();
        let ff = this.account.pwd.match(data.rev);
        if (ff == null) {
          localStorage.setItem("pflag", false + "♀" + data.key + "♀" + data.rev);
        } else {
          localStorage.setItem("pflag", true + "♀" + data.key + "♀" + data.rev);
        }
        this.$store.commit("permission/UPDATE_CURRENT_MODULE_NAME", "main");
        this.$store.commit("permission/UPDATE_CURRENT_PAGE", "/home");

        setTimeout(() => {
          this.$router.push("/home");
        }, 100);
        //添加水印
        await this.addWaterMarkService();
      }
    },
    handleClick() {
      if (this.getLoginFormShow() && this.activeName == "code" && !this.codeLogin.mobileTm) {
        this.$message({
          message: "用户" + this.account.username + "未绑定手机号",
          type: "warning",
        });
      }
    },
    getOpener(windowObj) {
      if (windowObj) {
        windowObj.postMessage(
          {
            type: "toBackHome",
          },
          "*"
        );
        let openerObj = windowObj.opener;
        if (openerObj) {
          this.getOpener(openerObj);
        }
      }
    },
    initSoket() {
      // const loginInfo = {
      //   username: localStorage.getItem("username"),
      //   logintype: "PC",
      //   key: "mac",
      //   staffName: localStorage.getItem("staffName"),
      //   devicetype: "",
      //   reload: window.name,
      //   userId: localStorage.getItem("userId"),
      //   //连接类型为登录类型
      //   linkType: "login",
      //   accessToken: localStorage.getItem("accessToken"),
      //   preview: true,
      //   requestUrl: "/projectHome",
      // };
      // this.websoket = WebSoketAPI.initWebsoket(loginInfo);
    },
    //  添加水印
    addWaterMarkService() {
      const userNickname = localStorage.userNickname;
      let waterMark = localStorage.waterMark;
      const isIframe = getUrlParam("from"); //快速构建平台的页面嵌入门户组件去掉水印
      // waterMark != 'true'  是变量设置-水印配置成是或否，此时也不显示水印
      if (userNickname && waterMark != "" && waterMark != "true" && waterMark != null && isIframe != "link") {
        setTimeout(() => {
          WaterMarkService.create(waterMark, true);
        }, 100);
      }
    },
    getAppObjectKeyValue(subGuid, keyValue) {
      let appObjectStr = localStorage.getItem("appObject");
      if (appObjectStr) {
        //转为json格式，然后取到当前应用的值
        let appObject = JSON.parse(appObjectStr);
        let appInfo = appObject[subGuid];
        //appInfo有时格式是string有时格式为object，这里判断一下，类型为string的时候再执行JSON.parse，否则会出错
        if (appInfo instanceof String || typeof appInfo === "string") {
          appInfo = JSON.parse(appObject[subGuid]);
        }
        if (keyValue) {
          //因为是set，所以将值修改后再保存一下
          return appInfo[keyValue];
        }
      }
    },
    setAppObjectTokenLost() {
      try {
        const token = localStorage.getItem("X-Gisq-Token");
        let appObjectStr = localStorage.getItem("appObject");
        if (appObjectStr) {
          //转为json格式，然后取到当前应用的值
          let appObject = JSON.parse(appObjectStr);
          // 循环appObject token等于当前的失效的 对应的属性全部tokenLost改成false
          for (let key in appObject) {
            let equalToken = appObject[key]["X-Gisq-Token"] === token;
            if (equalToken) {
              appObject[key].tokenLost = false;
            }
          }
          localStorage.setItem("appObject", JSON.stringify(appObject));
        }
      } catch (error) {
        console.log("修改appObject的tokenLost失败");
      }
    },
    isEmpty(value) {
      if (!value || typeof value == "undefined" || value == 0) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style lang="scss">
//.main-login-box {
//  position: absolute;
//  top: 46%;
//  left: 62%;
//  margin-top: -160px;
//  padding: 30px 50px;
//  width: 450px;
//  min-height: 280px;
//  box-sizing: border-box;
//  border: 1px solid #467cf3;
//  background: #0e2851;
//  //opacity: 0.8;
//  border-radius: 10px;
//  z-index: 99;
//  .login-type-wrap {
//    .el-tabs__header {
//      .el-tabs__nav {
//        margin-left: 75px;
//      }
//      .el-tabs__item {
//        width: 100px;
//        height: 70px !important;
//        line-height: normal;
//        > span {
//          width: 100%;
//          height: 100%;
//          display: flex;
//          flex-wrap: wrap;
//          justify-content: center;
//          color: #c0c4cc;
//          i {
//            display: block;
//            font-size: 32px;
//          }
//        }
//      }
//      .el-tabs__item.is-active {
//        > span {
//          color: #467cf3;
//        }
//      }
//    }
//  }
//  .login-password-wrap {
//    > span {
//      display: inline-block;
//      width: 100%;
//      font-size: 22px;
//      color: #fff0f0;
//      margin-bottom: 10px;
//      text-align: center;
//    }
//  }
//  .el-form {
//    .el-form-item {
//      height: 50px;
//      line-height: 50px;
//      margin-bottom: 18px;
//      &:nth-child(1),
//      &:nth-child(2) {
//        border: 1px solid #467cf3;
//        .el-form-item__content {
//          display: flex;
//          line-height: 50px !important;
//
//          i {
//            height: 50px;
//            line-height: 50px;
//            padding: 0 8px;
//            color: white;
//            font-size: 22px;
//          }
//          .el-input {
//            height: 50px;
//            line-height: 50px;
//            .el-input__inner {
//              height: 50px;
//              line-height: 50px;
//              border: none;
//              background-color: transparent;
//              color: #ffffff;
//            }
//          }
//          .input_set .el-input__inner:-webkit-autofill {
//            //input 背景色
//            -webkit-box-shadow: 0 0 0px 1000px #0e2851 inset !important;
//            //input字体颜色 颜色根据自己要求替换
//            -webkit-text-fill-color: #ffffff !important;
//          }
//          .getCode {
//            padding: 8px;
//            color: #467cf3;
//          }
//        }
//      }
//    }
//  }
//
//  .rememberpassword {
//    .el-checkbox__label {
//      color: #ffffff;
//    }
//    .el-checkbox__input.is-checked .el-checkbox__inner {
//      background-color: #557cec;
//      border-color: #557cec;
//    }
//    .el-checkbox__input.is-checked + .el-checkbox__label {
//      color: #557cec;
//    }
//    .registerbtn {
//      float: right;
//      font-size: 14px;
//      font-family: PingFang SC;
//      font-weight: 400;
//      color: #ffffff;
//      cursor: pointer;
//    }
//  }
//  .loginbtn {
//    margin-top: 10px;
//    .el-button {
//      width: 100%;
//      height: 47px !important;
//      line-height: 47px !important;
//      background: #467cf3;
//      border-radius: 4px;
//      color: white;
//      font-size: 18px;
//      padding: 0;
//    }
//  }
//}
</style>
