import FtUi from "./ui/index"; // 导入ui
import * as FUNCONVUE from "./js/func-mounted-on-vue"; // 导入需要挂载在vue上的方法
import * as STORAGE from "./js/storage.js";
import * as VALIDATOR from "./js/validator.js";
// import VueClipboard from 'vue@2.6.11-clipboard2';
import directives from "./js/directives"; // 添加全局指令
// import "./js/descriptors"; // 添加全局装饰器
import common from "./js/common"; // 添加全局指令
/**
 * library挂载vue实例函数
 * @param {*} vue vue实例
 * @param {*} store vuex实例
 */
const libraryInstall = (vue, store, props) => {
  console.log(FtUi);
  vue.use(FtUi);

  // 注册需要挂载在vue上的工具类
  let object = { ...FUNCONVUE, ...STORAGE, ...VALIDATOR };
  for (let key in object) {
    vue.prototype[key] = object[key];
  }

  directives.map((i) => vue.directive(i.name, i.rule(store)));
  common.initGlobalState(store, props);
};

export default libraryInstall;
