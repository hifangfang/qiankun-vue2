<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
export default {
  mounted() {
    let elements = document.querySelector(".app-view-box")?.childNodes;
    if(elements){
      let childrenNode = elements[0];
      childrenNode.setAttribute("style", "height:100%");
    }
  },
};

</script>
<style lang="scss">
@import "./assets/css/reset.scss";
body, html {
  margin: 0;
  padding: 0;
  font-family: "SourceHanSansSC-Normal";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /*overflow: hidden;*/
  /*box-sizing: border-box;*/
}
#app {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
}
</style>
