<template>
  <div class="main-login-page">
    <video class="bg-video" src="../assets/images/login/loginmp4.mp4" autoplay loop muted></video>
    <ul class="logo-and-title">
      <li v-if="flag">
        <img :src="logoUrl" alt="" />
        <p>{{ platformTitle }}</p>
      </li>
    </ul>
    <div v-if="flag">
      <loginForm></loginForm>
    </div>
  </div>
</template>
<script>
import { WaterMarkService } from "@/utils/js/water-mark.service.js";
import { BaseApi } from "@/api/base/module/base-api.ts";
import loginForm from "@/components/loginForm.vue";
export default {
  components: {
    loginForm,
  },
  data() {
    return {
      platformTitle: "",
      logoUrl: "",
      flag: false,
    };
  },
  created() {
    this.clickChange();
    //移除水印
    WaterMarkService.remove();
  },
  //页面加载调用获取cookie值
  mounted() {
    // const rememberPassword = localStorage.rememberPassword;
    // if (rememberPassword === "true") {
    //   const keys = ["rememberPassword", "username", "password", "appObject"];
    //   for (let key in localStorage) {
    //     if (keys.indexOf(key) == -1) {
    //       localStorage.removeItem(key);
    //     }
    //   }
    // } else {
    //   const keys = ["appObject"];
    //   for (let key in localStorage) {
    //     if (keys.indexOf(key) === -1) {
    //       localStorage.removeItem(key);
    //     }
    //   }
    // }
    //背景视频加载后显示
    setTimeout(() => {
      this.flag = true;
    }, 500);
  },
  methods: {
    //更换系统名称及图标
    async clickChange() {
      let propertyKeys = ["platformDesignerTitle", "platformDesignerLogo"];
      let params = {
        subGuid: "",
        propertyKeys: propertyKeys,
      };
      const data = await BaseApi.getCodeValuePropertysByKeys(params);
      if (data.length > 0) {
        //获取变量配置的系统名称
        const titleData = data.filter((item) => item.key === "platformDesignerTitle");
        this.platformTitle = titleData.length > 0 ? titleData[0].value : this.MICRO_CONFIG.title;
        //获取变量配置的系统logo
        const logoData = data.filter((item) => item.key === "platformDesignerLogo");
        if (logoData.length > 0 && logoData[0].value !== "image") {
          this.logoUrl = logoData[0].value;
        }
        this.logoUrl =
          logoData.length > 0 && logoData[0].value !== "image"
            ? logoData[0].value
            : require("../assets/images/login/ztgx_logo.svg");
        //替换浏览器图标
        this.changeFavicon(this.logoUrl); //刷新登录界面浏览器icon
      }
    },
    //刷新登录界面浏览器icon
    async changeFavicon(value) {
      document.title = this.platformTitle ? this.platformTitle : "登录";
      const link = value;
      let $favicon = document.querySelector('link[rel="icon"]');
      if ($favicon !== null) {
        $favicon.href = link;
      } else {
        let $favicon = document.createElement("link");
        $favicon.rel = "icon";
        $favicon.href = link;
        document.head.appendChild($favicon);
      }
    },
  },
};
</script>
<style lang="scss">
@import "../assets/css/login-page.scss";
</style>
