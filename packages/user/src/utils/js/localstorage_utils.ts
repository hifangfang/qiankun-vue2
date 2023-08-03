import MICRO_CONFIG from '@/api/platform_config';
import {getUrlParam,getQueryString} from "@/utils/js/url_path_utils";
//处于/bi/ 的预览界面 向appObject里存储值或取值
let isView;
try {
  let topHref=window.top.location.href
  isView= topHref.indexOf('/bi/') >0
}catch (e) {
  console.log(e)
}
//调用bilogin即向appObject里存储值或取值
let href= window.location.href;
let isBilogin=href.indexOf('/bilogin')>0
export class LocalStorageUtil {
  static getItem(key: any) {
    if (MICRO_CONFIG.isLocalStorageSubGuidFilter&&(isView||isBilogin)) {
      try {
        let subGuid = this.getSubGuid() as string;
        if (subGuid) {
          console.log('subGuid:' + subGuid);
        } else {
          console.log('subGuid未获取到');
        }
        let appObjectStr = localStorage.getItem("appObject");
        if (appObjectStr) {
          let appObject = JSON.parse(appObjectStr);
          let appInfo = appObject[subGuid];
          return appInfo[key];
        }
      } catch (error) {
        console.log("获取" + key + "的localstorage失败");
        console.error(error);
      }
    } else {
      return localStorage.getItem(key);
    }
    return "";

  }

  static setItem(key: any, val: any) {
    if (MICRO_CONFIG.isLocalStorageSubGuidFilter&&(isView||isBilogin)) {
      try {
        //appObject是规定取值的key，每个应用的值以json的形式存在这里
        let appObjectStr = localStorage.getItem("appObject");
        if (appObjectStr) {
          let subGuid = this.getSubGuid() as string;
          //转为json格式，然后取到当前应用的值
          let appObject = JSON.parse(appObjectStr);
          let appInfo = appObject[subGuid];
          //appInfo有时格式是string有时格式为object，这里判断一下，类型为string的时候再执行JSON.parse，否则会出错
          if (appInfo instanceof String || typeof (appInfo) === 'string') {
            appInfo = JSON.parse(appObject[subGuid]);
          }
          //因为是set，所以将值修改后再保存一下
          appInfo[key] = val;
          appObject[subGuid] = appInfo;
          localStorage.setItem('appObject', JSON.stringify(appObject));
        } else {
          let appObject = {};
          let appinfo = {};
          appinfo[key] = val;
          let subGuid = this.getSubGuid() as string;
          appObject[subGuid] = appinfo;
          localStorage.setItem('appObject', JSON.stringify(appObject));
        }
      } catch (error) {
        console.log("修改" + key + "的localstorage失败");
        console.error(error);
      }
    } else {
      localStorage.setItem(key, val);
    }

  }

  static clear() {
    localStorage.clear();
  }

  static removeItem(key: any) {
    localStorage.removeItem(key);
  }

  static removeAppObjectItem(key: string) {
    if (MICRO_CONFIG.isLocalStorageSubGuidFilter) {
      try {
        //appObject是规定取值的key，每个应用的值以json的形式存在这里
        let appObjectStr = localStorage.getItem("appObject");
        if (appObjectStr) {
          try {
            appObjectStr = JSON.parse(appObjectStr);
            if (appObjectStr != null) {
              delete appObjectStr[key];
            }
          } catch (e) {
            console.error(appObjectStr);
          }
          localStorage.setItem("appObject", JSON.stringify(appObjectStr));
        }
      } catch (error) {
        console.log("删除" + key + "的localstorage失败");
        console.error(error);
      }
    } else {
      localStorage.clear();
    }

  }

  static getSubGuid() {
    try {
      //先从url中取
      let subGuid = getUrlParam('subGuid') as string;
      if (!subGuid) {
        //如果url中没有，取应用发布url，如/bi/xxx
        let href = window.location.href;
        if (window.top) {
          href = window.top.location.href;
        }
        if (href && href.indexOf('/bi/') != -1) {
          //这里可以调用服务获取subGuid，但是调服务还需要获取token，所以考虑登录时就生成每个应用发布url和subGuid的键值对存到localstorage
          //k是应用发布url，如/bi/xxx，它在localstorage中的值就是应用subGuid
          let k;
          if (href.indexOf("?") != -1) {
            k = href.substring(href.indexOf("/bi/"), href.indexOf("?"));
          } else {
            k = href.substring(href.indexOf("/bi/"));
          }

          let appObjectStr = localStorage.getItem("appObject");
          if (appObjectStr) {
            let appObject = JSON.parse(appObjectStr);
            subGuid = appObject[k];
          }
        }
      }
      return subGuid;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
  //使用本项目链接地址拼接相关参数 存储相关参数
  static getHrefQueryData(){
    //获取token
    let href = window.location.href;
    let t = getUrlParam('token');
    if (t !== '' && t !== null) {
      //判断是否有bearer
      let haveToken = t.toLowerCase();
      if(href.indexOf('/bi/') >=0 || href.indexOf('/bilogin') >=0){
        if (haveToken.startsWith("bearer")) {
          this.setItem("X-Gisq-Token", t);
        } else {
          this.setItem("X-Gisq-Token", "Bearer " + t);
        }
        this.setItem('loginflag', 'true');
        let Base64 = require("js-base64").Base64;
        let tokensplit = t.split(".");
        if (tokensplit.length > 1) {
          let a = Base64.decode(t.split(".")[1]);
          let loginname = JSON.parse(a).user_name;
          this.setItem('username', loginname);
          let userId = JSON.parse(a).user_id;
          this.setItem('userId', userId);
        }
      }else{
        if (haveToken.startsWith("bearer")) {
          window.localStorage.setItem("X-Gisq-Token", t);
        } else {
          window.localStorage.setItem("X-Gisq-Token", "Bearer " + t);
        }
        window.localStorage.setItem('loginflag', 'true');
        // @ts-ignore
        let Base64 = require("js-base64").Base64;
        let tokensplit = t.split(".");
        if (tokensplit.length > 1) {
          let a = Base64.decode(t.split(".")[1]);
          let loginname = JSON.parse(a).user_name;
          window.localStorage.setItem('username', loginname);
          let userId = JSON.parse(a).user_id;
          window.localStorage.setItem('userId', userId);
        }
      }
      // next(from.fullPath)
    }
  }

}
