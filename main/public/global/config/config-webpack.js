// // CDN 链接（读取本地配置）
const isProduction = process.env.NODE_ENV === "production";
// const ver = require('./package.json').dependencies['组件库'].replace(/(\^|\*)/g, '')
const cdn = {
  css: [],
  js: [],
};
const externals = [];
// 默认是打包后才引入cdn，本地运行使用node_modules
if (isProduction) {
  cdn.css.push(
    ...[
        `/global/libs/gisquest-components@0.6.2/gisquest-components.css`,
        ]
    );
  cdn.js.push(
    ...[
      `/global/libs/vue@2.7.14/vue.min.js`,
      `/global/libs/vue-router@3.6.5/vue-router.min.js`,
      `/global/libs/vuex@3.4.0/vuex.min.js`,
      `/global/libs/axios@0.21.4/axios.min.js`,
      `/global/libs/element-ui@2.15.13/element-ui.min.js`,
      `/global/libs/gisquest-components@0.6.2/gisquest-components.min.js`,
      // `/cdn/组件库/${ver}/lib/index/index.js`
    ]
  );
  // cdn.css.push(`/cdn/组件库/${ver}/lib/style/index.css`)
  externals.push({
    vue: "Vue2",
    "vue-router": "VueRouter",
    vuex: "Vuex",
    axios: "axios",
    "element-ui": "ELEMENT",
    "gisquest-components": "gisquest-components",
  });
  Object.assign(externals);
}
if (!isProduction) {
  //  一些本地运行的cdn资源

}

module.exports = {
  cdn,
  externals,
};
