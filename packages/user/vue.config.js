const path = require("path");
const packageName = require("./package.json").name;
const node_env = process.env.NODE_ENV === "production";
// const baseUrl = process.env.VUE_APP_BASE_URL;
const baseUrl = "./";
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
  outputDir: `../dist/${packageName}`,
  publicPath: node_env ? baseUrl : "./",
  assetsDir: "static",
  parallel: false,
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
  chainWebpack: config => {
    config.module.rule('js').use('babel-loader')
    config.module.rule('ts').use('ts-loader')
    config.entry('main').add('babel-polyfill')
  }
};
