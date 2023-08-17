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
#app{
  width: 100%;
  height: 100%;
}
</style>