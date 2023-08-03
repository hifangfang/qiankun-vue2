<template>
    <div class="button-more button-more-none">
       <el-popover
        placement="right-start"
        :width="width"
        trigger="hover"
        class="el-popover-menu"
        >
        <el-card class="tree-handel-card">
            <el-button v-for=" (btn,index) in buttonList" :key="index" @click="btn.method(data)"  type="text" :disabled="btn.disabled">
              <i :class="btn.icon"></i>{{btn.name}}
            </el-button>
            </el-card>
          <div slot="reference" class="handelIcon"><i class="iconfont zwpt_gengduo"></i></div>
        </el-popover>
    </div>
</template>
<script lang="ts">
  import { Component, Vue, Watch, Prop } from "vue-property-decorator";
  @Component({
    name: "button-more",
  })
  export default class ButtonMore extends Vue{
    @Prop() buttonList :  any; // 接收父组件传过来的数据
    @Prop() data: any;
    @Prop({ default: '110' }) readonly width!: string
  }
</script>
<style lang="scss">
  .button-more {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 28px;
    height: 28px;
    margin-top: 1px;
    .handelIcon{
      width: 26px;
      height: 26px;
      box-sizing: border-box;
      margin-right: 0px;
      text-align: center;
    }
  }
  .el-popper[x-placement^=right] {
       margin-left: 3px;
  }
   .el-popover{
      padding: 0px!important;
      min-width: 130px!important;
      box-sizing: border-box;
      .tree-handel-card{
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        border-radius: 2px;
        padding:10px 0 ;
        border: 0;
        .el-card__body{
          padding:0;
          border: 0;
          .el-button+.el-button{
            margin-left: 0px;
          }
          .el-button{
            width: 100%;
            height: 36px;
            line-height: 36px;
            font-size: 14px;
            font-family: "SourceHanSansSC-Normal";
            font-weight:normal;
            box-sizing: border-box;
            padding: 0 10px;
            text-align: left;
            color: #616266;
            border-radius: 0;
            border: 0;
            i{
              margin-right: 5px;
            }
            &:hover{
              color:  var(--primary-color);
              background: var(--active-background-color);
            }
          }
        }
      }
    }
</style>
