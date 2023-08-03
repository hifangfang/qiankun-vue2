import aes_utils from "@/utils/js/aes_utils";
import axios from 'axios';
import {MICRO_CONFIG} from '@/api/platform-config';
import {UserLoginResponse} from "@/api/auth/user-login-response.model";
import {LocalStorageUtil} from "@/utils/js/localforage-utils";
import localforage from "localforage";
const ip = localforage.ip !== "undefined" ? localforage.ip : "";

export class AuthApi {
  static async login(username, password,subGuid) {
    let res = {};
    if (MICRO_CONFIG.innerCode === true) {
      let codeParm = {
        "x-gisq-deviceId": MICRO_CONFIG.diviceId
      }
      const codeRsp = await axios({
        method: 'get',
        url: MICRO_CONFIG.auth + "/auth/code/imagestr",
        params: codeParm
      });
      const tokenParm = {
        "username": username,
        "password": password,
        "x-gisq-deviceId": MICRO_CONFIG.diviceId,
        "imageCode": codeRsp.data.imageCode
      }
      var username_password_aes = "";
      username_password_aes = aes_utils.encrypt(JSON.stringify(tokenParm));
      let param = {
        encryptuserinfo: username_password_aes,
        useValidateCode: "false",
        ip: ip
      };
      res = await axios({
        method: 'post',
        url: MICRO_CONFIG.auth + "/auth/oauth/login",
        params: param
      });
    } else {
      res = await axios({
        method: 'post',
        url: MICRO_CONFIG.auth + "/auth/oauth/login",
        params: getLoginParamAfterEncrypt(username, password)
      });
    }
    const {data: userLoginRes} = res;
    let token = userLoginRes.access_token,

        exdate = new Date(); //获取时间
    exdate.setTime(exdate.getTime() + 60 * 60 * 1000 * 6);
    userLoginRes.systemUser = userLoginRes.system_user; //for bi使用
    //登录成功跳转之前添加一个登录成功标记
    const userNickname = decodeURIComponent(userLoginRes.user_nickname)
    const user_name = decodeURIComponent(userLoginRes.user_name)
    //token锁屏重新登录 根据subGuid设置缓存值
    if(!subGuid){
      localforage.setItem("userNickname", userNickname);
      localforage.setItem("username", user_name);
      localforage.setItem("beforeTelephoneTm", userLoginRes.user_tel);
      localforage.setItem("userId", userLoginRes.user_id);
      localforage.setItem("loginflag", "true");
      localforage.setItem("X-Gisq-Token", "Bearer " + token);
      localforage.setItem("tempToken", userLoginRes.tempToken);
      localforage.setItem("gisqPublic", userLoginRes.gisqPublic);
      localforage.setItem("accessToken", token);
      localforage.setItem("initPasswordModifyFlag", userLoginRes.initPasswordModifyFlag);  //首次登录或重置密码后需修改密码
      localforage.setItem("initPasswordModifyCause", userLoginRes.initPasswordModifyCause);  //强制修改密码提示说明
      localforage.setItem("tokenFail", "false");
      localforage.setItem("userinfo", JSON.stringify(userLoginRes));
      localforage.setItem("tokenLost", "false");
      sessionStorage.setItem("loginStatus", "true");
    }else{
      LocalStorageUtil.setItem("X-Gisq-Token", "Bearer " + token);
      LocalStorageUtil.setItem("accessToken",token)
    }
    document.cookie =
        "X-Gisq-Token" +
        "=Bearer " +
        token +
        ";path=/;expires=" +
        exdate.toUTCString();

    return userLoginRes;
  };

  static zzdLoginApi = MICRO_CONFIG.auth + "/auth/auu/authCode?type=token&authCode=";

  static async zzdLogin(authCode, zzdAppCode) {
    const response = await axios.get<UserLoginResponse>(this.zzdLoginApi + authCode + "&zzdAppCode=" + zzdAppCode);
    return response.data;
  }

  static refreshTokenUrl = MICRO_CONFIG.auth + "auth/oauth/token?refreshToken={token}";

