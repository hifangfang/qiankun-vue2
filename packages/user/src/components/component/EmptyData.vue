<template>
  <div class="EmptyData">
       <img src="../../assets/images/emptyImg.png" alt="">
       <span>暂无内容</span>
  </div>

</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";

  @Component({
    name: 'empty-data'
  })
  export default class EmptyData extends Vue {

  }
</script>

<style lang="scss">
 .EmptyData{
   width: 100%;
   height: 100%;
   text-align: center;
   img{
    margin-top: calc((100vh - 220px)*0.5);
   }
   span{
     display: block;
     margin-top: 10px;
     font-style: normal;
     font-weight: normal;
     font-size: 14px;
     line-height: 20px;
     color: #616266;
   }
 }
</style>
