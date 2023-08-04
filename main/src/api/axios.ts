import axios from "axios";
import store from "../store";
//认证集成start
// @ts-ignore
import { ApiRequestError, ApiResultCode } from "./api_response.ts";
import { Loading, Message } from "element-ui";
import { getUrlParam, getQueryString, isAppViewOrLogin } from "@/utils/js/urlpath-utils.js";
import { LocalStorageUtil } from "@/utils/js/localforage-utils.js";
import MICRO_CONFIG from "./platform-config";
import bus from "@/utils/js/bus";
//认证集成end
axios.defaults.withCredentials = true;
var loadingInstance;
//认证集成start
axios.interceptors.request.use(
  (config) => {
    //当请求是从bi页面进入的时候，token需要用bi登录的token
    let token = window.localStorage.getItem("X-Gisq-Token");

    if (config.url?.indexOf("Api") == -1) {
      config.headers["X-Gisq-Token"] = token;
    }
    //开发环境的时候注释掉config.headers['X-Gisq-Token'] ，放开  config.url +=
    //config.url += '?access_token=' + token?.substr('bearer '.length);

    config.cancelToken = new axios.CancelToken(function (cancel) {
      store.commit("pushToken", { cancelToken: cancel });
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (res) => {
    if (res.data.code === 702) {
      localStorage.removeItem("access-user");
      window.location.href = MICRO_CONFIG.routePath + "/#/login";
      // (this as any).$router.push()
    } else if (res.data.user) {
      localStorage.setItem("access-user", res.data.user);
    }
    if (res) {
      //请求的服务地址为表单服务时的拦截处理
      if (res.request.responseURL.indexOf("gisqForm") >= 0) {
        //表单导入时检验表单的接口不需要提示出信息而且数据层级与中台接口层级不同 需单独判断
        if (
          res.request.responseURL.indexOf("checkImportFormExist") >= 0 ||
          res.request.responseURL.indexOf("exportForm") >= 0
        ) {
          return res;
        } else {
          if (res.data && res.data.status && res.data.code && res.data.status != 200 && res.data.code != 200) {
            loadingInstance?.close();
            Message({
              message: res.data.msg ? res.data.msg : "请求失败",
              type: "error",
              duration: 3 * 1000,
            });
          }
        }
        loadingInstance?.close();
        return res;
      } else {
        if (res.data instanceof Blob) {
          if (res.status != 200) {
            //如果有loading，隐藏loading
            loadingInstance?.close();
            Message({
              message: "获取文件失败",
              type: "error",
              duration: 3 * 1000,
            });
            throw new ApiRequestError(ApiResultCode.error, "获取文件失败");
          }
          loadingInstance?.close();
          return res;
        }
        //后端接口请求报错时
        if (res.data && res.data.status && res.data.status != 200 && res.data.code != 200) {
          //请求的服务地址为BI服务时的拦截处理
          if (res.request.responseURL.indexOf("gisqBI") >= 0) {
            res.data.msg = "BI服务：" + res.data.msg;
            loadingInstance?.close();
          }
          loadingInstance?.close();
          //message提示警告信息
          if (res?.data?.status == 900) {
            if (res?.data?.msg == "无权限操作！") {
              localStorage.clear(); //清除缓存
              window.location.href = MICRO_CONFIG.routePath + "/#/login";
            }
            Message({
              message: res.data.msg ? res.data.msg : "请求失败",
              type: "warning",
              duration: 3 * 1000,
            });
          } else {
            //message提示报错信息
            Message({
              message: res.data.msg ? res.data.msg : "请求失败",
              type: "error",
              duration: 3 * 1000,
            });
          }
          if (res.data.msg) {
            throw new ApiRequestError(res.data.status, res.data.msg);
          }
        }
        loadingInstance?.close();
        return res;
      }
    }
    loadingInstance?.close();
    checkCode(res);
    return res;
  },
  //错误处理
  (error) => {
    // todo: message code
    if (axios.isCancel(error)) {
      // 取消请求的情况下，中断Promise调用链
      return new Promise(() => {});
    } else {
      loadingInstance?.close();
      const response = error.response;
      checkStatus(response);
    }
  }
);

//检查服务器返回
function checkStatus(response) {
  if (response && response.status != 200) {
    if (response.status == 401) {
      handleTokenLost();
      // localStorage.removeItem("X-Gisq-Token");
      // localStorage.clear(); //清除缓存
      //401时修改title
      document.title = MICRO_CONFIG.title;
      if (window.parent != window) return;
    } else {
      return Promise.reject(response.data);
      /*Message({
        //message:err.response.data.errMsg,
        message: '服务器异常',
        type: 'error',
        duration: 5 * 1000
      });
      throw Error('服务器异常');*/
    }
  }
}

//检查后端接口返回
function checkCode(res) {
  if (res.data.status != "200" && res.data.status != "500") {
    Message({
      message: res.data.msg,
      type: "error",
      duration: 3 * 1000,
    });
    throw Error(res.data.msg);
  } else {
    return res;
  }
}

//请求添加loading
function addLoading(config) {
  const loadingUrl = ["biz/definition/importModels"];
  let isLoading = loadingUrl.some(function (item) {
    return config.url.indexOf(item) > -1;
  });
  if (isLoading) {
    loadingInstance = Loading.service({
      lock: true,
      text: "数据处理中",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
  }
}
//调用方法 给所有接口加上subGuid和SubSystemName参数
function addSubGuidAndSubSystemName(config) {
  const subGuidUrl = getUrlParam("subGuid");
  let subGuid;
  if (subGuidUrl) {
    subGuid = subGuidUrl;
  } else {
    subGuid = window.localStorage.getItem("subGuid");
  }
  const notAddSubGuidUrl = ["auth/oauth/login"];
  let notAddSubGuid = notAddSubGuidUrl.some(function (item) {
    return config?.url.indexOf(item) > -1;
  });
  if (subGuid && !notAddSubGuid) {
    //传subGuid之前 查一下请求地址上是否已经上传subGuid参数，避免有的接口重复传某参数导致数据请求有误
    if (!getQueryString("subGuid", config.url)) {
      if (config["params"]) {
        config.params["subGuid"] = subGuid;
      } else {
        config["params"] = { subGuid: subGuid };
      }
    }
    //解析子系统名称
    const exitNameArr = !localStorage.appNameArr ? JSON.parse("[]") : JSON.parse(localStorage.appNameArr);
    if (exitNameArr) {
      const index = exitNameArr.findIndex((value) => {
        return value.key == subGuid;
      });
      if (exitNameArr[index] && exitNameArr[index].name) {
        if (config["params"]) {
          config.params["subSystemName"] = exitNameArr[index].name;
        } else {
          config["params"] = { subSystemName: exitNameArr[index].name };
        }
      }
    }
  }
}
function addPreview(config) {
  //不添加preview 的接口
  const notAddPreviewUrl = ["logmgr/getSecureAuditLog"];
  let notAddPreview = notAddPreviewUrl.some(function (item) {
    return config?.url.indexOf(item) > -1;
  });
  if (!notAddPreview) {
    if (config["params"]) {
      config.params["preview"] = true;
    } else {
      config["params"] = { preview: true };
    }
  }
}
//401时比较token，修改tokenLost的值
function handleTokenLost() {
  if (isAppViewOrLogin()) {
    // 嵌入到预览页面的接口401时
    const token = localStorage.getItem("X-Gisq-Token");
    const appToken = LocalStorageUtil.getItem("X-Gisq-Token");
    LocalStorageUtil.setItem("tokenLost", true);
    if (token === appToken) {
      localStorage.setItem("tokenLost", "true");
    }
  } else {
    const token = localStorage.getItem("X-Gisq-Token");
    if (token) {
      localStorage.setItem("tokenLost", "true");
      //window.onstorage监听localStorage变化 -不同的浏览器tab，本页面不生效,所以手动调一下弹窗弹出方法
      bus.$emit("showLoginForm", { isDialog: true });
      //修改appObject里tokenLost的值
      setAppObjectTokenLost();
    } else {
      window.location.href = MICRO_CONFIG.routePath + "/#/login";
    }
  }
}
function setAppObjectTokenLost() {
  try {
    const token = localStorage.getItem("X-Gisq-Token");
    let appObjectStr = localStorage.getItem("appObject");
    if (appObjectStr) {
      //转为json格式，然后取到当前应用的值
      let appObject = JSON.parse(appObjectStr);
      // 循环appObject token等于当前的失效的 对应的属性全部tokenLost改成true
      for (let key in appObject) {
        let equalToken = appObject[key]["X-Gisq-Token"] === token;
        if (equalToken) {
          appObject[key].tokenLost = true;
        }
      }
      localStorage.setItem("appObject", JSON.stringify(appObject));
    }
  } catch (error) {
    console.log("修改appObject的tokenLost失败");
  }
}
export default axios;
