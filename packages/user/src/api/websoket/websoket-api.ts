import {MICRO_CONFIG} from '@/api/platform_config';
import {LoginInfoVo} from './websoket-model';
import aes_utils from "@/utils/js/aes_utils";
export class WebSoketAPI {  //通过websoket来监控登录的信息（登录人员，id号，登录的方式）
    //private static loginUser = MICRO_CONFIG.identity + "/websocket/{loginInfo}";
    private static onlineWsUrl = MICRO_CONFIG.webSocketPath+"websocket/{loginInfo}";
    static initWebsoket(vo:LoginInfoVo) {
       // 请求参数加密
       let websock = new WebSocket(this.onlineWsUrl.replace('{loginInfo}',
                aes_utils.encryptByKey(JSON.stringify(vo), 'gisq65418c9fe068')));
       websock.onmessage = function(e) {
         //console.log(JSON.parse(e.data));
       };
       websock.onopen = function() {
         if ("reload" != vo.reload) {
          this.send("login");
         }
       };
       websock.onerror = function() {
        console.log('错误');
       }
       websock.onclose = function(e) {
        console.log('退出');
       }
       return websock;
    }
}
