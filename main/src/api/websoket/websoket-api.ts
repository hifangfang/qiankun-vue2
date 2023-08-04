import {MICRO_CONFIG} from '@/api/platform-config';
import {LoginInfoVo} from './websoket-model';
import aes_utils from "@/utils/js/aes-utils";
import bus from "@/utils/js/bus";
import ColumnCommon from '@/utils/js/common';
export class WebSoketAPI {  //通过websoket来监控登录的信息（登录人员，id号，登录的方式）
    //private static loginUser = MICRO_CONFIG.identity + "/websocket/{loginInfo}";
    private static onlineWsUrl = MICRO_CONFIG.webSocketPath+"websocket/{loginInfo}";
    public static websocket:any;
    static initWebsoket(vo:LoginInfoVo) {
       // 请求参数加密
       let websock = new WebSocket(this.onlineWsUrl.replace('{loginInfo}',
                aes_utils.encryptByKey(JSON.stringify(vo), 'gisq65418c9fe068')));
                WebSoketAPI.websocket = websock;
       websock.onmessage = function(e) {
         let data=e.data
          try {
            var obj = eval("(" + data + ")")
            if(obj?.tokenLost){
              console.log(window,window.top,window.top&&window.top!=window.self)
              let href = window.location.href;
              if (window.top&&window.top!=window.self&&href.indexOf('/bi/') < 0)return
              if(href.indexOf('/bi/') < 0&&href.indexOf('/login')<0&&href.indexOf('/iframe/loginform')<0){
                localStorage.beforeUserId=obj?.userId
                websock.close()
                bus.$emit("showLoginForm",{isDialog:true})
              }
              //暂时去掉子应用token失效
              else if(href.indexOf('/bi/') >-1) {
                //TODO 子系统这块的页面需要另外处理
                const data={
                  isDialog:true,
                  subGuid:obj?.subGuid
                }
                bus.$emit("showBiLoginpageUrl", data);
              }

              let subGuid = obj?.subGuid;
              if (undefined == subGuid || null == subGuid || '' == subGuid) { // 表示平台级别
                localStorage.setItem("tokenLost", "true");
                let telephone=obj?.telephone
                let telephoneTm=obj?.telephoneTm
                if(telephone&&telephone!=undefined&&telephone!=null){
                  localStorage.setItem("beforeTelephone", telephone);
                  localStorage.setItem("beforeTelephoneTm", telephoneTm)
                }
              }
              else { // 表示应用级别
                // 子应用的storage需要替换
                 //appObject是规定取值的key，每个应用的值以json的形式存在这里
                 let appObjectStr = localStorage.getItem("appObject");
                 if(appObjectStr){
                     //转为json格式，然后取到当前应用的值
                     let appObject = JSON.parse(appObjectStr);
                     let appInfo = appObject[subGuid];
                     //appInfo有时格式是string有时格式为object，这里判断一下，类型为string的时候再执行JSON.parse，否则会出错
                     if(appInfo instanceof String || typeof(appInfo) === 'string') {
                         appInfo = JSON.parse(appObject[subGuid]);
                     }
                     //因为是set，所以将值修改后再保存一下
                     appInfo['tokenLost'] = true;
                     let telephone=obj?.telephone;
                     let telephoneTm=obj?.telephoneTm
                     if(telephone&&telephone!=undefined&&telephone!=null){
                       appInfo['beforeTelephone']=telephone
                       appInfo['beforeTelephoneTm']=telephoneTm
                     }
                     appObject[subGuid] = appInfo;
                     localStorage.setItem('appObject',JSON.stringify(appObject));
                 }
              }
            }
          }catch (e){

          }
       };
       websock.onopen = function() {
         if ("reload" != vo.reload) {
          this.send("login");
         }
         console.log("连接");
       };
       websock.onerror = function() {
        console.log('错误');
       }
       websock.onclose = function(e) {
        console.log('退出');
       }
       return websock;
    };
}
