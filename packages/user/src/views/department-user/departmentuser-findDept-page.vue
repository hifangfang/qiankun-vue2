<template>
  <div class="departmentuser-findDept-page">
    <el-form label-position="left" size="small" :model="departmentForm">
      <el-row :gutter="100">
        <el-col :span="8">
          <el-form-item label="部门名称" label-width="70px">
            <el-input v-model="departmentForm.deptName" placeholder="请输入部门名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="行政区编码" label-width="90px">
            <el-input v-model="departmentForm.deptXzqbm" placeholder="请输入行政区编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div style="text-align: right">
            <el-button type="primary" size="small" @click="queryDept">查询</el-button>
            <el-button type="primary" plain size="small" @click="reset">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <table-page :tableColumnList="deptTableColumnList" :dataTableHeight="dataTableHeight" @getTableData="getDeptData" ref="deptTable"></table-page>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import {IdentityApi} from '@/api/identity/identity-api';
  import TablePage from '@/components/component/TablePage.vue';
  import {TableColumn} from "element-ui";
  import {DepartmentRequest} from '@/api/identity/model/department-user-model';


  @Component({
    name: "departmentuser-findDept-page",
    components: {
      TablePage
    }
  })
  export default class DepartmentUserFindDeptPage extends Vue {

    departmentForm: DepartmentRequest = {} as DepartmentRequest;

    deptTableColumnList: Partial<{ [key in keyof TableColumn]?: any }>[] = [
      {prop: 'departmentId', type: 'selection', width: '40'},
      {prop: "departmentName", label: "名称", width: "200"},
      {prop: 'address', label: '地址', width: ''},
      {prop: 'xzqbm', label: '行政区编码', width: ''},
      {prop: 'departmentPname', label: '所在机构', width: ''},
      {prop: 'telephone', label: '电话', width: ''},
      {prop: 'createdOn', label: '创建时间', width: '', type: "longtime"}
    ];
    dataTableHeight=window.innerHeight - 320;
    deptId;

    //初始化表格
    async initDeptTable(data) {
      this.deptId = data.id;
      this.getDeptData();
    }

    async getDeptData() {

      let size = (this.$refs.deptTable as any).page.pagesize;
      let num = (this.$refs.deptTable as any).page.pagenum;

      this.departmentForm.pagenum = num;
      this.departmentForm.pagesize = size;
      this.departmentForm.nodeid = this.deptId;
      const tableData = await IdentityApi.getDepartRootTabMessage(this.departmentForm);
      (this.$refs.deptTable as any).initData(tableData);
    }

    //查询
    async queryDept() {
      this.departmentForm.pagenum = 1;
      this.departmentForm.pagesize = 10;
      this.departmentForm.nodeid = this.deptId;
      const tableData = await IdentityApi.getDepartRootTabMessage(this.departmentForm);
      (this.$refs.deptTable as any).initData(tableData);
    }


    //重置
    async reset() {
      this.departmentForm={
        deptName :"",
        deptXzqbm : "",
        pagenum:1,
        pagesize:10,
        nodeid:this.deptId,
      }
      // this.departmentForm.deptName = "";
      // this.departmentForm.deptXzqbm = "";
      // this.departmentForm.pagenum = 1;
      // this.departmentForm.pagesize = 10;
      // this.departmentForm.nodeid = this.deptId;
      const tableData = await IdentityApi.getDepartRootTabMessage(this.departmentForm);
      (this.$refs.deptTable as any).initData(tableData);
    }


  }
</script>

<style lang="scss">
  .el-button el-button--primary el-button--small{
      width: 58px;
      height: 30px;
  }
  .base-right-page .base-right-conent-page {
    .departmentuser-findDept-page {
      .el-form{
        padding: 15px 0!important;
        .el-form-item {
          width: 100%;
          margin-bottom: 0;
        }
        .el-icon-search{
          width: 58px;
          height: 30px;
        }
      }
    }
  }

</style>
