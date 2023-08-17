import Vue from "vue";
import Vuex from "vuex";
import permission from "./modules/permission";
import tabs from "./modules/tabs";
import user from "./modules/user";
Vue.use(Vuex);
let storageKey = process.env.VUE_APP_NAME+"-vuex"
const store = new Vuex.Store({
  modules: {
    permission,
    tabs,
    user,
  },
});
// 在应用初始化时从localStorage中读取数据并还原到vuex中
const data = localStorage.getItem(storageKey)
if (data) {
  store.replaceState(JSON.parse(data));
}

// 在vuex的mutation中使用localStorage来保存数据
store.subscribe((mutation, state) => {
  localStorage.setItem(storageKey, JSON.stringify(state))
})
export default store;