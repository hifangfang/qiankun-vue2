import Vue from "vue";
import router from "../router";
import store from "../store";
import App from "../App.vue";

Vue.mixin({
  methods: {
    jumpPage(path, moduleName) {
      // 通知主应用发生了页面跳转
      this.$setGlobalState({
        currentRoute: { currentPage: path, currentModuleName: moduleName },
      });
    },
  },
});
const lifeCycle = () => {
  return {
    async bootstrap(props) {
      console.log("[vue] vue app bootstraped", props);
    },
    async mount(props) {
      console.log("[vue] props from main framework", props);
      const { setGlobalState, libraryInstall } = props;
      //注册乾坤setGlobalState 通信方法
      Vue.prototype.$setGlobalState = setGlobalState;
      // 注册主应用下发的组件 工具类
      libraryInstall(Vue, store, props);
      // common.initGlobalState(store, props);
      render(props);
    },
    async unmount() {
      instance.$destroy();
      instance.$el.innerHTML = "";
      instance = null;
    },
  };
};
let instance = null;
const render = ({ container } = {}) => {
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector("#app") : "#app");
};
Vue.config.productionTip = false;
export { lifeCycle, render };
