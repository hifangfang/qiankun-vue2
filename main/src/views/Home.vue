<template>
  <div class="home">
    <h1>主应用首页</h1>
    <h1 style="cursor: pointer" @click="numAdd">应用缓存测试:{{ num }}</h1>
    <div>
      <div><b> sub01（子应用1） </b>及<b> sub02（子应用2） </b>为 <span style="color: red">Vue应用</span></div>
      <div style="padding-top: 20px"><b> sub03（子应用3） </b>为 <span style="color: red">React应用</span></div>
    </div>
    <div id="appContainer2"></div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      num: 123,
    };
  },
  mounted() {
    // debugger
    // this.$store.commit("user/UPDATE_USER_INFO",JSON.parse(localStorage.getItem("userInfo")))
    // //初始化全局下发的数据
    // this.$actions.setGlobalState({
    //   userInfo: this.$store.state.user.userInfo,
    //   globalConfig: this.$store.state.user.globalConfig,
    //   routers: this.$store.state.permission.routers,
    // });
  },
  methods: {
    numAdd() {
      this.num += this.num;
    },
  },
};
</script>

<style lang="scss" scoped></style>
