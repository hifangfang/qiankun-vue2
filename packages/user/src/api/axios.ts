import axios from 'axios';
//认证集成start
import { ApiRequestError } from './api-response';
import {Loading, Message} from 'element-ui'
import {ApiResultCode} from './api-response'
import {getUrlParam} from '@/utils/js/url_path_utils';
import MICRO_CONFIG from './platform_config';
//认证集成end
axios.defaults.withCredentials = true;
var loadingInstance
//认证集成start
axios.interceptors.request.use(config => {
    //调用添加loading方法
    addLoading(config)
    let t = getUrlParam('token');
    let timestampTokenRes;
    if(t !== '' && t !== null){
      //判断是否有bearer
      let haveToken = t.toLowerCase();
      if (haveToken.startsWith("bearer")) {
        window.localStorage.setItem("X-Gisq-Token", t);
      } else {
        window.localStorage.setItem("X-Gisq-Token", "Bearer " + t);
      }
      window.localStorage.setItem('loginflag','true');
      let Base64 = require("js-base64").Base64;
      let a = Base64.decode(t.split(".")[1]);
      let loginname = JSON.parse(a).user_name;
      window.localStorage.setItem('username',loginname);
    }
    const token = localStorage.getItem('X-Gisq-Token');
    console.log(token,"hahahahxixixixi")
    config.headers['X-Gisq-Token'] = token;

    //开发环境的时候注释掉config.headers['X-Gisq-Token'] ，放开  config.url +=
    //config.url += '?access_token=' + token?.substr('bearer '.length);
    return config;
  }, error => {
    return Promise.reject(error);
  });

  axios.interceptors.response.use(res => {
    if (res.data.code === 702) {
      localStorage.removeItem('access-user');
      window.location.href = MICRO_CONFIG.routePath + '/#/login';
      // (this as any).$router.push()
    } else if (res.data.user) {
      localStorage.setItem('access-user', res.data.user);
    }
    if (res) {
      //请求的服务地址为表单服务时的拦截处理
      if(res.request.responseURL.indexOf('gisqForm') >=0){
        //表单导入时检验表单的接口不需要提示出信息而且数据层级与中台接口层级不同 需单独判断
        if(res.request.responseURL.indexOf('checkImportFormExist') >=0||res.request.responseURL.indexOf('exportForm') >=0){
          return res
        } else{
          if(res.data && res.data.status != 200 && res.data.code != 200){
            loadingInstance?.close();
            Message({
              message: res.data.msg?res.data.msg:"请求失败",
              type: 'error',
              duration: 3 * 1000
            });
          }
        }
        loadingInstance?.close();
        return res;
      }else{
        if(res.data instanceof Blob){
          if (res.status != 200) {
            //如果有loading，隐藏loading
            loadingInstance?.close();
            Message({
              message: "获取文件失败",
              type: 'error',
              duration: 3 * 1000
            });
            throw new ApiRequestError(ApiResultCode.error, "获取文件失败");
          }
          loadingInstance?.close();
          return res;
        }
        //后端接口请求报错时
        if (res.data &&res.data.status&&res.data.status != 200 && res.data.code != 200) {
          //请求的服务地址为BI服务时的拦截处理
          if (res.request.responseURL.indexOf('gisqBI') >=0) {
            res.data.msg = 'BI服务'+res.data.msg;
            loadingInstance?.close();
          }
          loadingInstance?.close();
          //message提示报错信息
          Message({
            message: res.data.msg?res.data.msg:"请求失败",
            type: 'error',
            duration: 3 * 1000
          });
          if(res.data.msg){
            throw new ApiRequestError(res.data.status, res.data.msg);
          }
        }
        loadingInstance?.close();
        return res;
      }
    }
    loadingInstance?.close();
    checkCode(res);
    return res
  },
    //错误处理
    error => {
      // todo: message code
      loadingInstance?.close();
      const response = error.response
      checkStatus(response)

  });
//检查服务器返回
function checkStatus(response) {
  if (response.status != 200) {
    if (response.status == 401) {
        localStorage.removeItem("X-Gisq-Token");
        localStorage.clear(); //清除缓存
        window.location.href = MICRO_CONFIG.routePath + "/#/login";
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
  if (res.data.status != "200" && res.data.status!="500") {
    Message({
      message: res.data.msg,
      type: 'error',
      duration: 3 * 1000
    });
    throw Error(res.data.msg);
  } else {
    return res
  }

}
//请求添加loading
function addLoading(config) {
  const loadingUrl=["biz/definition/importModels"]
  let isLoading = loadingUrl.some(function (item) {
    return config.url.indexOf(item)>-1;
  });
  if(isLoading){
    loadingInstance = Loading.service({
      lock: true,
      text: '数据处理中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
  }
}
export default axios;
