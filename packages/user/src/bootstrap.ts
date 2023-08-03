import "./core/public-path";
import { lifeCycle, render } from "./core/life-cycle";
import Vue from "vue";
/**
 * @name 统一注册插件
 */
import './core/install';
import { Button } from '@/remoteConfig/remoteRef'
Vue.component('Button', Button)
/**
 * @name 导出微应用生命周期
 */
const { bootstrap, mount, unmount } = lifeCycle();
export { bootstrap, mount, unmount };

/**
 * @name 单独环境直接实例化vue
 */
const __qiankun__ :any= (window as any).__POWERED_BY_QIANKUN__;
__qiankun__ || render();
