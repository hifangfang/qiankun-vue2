/**
 * auth: hucf
 * time: 2023.08.03
 * description: 一个数组操作函数库
 */

/**
 * 在 vuex 中动态添加了 global 模块及 routes 模块；
 * global 模块：封装了全局下发的数据，以及数据修改通知到其他应用；
 * routes 模块：路由数据的封装以及组件的导入。
 */
// const _import = (file) => () => import("@/views" + file + "/index.vue");
//  为vuex添加global模块，存储全局下发的数据
function registerGlobalModule(store, props = {}) {
  if (!store || !store.hasModule) return;
  // 初始化数据
  const initState = { ...props.globalState };
  if (!store.hasModule("global")) {
    const globalModule = {
      namespaced: true,
      state: initState,
      actions: {
        // 子应用改变state并通知父应用
        setGlobalState({ commit }, payload) {
          commit("setGlobalState", payload);
          commit("emitGlobalState", payload);
        },
        // 初始化，只用于mount时同步父应用的数据
        initGlobalState({ commit }, payload) {
          commit("setGlobalState", payload);
        },
      },
      mutations: {
        setGlobalState(state, payload) {
          state = Object.assign(state, payload);
        },
        emitGlobalState(state) {
          if (props.setGlobalState) {
            props.setGlobalState(state);
          }
        },
      },
    };
    store.registerModule("global", globalModule);
  }
}

//  为vuex添加routes模块,存储及修改动态路由数据
function registerRoutesModule(store) {
  if (!store || !store.hasModule) return;
  if (!store.hasModule("routes")) {
    const routesModule = {
      namespaced: true,
      state: {
        routesData: [],
      },
      mutations: {
        UPDATE_ROUTER_DATA(state, payload) {
          state.routesData = payload;
        },
      },
    };
    store.registerModule("routes", routesModule);
  }
}

// 封装路由数据
function getRoutes(store, props) {
  if (!props && !store) return;
  if (props.globalState && props.globalState.routers) {
    const routesData = props.globalState.routers;
    if (props.name) {
      const routes = [];
      for (let i = 0, length = routesData.length; i < length; i += 1) {
        const element = routesData[i];
        if (
          element.path &&
          element.path.includes(props.name) &&
          element.meta &&
          element.meta.moduleName &&
          element.meta.moduleName === props.name
        ) {
          const path = element.path.slice(props.name.length + 1);
          element.path = path;
          // element.component = _import(path);
          routes.push(element);
        }
      }
      store.commit("routes/UPDATE_ROUTER_DATA", routes);
    }
  }
}

function initGlobalState(store, props) {
  registerGlobalModule(store, props);
  registerRoutesModule(store);
  getRoutes(store, props);
}

export default initGlobalState;

