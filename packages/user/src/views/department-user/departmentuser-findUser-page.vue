<template>
  <div class="departmentUser-findUser-page">
    <el-form label-position="left"  size="small" :model="userForm">
      <el-row :gutter="100">
        <el-col :span="8">
          <el-form-item label-width="70px" label="用户名">
            <el-input v-model="userForm.userNameQuery" placeholder="请输入用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职员姓名" label-width="90px" >
            <el-input v-model="userForm.staffNameQuery" placeholder="请输入职员姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div style="text-align: right">
            <el-button type="primary" size="small" @click="queryUser">查询</el-button>
            <el-button type="primary"  plain size="small" @click="reset">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <table-page :tableColumnList="userTableColumnList" :dataTableHeight="dataTableHeight" @getTableData="getUserData" ref="userTable"></table-page>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import {IdentityApi} from '@/api/identity/identity-api';
  import {TableColumn} from "element-ui";
  import {UserRequest} from '@/api/identity/model/department-user-model'
  import TablePage from "@/components/component/TablePage.vue";

  @Component({
    name: "departmentUser-findUser-page",
    components: {
      TablePage
    }
  })

  export default class DepartmentUserFindUserPage extends Vue {

    userForm: UserRequest = {} as UserRequest;

    userTableColumnList: Partial<{ [key in keyof TableColumn]?: any }>[] = [
      {prop: 'userId', type: 'selection', width: '40'},
      {prop: "userName", label: "用户名", width: "200"},
      {prop: 'staffName', label: '职员姓名', width: ''},
      {prop: 'userCode', label: '用户编码', width: ''},
      {prop: 'parentDeptName', label: '所在机构', width: ''},
      {prop: 'telphoneTm', label: '电话', width: ''},
      {prop: 'description', label: '简述', width: ''}
    ];

    dataTableHeight= window.innerHeight - 320;

    //初始化表格
    async initUserTable() {
      this.getUserData();
    }

    async getUserData() {

      let size = (this.$refs.userTable as any).page.pagesize;
      let num = (this.$refs.userTable as any).page.pagenum;

      this.userForm.pagenum = num;
      this.userForm.pagesize = size;
      const tableData = await IdentityApi.getUserRootTabMessage(this.userForm);

      (this.$refs.userTable as any).initData(tableData);
    }

    //用户查询
    async queryUser() {
      this.userForm.pagenum = 1;
      this.userForm.pagesize = 10;
      const tableData = await IdentityApi.getUserRootTabMessage(this.userForm);
      (this.$refs.userTable as any).initData(tableData);
    }

    //重置
    async reset() {
      this.userForm ={
        pagesize: 10,
        pagenum: 1,
        sortType: '',
        sortName: '',
        userNameQuery: '',
        staffNameQuery: '',
        source: '',
        verifyType: '',
        deptName: '',
        deptId: '',
      }
      // this.userForm.staffNameQuery = "";
      // this.userForm.userNameQuery = "";
      // this.userForm.pagenum = 1;
      // this.userForm.pagesize = 10;
      const tableData = await IdentityApi.getUserRootTabMessage(this.userForm);
      (this.$refs.userTable as any).initData(tableData);
    }


  }
</script>

<style lang="scss">
  .base-right-page .base-right-conent-page {
    .departmentUser-findUser-page {
      .el-form{
        padding: 15px 0!important;
        .el-form-item {
          width: 100%;
          margin-bottom: 0;
        }
      }
    }
  }
</style>
