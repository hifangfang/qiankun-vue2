const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
const { cdn, externals } = require('./public/global/config/config-webpack');
module.exports = {
  runtimeCompiler: true,
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      "/mock/api": {
        target: process.env.VUE_APP_API_URL,
        pathRewrite: {
          "^/mock/api": "", // rewrite path
        },
      },
      "/auth": {
        target: "http://192.168.11.73:19013",
      },
      "/platform": {
        target: "http://192.168.11.73:19013",
      },
      "/activiti": {
        target: "http://192.168.11.73:19013",
      },
      "/identity": {
        target: "http://192.168.11.73:19013",
      },
      "/base": {
        target: "http://192.168.11.73:19013",
      },
      "/bizmodel": {
        target: "http://192.168.11.73:19013",
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      // 在 html 中，注入 CDN 链接
      args[0].cdn = cdn;
      return args;
    });
    // 设置不参与打包
    config.externals(externals)
  },
};
