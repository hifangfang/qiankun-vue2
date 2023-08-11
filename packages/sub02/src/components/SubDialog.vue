<template>
  <div v-if="visiable">
    <h1>{{ number }}</h1>
  </div>
</template>

<script>
export default {
  name: "SubDialog",
  data() {
    return {
      visiable: false,
      number: 0,
    };
  },
  methods: {
    init(val) {
      this.visiable = true;
      this.number = val;
    },
  },
  destroyed() {
    console.log("组件注销了");
  },
};
</script>

<style lang="scss" scoped></style>
