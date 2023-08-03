<template>
  <div class="departmentUser-tab-page">
    <el-container>
      <el-header>
        <el-button-group>
          <el-button v-for="(item,index) in btnList"
                     :key="index" :type="item.primary?'primary':''" size="medium" @click="changePrimary(item)">
            {{item.name}}
          </el-button>
        </el-button-group>
      </el-header>
      <el-divider></el-divider>
      <el-main>
        <department-user-find-dept v-if="displayDepartmentTable" ref="deptTable"></department-user-find-dept>
        <department-user-find-user v-if="displayUserTable" ref="userTable"></department-user-find-user>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import DepartmentUserFindDept from "./departmentuser-findDept-page.vue";
  import DepartmentUserFindUser from "./departmentuser-findUser-page.vue";

  @Component({
    name: "departmentUser-tab-page",
    components: {
      DepartmentUserFindDept,
      DepartmentUserFindUser
    }
  })
  export default class DepartmentUserTabPage extends Vue {
    @Prop() treeNode: any // 接收父组件传过来的数据

    displayDepartmentTable = true;
    displayUserTable = false;

    btnList = [{name: '机构查询', primary: true, compontName: 'deptTable'},
      {name: '内部用户查询', primary: false, compontName: 'userTable'}];// 按钮组

    reloadDeptUserTabPage() {
      this.changePrimary({name: '机构查询', primary: true, compontName: 'deptTable'});
    }

    changePrimary(item) {// 切换组件
      this.btnList.forEach(mod => {
        if (item.compontName == mod.compontName) {
          mod.primary = true;
        } else {
          mod.primary = false;
        }
      })
      // 并且更换组件显示
      if (item.compontName == 'deptTable') {
        this.displayDepartmentTable = true;
        this.displayUserTable = false;
        this.$nextTick(() => {
          (this.$refs.deptTable as any).initDeptTable(this.treeNode);
        })
      } else if (item.compontName == 'userTable') {
        this.displayDepartmentTable = false;
        this.displayUserTable = true;
        // 打开组件
        this.$nextTick(() => {
          (this.$refs.userTable as any).initUserTable();
        })
      }
    }
  }
</script>

<style lang="scss">
  .departmentUser-tab-page {
    height: 100%;
    >.el-container{
      height: 100%;
    }
    .headerStyle{
      width: 100%;
      border-bottom: 1px solid #ccc;
      padding: 0px 0px 15px 0px;
    }
    .el-header {
      text-align: left;

      .el-button + .el-button {
        margin-left: 0px;
      }
    }
  }
</style>

