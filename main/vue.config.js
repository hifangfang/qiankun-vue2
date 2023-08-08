const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
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
      "/": {
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
};
