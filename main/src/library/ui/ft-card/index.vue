<template>
  <div class="card-content"   :key="item.id">
    <div class="card-top">
      <img :src="(item.biimage || (require('../../../../assets/images/template.png')))"  alt />
    </div>
    <div class="card-bottom">
      <div class="card-bottom-title">
        <el-tooltip class="item" :content="item.title" effect="light" placement="top-start">
          <span class="card-name">{{item.title}}</span>
        </el-tooltip></div>
      <div class="creator-box">

        <el-tooltip v-if="item.publishUser" class="showOneLine" effect="light" :content="item.publishUser" placement="top">
          <span>创建者：{{item.publishUser}}</span>
        </el-tooltip>
        <div v-else class="creator-staffName">创建者：{{item.publishUser}}</div>
        <el-tooltip v-if="systemUser==1 || baseUserId === item.userId" class="delete" effect="light" content="删除" placement="top">
          <i class="iconfont zwpt_del1" @click="del(item)"></i>
        </el-tooltip>
      </div>
      <el-tooltip class="item" :content="item.publishUrl" effect="light" placement="top-start">
        <div class="card-middle-url">应用地址：{{item.publishUrl}}</div>
      </el-tooltip>
      <div class="card-bottom-desc">描述：{{item.subDesc}}</div>
      <div class="card-btn-box">
        <div  class="card-btn-preview" @click="ept(item)">
          <i class="iconfont zwpt_yydc"></i>
          <div class="preview">导出</div>
        </div>
        <el-tooltip class="item" effect="dark" content="没有可用的登录页，请先去设计或开启" placement="top-start" :disabled="item.started">
          <div :class="item.started?'':'is_disabled_button'" class="card-btn-preview" :key="item.id" @click="preview(item.started,item.id)">
            <i class="iconfont zwpt_viewShow"></i>
            <div class="preview">预览</div>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FtContainer",
  props: {
    // 是否使用带scroll的main
    item: {
      type: Object,
      default: {}
    },
    cardRightButtons:{
      type:Array,
      default:[
        {label:"导出",icon:"iconfont zwpt_yydc",click:this.ept,},
        {label:"预览",icon:"iconfont zwpt_viewShow",click:this.ept,}

      ]
    },
    cardDetails:{
      type:Array,
      default:[
        {label:"创建时间",key:"publishUser"},
        {label:"应用地址",key:"publishUrl"},
        {label:"描述",key:"subDesc"}
      ]
    }

  }
};
</script>

<style lang="scss">

</style>
