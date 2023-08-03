import MICRO_CONFIG from '../../api/platform_config';
export function getUrlParam(name: string) {
    let regExpExecArray = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href);

    return decodeURIComponent((regExpExecArray ? regExpExecArray[1] : '').replace(/\+/g, '%20')) || null;
  }
//  获取某个url后面的参数
export function getQueryString (key, url) {
  var href = url || window.location.href;
  var url = href.indexOf("#")>-1?href.split("#")[1]?.split("?"):href.split("?");
  if (url.length <= 1) {
    return "";
  }
  var params = url[1].split("&");
  for (var i = 0; i < params.length; i++) {
    var param = params[i].split("=");
    if (key == param[0]) {
      if (url[2] != undefined) {
        return decodeURIComponent(param[1] + '?' + url[2]);
      }
      return decodeURIComponent(param[1]);
    }
  }
}
//页面是应用预览页面 /bi/,/bilogin
//表示快速构建平台页面嵌入到bi sourec=bi
//bi、表单嵌入快速构建平台的登录弹窗 /iframe/loginform
//快速构建平台登录页面 用于排除入口相关逻辑 #/login
export function isAppViewOrLogin(){
  let href = window.location.href;
  let hash = window.location.hash;
  let source=getQueryString("source",href)
  return href.indexOf('/bi/') >-1||href.indexOf('/bilogin')>-1||source=="bi"
    ||href.indexOf('/iframe/loginform')>-1
    ||hash=='#/login'
}
export default {
//获取跳转bi设计器页面的地址
  getGisqBIEditorUrl(biId,applicationId,appId,temp?,token?,groupType?){
    let url=MICRO_CONFIG.gisqBIEditor
      + "editor.html?biId=" + biId
      + "&applicationId=" + applicationId
      + '&appId=' + appId
      + '&preview=true'
    if(temp){
      url=url + "&temp=" + temp
    }
    if(groupType){
      url=url+ '&groupType='+groupType
    }
    if(MICRO_CONFIG.gisqBIEditor.indexOf("http")>-1||MICRO_CONFIG.gisqBIEditor.indexOf("https")>-1){
      url=url+ + "&token=" + token
    }
    return url
  },
  //获取跳转bi预览页面的地址
   getGisqBIViewUrl(biId,applicationId,appId,temp?,token?,groupType?){
    let url=MICRO_CONFIG.gisqBIEditor
      + "view.html?biId=" + biId
      + '&appId=' + appId
      + '&preview=true'
    if(temp){
      url=url + "&temp=" + temp
    }
    if(groupType){
      url=url+ '&groupType='+groupType
    }
    if(MICRO_CONFIG.gisqBIEditor.indexOf("http")>-1||MICRO_CONFIG.gisqBIEditor.indexOf("https")>-1){
      url=url+ + "&token=" + token
    }
    return url
  },
  getGisqQueryDesignUrl(queryId,appId,token?){
    let url=MICRO_CONFIG.gisqBIEditor +
      "query_design.html?queryId=" + queryId +
      "&appId=" + appId+
      '&preview=true'
    if(MICRO_CONFIG.gisqBIEditor.indexOf("http")>-1||MICRO_CONFIG.gisqBIEditor.indexOf("https")>-1){
      url=url+ + "&token=" + token
    }
    return url
  },
  getGisqQueryViewUrl(queryId,appId,tp,token?){
    let url=MICRO_CONFIG.gisqBIEditor +
      "query_view.html?queryId=" + queryId +
      "&appId=" + appId+
      '&preview=true'
    if(tp){
      url=url + "&tp=" + tp
    }
    if(MICRO_CONFIG.gisqBIEditor.indexOf("http")>-1||MICRO_CONFIG.gisqBIEditor.indexOf("https")>-1){
      url=url+ + "&token=" + token
    }
    return url
  },
  //获取表单设计器地址
  getGisqFormWebEditorUrl(formId,formCode,formName,applicationId,formTest,token?,formType?){
    let url=MICRO_CONFIG.gisqFormWeb +
    "editor.html?" +
    "formId="+formId+
    "&formCode="+formCode+
    '&formName=' + formName+
    '&applicationId=' + applicationId+
    '&formTest=' + formTest+
    '&preview=true'
    if(MICRO_CONFIG.gisqFormWeb.indexOf("http")>-1||MICRO_CONFIG.gisqFormWeb.indexOf("https")>-1){
      url=url+ + "&token=" + token
    }
    if(formType){
      url=url + "&formType=" + formType
    }
    return url
  },
  //获取表单设计器地址
  getGisqFormWebViewUrl(formId,formCode,formName,applicationId,formTest,token?,viewType?,formType?){
    let url=MICRO_CONFIG.gisqFormWeb +
      "view.html?" +
      "formId="+formId+
      "&formCode="+formCode+
      '&formName=' + formName+
      '&applicationId=' + applicationId+
      '&formTest=' + formTest+
      '&preview=true'
    if(MICRO_CONFIG.gisqFormWeb.indexOf("http")>-1||MICRO_CONFIG.gisqFormWeb.indexOf("https")>-1){
      url=url+ + "&token=" + token
    }
    if(viewType){
      url=url + "&viewType=" + viewType
    }
    if(formType){
      url=url + "&formType=" + formType
    }
    return url
  },
 //获取公文设计器地址
  getGisqNoticeFormEditorUrl(formId,formCode,formName,applicationId,areaCode,templateType,formTest,token?){
    let url=MICRO_CONFIG.gisqFormWeb +
    "editor.html?"+
    'formCode='+ formCode+
    '&formId=' + formId+
    '&formName=' + formName+
    '&applicationId=' + applicationId+
    "&areaCode="+areaCode+
    "&templateType="+templateType+
    '&formTest=' + formTest+
    '&preview=true'
    if(MICRO_CONFIG.gisqFormWeb.indexOf("http")>-1||MICRO_CONFIG.gisqFormWeb.indexOf("https")>-1){
      url=url+ + "&token=" + token
    }
    return url
  },
  //获取公文设预览地址
  getGisqNoticeFormViewUrl(formId,formCode,formName,applicationId,areaCode,templateType,formTest,viewType,token?,isNotice?){
    let url=MICRO_CONFIG.gisqFormWeb +
      "view.html?"+
      'formCode='+ formCode+
      '&formId=' + formId+
      '&formName=' + formName+
      '&applicationId=' + applicationId+
      "&areaCode="+areaCode+
      "&templateType="+templateType+
      '&formTest=' + formTest+
      '&isNotice='+isNotice+
      '&preview=true'
    if(MICRO_CONFIG.gisqFormWeb.indexOf("http")>-1||MICRO_CONFIG.gisqFormWeb.indexOf("https")>-1){
      url=url+ + "&token=" + token
    }
    if(viewType){
      url=url + "&viewType=" + viewType
    }
    return url
  }

}
