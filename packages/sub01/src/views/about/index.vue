<template>
  <div class="about">
    <h1>关于子应用页面</h1>
    <el-button type="primary" @click="update">更新姓名11</el-button>
    <el-select v-model="value" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
    </el-select>
    <div class="content-bj">
      <GisqTaskComponent ref="taskComponent" :compConfig="componentConfig"></GisqTaskComponent>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { GisqTaskComponent} from "gisquest-components";
import "gisquest-components/lib/gisquest-components.css";
export default {
  components:{
    GisqTaskComponent
  },
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      value: "",
      componentConfig: {
        service: "",
        componentName: "EndTaskComponent",
        subGuid: "",
        userInfo:this.$store.state?.global.userInfo,
        urlPathNameBi: "view",
        isUseAppObject: false,
        tableConfig: "", //列表样式(默认："";斑马线：'stripe')
        columnSort: false, //启用标题的排序功能	Boolean	----	false
        fixedHead: false, //是否冻结标题	Boolean	----	true
        instantQuery: true, //是否值变化就激发查询功能(Boolean)
        themeType: "workerGreen",
        isInterfaceStore: true, // 接口保存配置
        tableButtonList: [
          {
            type: "export",
            typeName: "数据导出",
            isChecked: true,
            name: "数据导出",
            icon: "el-icon-upload2",
            primary: "primary",
            disabled: false,
            level: 1,
            id: "7cd0c670-d2e3-4b9c-b629-af2efcfa8aa0",
            pid: "",
            isSet: false,
          },
          {
            type: "clear",
            typeName: "清空",
            isChecked: true,
            name: "清空",
            icon: "el-icon-refresh-left",
            primary: "primary",
            disabled: false,
            level: 1,
            id: "64e4db78-8b31-43c8-9c3a-cbc865fe13ef",
            pid: "",
            isSet: false,
          },
          /*{
            "type": "setColumn",
            "typeName": "自定义列",
            "isChecked": true,
            "name": "设置",
            "icon": "iconfont comp_zidingyilie",
            "primary": "primary",
            "disabled": false,
            "level": 1,
            "id": "fdf94ad0-e261-489f-992f-f30dffe4fe8e",
            "pid": "",
            "isSet": false
          },*/
          // {
          //   type: "setColumns",
          //   name: "设置",
          //   isChecked: true,
          //   icon: "el-icon-setting",
          //   method: this.setColumns,
          // },
          // {
          //   type: "moreSearch",
          //   typeName: "更多筛选",
          //   isChecked: true,
          //   name: "更多筛选",
          //   desc: "当设置的查询条件超出一行无法全部展示时，即显示该按钮，点击展开全部的查询条件",
          //   icon: "iconfont comp_gengduoshaixuan",
          //   primary: "plain ",
          //   disabled: false,
          //   level: 1,
          //   id: "94cb3680-8aee-4aae-8833-183a915e713d",
          //   pid: "",
          //   isSet: false,
          // },
        ],
        tableSearchList: [
          {
            title: "办件名称或者项目编号",
            queryField: "txtInput",
            type: "string",
            placeholder: "请输入办件名称或者项目编号",
            isChecked: true,
            searchFlag: true,
            cleanFlag: true,
          },
        ], //按钮配置列表
      },
    };
  },
  computed: {
    ...mapState("global", {
      user: (state) => state.user, // 获取父应用的user信息
    }),
  },
  methods: {
    ...mapActions("global", ["setGlobalState"]),
    update() {
      console.log(this.$store.state);

      //更新全局数据
      this.setGlobalState({ userInfo: { name: "sub01的张三" } });
    },
  },
};
</script>
<style lang="scss" scoped>
.about{
  .content-bj{
    height: 800px;
  }
}
</style>