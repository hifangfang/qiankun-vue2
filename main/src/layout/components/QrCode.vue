<template>
  <div class="qrCode">
    <img src="" alt="" srcset="" />
  </div>
</template>

<script>
export default {
  name: "QrCode",
};
</script>

<style lang="scss" scoped>
.qrCode {
  width: 160px;
  height: 160px;
  background-color: #fff;
  position: absolute;
  left: 10px;
  bottom: 10px;
  img {
    display: block;
    width: 100%;
  }
}
</style>
