const path = require("path");
const packageName = require("./package.json").name;
const node_env = process.env.NODE_ENV === "production";
// const baseUrl = process.env.VUE_APP_BASE_URL;
const baseUrl = "/";
const resolve = (dir) => path.join(__dirname, dir);
// 同步获取在线JS
const requireFromUrl = require('require-from-url/sync');
// 微应用 - 读取线上 Webpack 配置文件（CDN 地址配置、忽略打包文件配置）
const webpackOnline = 'http://localhost:8080/global/config/config-webpack.js';
const { cdn, externals } = requireFromUrl(webpackOnline);
module.exports = {
  outputDir: `../dist/${packageName}`,
  publicPath: node_env ? baseUrl : "/",
  assetsDir: "static",
  parallel: false,
  devServer: {
    hot: true,
    disableHostCheck: true,
    host: process.env.VUE_APP_HOST,
    port: process.env.VUE_APP_PORT, // 在.env中VUE_APP_PORT=7788，与父应用的配置一致
    headers: {
      "Access-Control-Allow-Origin": "*", // 主应用获取子应用时跨域响应头
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    output: {
      library: `${packageName}-[name]`,
      libraryTarget: "umd", // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${packageName}`,
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
