export function getUrlParam(name) {
  let regExpExecArray = new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href);

  return decodeURIComponent((regExpExecArray ? regExpExecArray[1] : "").replace(/\+/g, "%20")) || null;
}
//  获取某个url后面的参数
export function getQueryString(key, url) {
  var href = url || window.location.href;
  url = href.indexOf("#") > -1 ? href.split("#")[1]?.split("?") : href.split("?");
  if (url.length <= 1) {
    return "";
  }
  var params = url[1].split("&");
  for (var i = 0; i < params.length; i++) {
    var param = params[i].split("=");
    if (key == param[0]) {
      if (url[2] != undefined) {
        return decodeURIComponent(param[1] + "?" + url[2]);
      }
      return decodeURIComponent(param[1]);
    }
  }
}
//页面是应用预览页面 /bi/,/bilogin
//表示快速构建平台页面嵌入到bi sourec=bi
//bi、表单嵌入快速构建平台的登录弹窗 /iframe/loginform
//快速构建平台登录页面 用于排除入口相关逻辑 #/login
export function isAppViewOrLogin() {
  let href = window.location.href;
  let hash = window.location.hash;
  let source = getQueryString("source", href);
  return (
    href.indexOf("/bi/") > -1 ||
    href.indexOf("/bilogin") > -1 ||
    source == "bi" ||
    href.indexOf("/iframe/loginform") > -1 ||
    hash == "#/login"
  );
}