  static async refreshToken(refreshToken) {
    const {data: userLoginRes} = await axios({
      method: 'post',
      url: this.refreshTokenUrl.replace("{token}", refreshToken)
    });

    let token = userLoginRes.access_token,
        exdate = new Date(); //获取时间
    exdate.setTime(exdate.getTime() + 60 * 60 * 1000 * 6);
    //登录成功跳转之前添加一个登录成功标记
    localforage.setItem("username", userLoginRes.user_name);
    localforage.setItem("loginflag", "true");
    localforage.setItem("X-Gisq-Token", "Bearer " + token);
    localforage.setItem("accessToken", token);
    document.cookie =
        "X-Gisq-Token" +
        "=Bearer " +
        token +
        ";path=/;expires=" +
        exdate.toUTCString();

    return userLoginRes;
  };

  //删除redis中的token
  static removeTokenUrl = MICRO_CONFIG.auth + "auth/removeToken";

  static async removeToken() {
    await axios({
      method: 'post',
      url: this.removeTokenUrl
    });
  };

//  获取短信验证码
  static sendMobileCodeUrl = MICRO_CONFIG.base + "base/shortmsg/sendMobileCode"

  static async sendMobileCode(vo) {
    const response = await axios.post<Api_response<any>>(this.sendMobileCodeUrl, vo);
    return response.data.data;
  }

// 手机号+短信验证码登录
  static phonecodeUrl = MICRO_CONFIG.auth + "/auth/auu/phonecode"

  static async phonecodeLogin(vo,subGuid) {
    const response = await axios.post<any>(
        this.phonecodeUrl + "?mobileCode=" + vo.mobileCode + "&mobile=" + vo.mobile);
    const userLoginRes = response.data.data;
    let token = userLoginRes.access_token,
        exdate = new Date(); //获取时间
    exdate.setTime(exdate.getTime() + 60 * 60 * 1000 * 6);
    //登录成功跳转之前添加一个登录成功标记
    const userNickname = decodeURIComponent(userLoginRes.user_nickname)
    const user_name = decodeURIComponent(userLoginRes.user_name)
    //token锁屏重新登录 根据subGuid设置缓存值
    if(!subGuid){
      localforage.setItem("userNickname", userNickname);
      localforage.setItem("username", user_name);
      localforage.setItem("beforeTelephoneTm", userLoginRes.user_tel);
      localforage.setItem("userId", userLoginRes.user_id);
      localforage.setItem("loginflag", "true");
      localforage.setItem("X-Gisq-Token", "Bearer " + token);
      localforage.setItem("accessToken", token);
      localforage.setItem("tempToken", userLoginRes.tempToken);
      localforage.setItem("gisqPublic", userLoginRes.gisqPublic);
      localforage.setItem("tokenFail", "false");
      localforage.setItem("userinfo", JSON.stringify(userLoginRes));
      localforage.setItem("initPasswordModifyFlag", userLoginRes.initPasswordModifyFlag);  //首次登录或重置密码后需修改密码
      localforage.setItem("initPasswordModifyCause", userLoginRes.initPasswordModifyCause);  //强制修改密码提示说明
    }else{
      LocalStorageUtil.setItem("X-Gisq-Token", "Bearer " + token);
      LocalStorageUtil.setItem("accessToken",token)
    }
    document.cookie =
        "X-Gisq-Token" +
        "=Bearer " +
        token +
        ";path=/;expires=" +
        exdate.toUTCString();
    return response.data.data;
  }
}


function getLoginParamAfterEncrypt(username, password) {
//请求后端,请求参数加密下
  var username_password_aes = aes_utils.encrypt(JSON.stringify({username, password}));
  // 登录调用网关的登录服务，encryptuserinfo中为用户名和密码通过aes加密后的结果，useValidateCode为是否使用验证码登录
  // 目前没有用到验证码，所以为false，验证码的接口在oauth服务中已经有了，需要的时候可以直接用
  let param = {
    encryptuserinfo: username_password_aes,
    useValidateCode: "false",
    ip: ip
  };
  return param;
}
