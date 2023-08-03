<template>
  <div class="departmentUser-index-page"
       v-loading="loading"
       element-loading-text="数据同步中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.6)">
    <LeftNav @changeCompont="changeCompont" ref="leftNav"
             @refleshLoad="refleshLoad"
             :class="subGuid?'apply-left-page':''">
    </LeftNav>
    <!--<keep-alive>-->
    <div class="departmentUser-index-page base-right-page"  :class="subGuid?'apply-right-page':''">
      <div class="base-right-conent-page">
        <div class="red"> 测试子应用user--{{subappMsg}}</div>
        <div @click="goToWorkcenter"> 跳转办件中心</div>
        <component v-if="componentName" :is="componentName" :treeNode="treeNode" @flushTree="flushTree" ref="componentName"></component>
        <EmptyData v-else></EmptyData>
      </div>
    </div>
    <!--</keep-alive>-->
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Emit} from "vue-property-decorator";
  import LeftNav from './left-page.vue';
  import DepartmentUserTab from './departmentuser-tab-page.vue';
  import DepartmentTab from './department-tab-page.vue';
  import UserTab from './user-tab-page.vue';
  import DepartmentFormPage from './department-form-page.vue';
  import UserFormPage from './user-form-page.vue';
  import EmptyData from "@/components/component/EmptyData.vue";
  import { mapGetters } from "vuex";
  @Component({
    name: "index-page",
    components: {
      LeftNav,
      DepartmentUserTab,
      DepartmentTab,
      UserTab,
      DepartmentFormPage,
      UserFormPage,
      EmptyData
    }
  })
  export default class DepartmentUserPage extends Vue {
    componentName = "";
    treeNode: any = {};// 选中树节点数据
    subGuid="";
    loading=false;
    created(){
      console.log(this.$store.state,"mamamamamam")
      const id=this.$store.state.subGuid
      this.subGuid=id
    }
    activated(){
      const id=this.$store.state.subGuid
      this.subGuid=id
    }
    updated(){
      const id=this.$store.state.subGuid
      this.subGuid=id
    }
    get subappMsg(){
      return   this.$store.getters.msg
    }
    async changeCompont(moduleName, data) {
      this.componentName = moduleName;
      this.treeNode = data;
      if (moduleName == "DepartmentUserTab") {
        this.$nextTick(() => {
          (this.$refs.componentName as any).reloadDeptUserTabPage();
        });
      } else if (moduleName == 'DepartmentTab') {
        this.$nextTick(() => {
          (this.$refs.componentName as any).reloadDeptTabPage();
        });
      } else if (moduleName == 'UserTab') {
        this.$nextTick(() => {
          (this.$refs.componentName as any).reloadUserTabPage();
        });
      } else if (moduleName == 'DepartmentFormPage') {
        this.$nextTick(() => {
          (this.$refs.componentName as any).initDeptForm(data,'add');
        });
      } else if (moduleName == 'UserFormPage') {
        this.$nextTick(() => {
          (this.$refs.componentName as any).initUserForm(data,'add');
        });
      }
    }

    async flushTree(id,type) {
      (this.$refs.leftNav as any).flushNode(id,type);
    }
    refleshLoad(data){
      this.loading=data
    }
    goToWorkcenter(){
     console.log(this.$root,"跳转");
     (this.$root as any).parentRouter.push("/workcenter/createWork");
    }
  }
</script>

<style lang="scss">

  .departmentUser-index-page {
    height: 100%;
    display: flex;
    .user-extendinfo-form-page .el-form{
      padding: 10px !important;
    }
    //.base-right-page .base-right-conent-page .el-form{
    //  padding: 6px 100px 40px 100px;
    //
    //}
    .red{
      color: blue;
    }
  }
</style>

