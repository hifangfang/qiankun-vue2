import "./qiankun/public-path";
import { lifeCycle, render } from "./qiankun/life-cycle";
/**
 * @name 统一注册插件
 */
import Vue from "vue";
import ElementUI from "element-ui";
Vue.use(ElementUI, { size: "small" });
import "element-ui/lib/theme-chalk/index.css";
import validator from "validator";
Vue.prototype.$validator = validator;
// 解决element-ui下拉框报错问题
let rawGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = function (el, pseudoElt) {
  if (el.nodeType == 11) return { overflow: "auto" };
  return rawGetComputedStyle(el, pseudoElt);
};


/**s
 * @name 导出微应用生命周期
 */
const { bootstrap, mount, unmount } = lifeCycle();
export { bootstrap, mount, unmount };
// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
