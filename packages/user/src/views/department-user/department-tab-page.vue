<template>
  <div class="department-tab-page">
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
        <department-form-page v-if="displayDepartmentForm" :treeNode="treeNode" ref="departmentform"
                              @flushTree="flushDepartmentForm"></department-form-page>
        <table-page v-if="displaySonDeptTable"
                    :tableColumnList="sonDeptTableColumnList" :tableButtonList="sonDeptTableButtonList"
                    :primaryColumnName="sonDeptPrimaryColumnName" :tableOperateList="sonDeptTableOperateList" @getTableData="getSonDeptData"
                    ref="sonDeptTable"></table-page>
        <table-page v-if="displayUserTable"
                    :tableColumnList="userTableColumnList" :tableButtonList="userTableButtonList"
                    :primaryColumnName="userPrimaryColumnName" :tableOperateList="userTableOperateList" @getTableData="getUserData"
                    ref="userTable"></table-page>
        <table-page v-if="displayRoleTable"
                    :tableColumnList="roleTableColumnList" :tableButtonList="roleTableButtonList"
                    :tableOperateList="roleTableOperateList" @getTableData="getRoleData"
                    ref="roleTable"></table-page>
      </el-main>
    </el-container>

    <el-dialog class="deptFormDialog" :title="deptFormTitle"
               :visible.sync="displayDeptFormDialog"
               :close-on-click-modal="false"
               @close="closeDeptFormDialog" top="14vh">
      <department-form-page ref="deptFormDialog" @flushTree="flushDeptTable"></department-form-page>
    </el-dialog>

    <el-dialog class="abow_dialog" :title="userFormTitle"
               :visible.sync="displayUserFormDialog"
               :close-on-click-modal="false"
               @close="closeUserFormDialog" top="7vh">
      <user-form-page ref="userForm" @flushTree="flushUserTable"></user-form-page>
    </el-dialog>

    <department-user-tree ref="userTree" title="关联用户" @saveUserTreeData="saveUserTreeData"></department-user-tree>
    <role-tree ref="roleTree" title="添加角色" @saveRoleData="saveRoleData"></role-tree>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import DepartmentFormPage from "./department-form-page.vue"
  import TablePage from '@/components/component/TablePage.vue';
  import UserFormPage from "@/views/department-user/user-form-page.vue";
  import DepartmentUserTree from "./department-usertree-dialog.vue"
  import RoleTree from "@/views/department-user/departmentDept-role-tree.vue";
  import {TableColumn} from "element-ui";
  import {IdentityApi} from "@/api/identity/identity-api";
  import {LocalStorageUtil} from "@/utils/js/localstorage_utils";

  @Component({
    name: "department-page",
    components: {
      DepartmentFormPage,
      UserFormPage,
      TablePage,
      RoleTree,
      DepartmentUserTree
    }
  })
  export default class DepartmentPage extends Vue {
    @Prop() treeNode: any // 接收父组件传过来的数据

    displayDepartmentForm = true;
    displaySonDeptTable = false;
    displayUserTable = false;
    displayRoleTable = false;

    displayDeptFormDialog = false;
    deptFormTitle = "添加部门";
    displayUserFormDialog = false;
    userFormTitle="添加用户"

    sonDeptPrimaryColumnName = "departmentId";
    userPrimaryColumnName = "userId";

    btnList = [{name: '机构信息', primary: true, compontName: 'departmentform'},
      {name: '下级机构', primary: false, compontName: 'sonDeptTable'},
      {name: '用户列表', primary: false, compontName: 'userTable'},
      {name: '默认角色', primary: false, compontName: 'roleTable'}];// 按钮组


    //*********************************** 下级机构 *********************************************
    sonDeptTableColumnList: Partial<{ [key in keyof TableColumn]?: any }>[] = [
      {prop: 'departmentId', type: 'selection', width: '40'},
      {prop: "departmentName", label: "名称", width: "200"},
      {prop: 'address', label: '地址', width: ''},
      {prop: 'departmentPname', label: '所在机构', width: ''},
      {prop: 'telephone', label: '电话', width: ''},
      {prop: 'createdOn', label: '创建时间', width: ''},
    ];
    sonDeptTableButtonList = [{name: '添加', primary: 'primary', click: this.addSonDept},
      {name: '删除', primary: 'danger', click: this.deleteSonDeptBatch,disabled:LocalStorageUtil.getItem("username")==='admin'?false:true}];

    sonDeptTableOperateList = [{name: '修改', icon: 'iconfont zwpt_edit1', click: this.updateSonDept},
      {name: '删除', icon: 'iconfont zwpt_del', click: this.deleteSonDept,hide: () => { return this.hideButton() }}];

    addSonDept() {
      this.displayDeptFormDialog = true;
      this.deptFormTitle = "添加部门";
      this.$nextTick(() => {
        (this.$refs.deptFormDialog as any).initDeptForm(this.treeNode, "add");
      });
    }

    updateSonDept(data) {
      this.displayDeptFormDialog = true;
      this.deptFormTitle = "修改部门";
      this.$nextTick(() => {
        let param = {"id": data.departmentId};
        (this.$refs.deptFormDialog as any).initDeptForm(param, "update");
      });
    }

    deleteSonDeptBatch(data) {
      if (data) {
        this.$confirm("确定删除选中的机构部门吗？", "提示", {
          iconClass: 'el-icon-question'
        })
          .then(async () => {
            const response = await IdentityApi.deleteSelectedDepts(this.treeNode.id, data);
            this.$message({message: '删除成功!', type: 'success'});
            this.getSonDeptData();// 刷新列表
            this.$emit('flushTree', this.treeNode.id);// 调用父组件的刷新左边树
          })
          .catch(() => {
          });
      }
    }

    deleteSonDept(data) {
      this.$confirm("删除部门后，其下若存在子部门以及用户，则将被上调一级，确定要删除吗？", "提示", {
        iconClass: 'el-icon-question'
      })
        .then(async () => {
          const response = await IdentityApi.deleteSelectedDepts(this.treeNode.id, [data.departmentId]);
          this.$message({message: '删除成功!', type: 'success'});
          this.getSonDeptData();// 刷新列表
          this.$emit('flushTree', this.treeNode.id);// 调用父组件的刷新左边树
        })
        .catch(() => {
        });
    }
    hideButton(){
      const username=LocalStorageUtil.getItem("username")
      return username==="admin"?false:true
    }
    async getSonDeptData() {
      let id = this.treeNode.id;
      // 获取子组件的分页信息
      let size = (this.$refs.sonDeptTable as any).page.pagesize;
      let num = (this.$refs.sonDeptTable as any).page.pagenum;
      let param = {"pagesize": size, "pagenum": num};
      const tableData = await IdentityApi.getDeptTabMessage(id, param);
      (this.$refs.sonDeptTable as any).initData(tableData);
    }

    flushDeptTable() {
      // 关闭新增窗口
      this.closeDeptFormDialog();
      // 刷新列表
      this.getSonDeptData();
      this.$emit('flushTree', this.treeNode.id);// 调用父组件的刷新左边树
    }

    closeDeptFormDialog() {
      this.displayDeptFormDialog = false;
    }

    //******************************************************************************************

    //*********************************** 员工列表 *********************************************
    userTableColumnList: Partial<{ [key in keyof TableColumn]?: any }>[] = [
      {prop: 'id', type: 'selection', width: '40'},
      {prop: "userName", label: "用户名", width: "200"},
      {prop: 'staffName', label: '职员姓名', width: ''},
      {prop: 'userCode', label: '用户编码', width: ''},
      {prop: 'parentDeptName', label: '所在机构', width: ''},
      {prop: 'telphoneTm', label: '联系电话', width: ''},
      {prop: 'userState', label: '状态', width: ''},
      {prop: 'description', label: '简述', width: ''},
    ];
    userTableButtonList = [{name: '添加', primary: 'primary', click: this.addUser},
      {name: '关联', primary: 'primary', click: this.associatedUser,type:'NoNeed'},
      {name: '删除', primary: 'danger', click: this.deleteUserBatch}];

    userTableOperateList = [{name: '修改', icon: 'iconfont zwpt_edit1', click: this.updateUser}];

    addUser() {
      this.displayUserFormDialog = true;
      this.userFormTitle = "添加用户";
      this.$nextTick(() => {
        (this.$refs.userForm as any).initUserForm(this.treeNode, "add");
      });
    }

    updateUser(data) {
      this.displayUserFormDialog = true;
      this.userFormTitle = "修改用户";
      this.$nextTick(() => {
        let param = {"id": data.userId};
        (this.$refs.userForm as any).initUserForm(param, "update");
      });
    }

    associatedUser() {
      (this.$refs.userTree as any).show(this.treeNode.id);
    }

    //关联用户
    async saveUserTreeData(nodes) {
      let deptIdList = [] as any[];
      let userList = [] as any[];
      for (let i = 0; i < nodes.length; i++) {
        let data = nodes[i];
        if (data.type == "dept") {
          deptIdList.push(data.id);
        }else if(data.type == 'root'){//根节点
            deptIdList.push(data.id);
          }else if(data.type == "user") {
          userList.push(data.id);
        }
      }
      if(deptIdList.length > 0 || userList.length > 0){
        let deptRoleRequestVo = {deptIdList: deptIdList, userList: userList} as any;
        await IdentityApi.establishRelationshipOnDeptUser(this.treeNode.id, deptRoleRequestVo);
        this.getUserData();
        this.$emit('flushTree', this.treeNode.id);// 调用父组件的刷新左边树
        this.$message({message: '添加成功!', type: 'success'});
      }else{
        this.$message({message: '请选择需要添加的人员!', type: 'warning'});
      }

    }

    deleteUserBatch(data) {
      if (data) {
        this.$confirm("确定要删除所有选择的用户吗？", "提示", {
          iconClass: 'el-icon-question'
        }).then(async () => {
            const response = await IdentityApi.deleteSelectedUsers(this.treeNode.id, data);
            this.$message({message: '删除成功!', type: 'success'});
            this.getUserData();// 刷新列表
            this.$emit('flushTree', this.treeNode.id);// 调用父组件的刷新左边树
          })
          .catch(() => {
          });
      }
    }

    //禁用用户
    async forbiddenUser(row) {
      let userId = row.userId;
      let disabled = row.disabled;
      let message = "";
      if (disabled == 0) {
        disabled = 1;
        message = "禁用成功";
      } else {
        disabled = 0;
        message = "启用成功";
      }
      let userObj = {"disabled": disabled};
      await IdentityApi.byIdupdateUser(userId, userObj);
      this.getUserData();
      this.$message({message: message, type: 'success'});
    }

    async getUserData() {
      let id = this.treeNode.id;
      // 获取子组件的分页信息
      let size = (this.$refs.userTable as any).page.pagesize;
      let num = (this.$refs.userTable as any).page.pagenum;
      let param = {"pagesize": size, "pagenum": num};
      const tableData = await IdentityApi.getUserTabMessage(id, param);
      (this.$refs.userTable as any).initData(tableData);
    }

    closeUserFormDialog(){
      this.displayUserFormDialog = false;
    }

    flushUserTable() {
      // 关闭新增窗口
      this.closeUserFormDialog();
      // 刷新列表
      this.getUserData();
      this.$emit('flushTree', this.treeNode.id);// 调用父组件的刷新左边树
    }
    //******************************************************************************************

    //*********************************** 默认角色 *********************************************
    roleTableColumnList: Partial<{ [key in keyof TableColumn]?: any }>[] = [
      {prop: "id", type: "selection", width: "40"},
      {prop: "name", label: "名称", width: "400"},
      {prop: 'rgName', label: '所在组', width: ''},
      {prop: 'description', label: '描述', width: '300'},
    ];
    roleTableButtonList = [{name: '添加', primary: 'primary', click: this.addRole},
      {name: '删除', primary: 'danger', click: this.deleteRoleBatch}];

    roleTableOperateList = [{name: '删除', icon: 'iconfont zwpt_del', click: this.deleteRole}];

    addRole() {
      (this.$refs.roleTree as any).show(this.treeNode);
    }

    deleteRoleBatch(data) {
      if (data) {
        this.$confirm("确定删除选中的角色成员吗？", "提示", {
          iconClass: 'el-icon-question'
        })
          .then(async () => {
            const response = await IdentityApi.deleteSelectedDepartmentRoles(this.treeNode.id, data);
            this.$message({message: '删除成功!', type: 'success'});
            this.getRoleData();// 刷新列表
          })
          .catch(() => {
          });
      }
    }

    deleteRole(data) {
      this.$confirm("该用户的此条角色信息将被删除，确定要删除吗？", "提示", {
        iconClass: 'el-icon-question'
      })
        .then(async () => {
          const response = await IdentityApi.deleteDepartmentRoleRight(this.treeNode.id,data.id);
          this.$message({message: '删除成功!', type: 'success'});
          this.getRoleData();// 刷新列表
        })
        .catch(() => {
        });
    }

    async getRoleData() {
      let id = this.treeNode.id;
      // 获取子组件的分页信息
      let size = (this.$refs.roleTable as any).page.pagesize;
      let num = (this.$refs.roleTable as any).page.pagenum;
      let param = {"pagesize": size, "pagenum": num};
      const tableData = await IdentityApi.getDepartmentRoleTabMessage(id, param);
      (this.$refs.roleTable as any).initData(tableData);
    }

    async saveRoleData(Nodes) {
      let subSystemIdList = [] as any[];
      let roleGroupIdList = [] as any[];
      let roleIdList = [] as any[];
      for (let i = 0; i < Nodes.length; i++) {
        let data = Nodes[i].data;
        if (data.type == "subsystem" && Nodes[i].childNodes.length == 0) {
          subSystemIdList.push(data.id);
        } else if (data.type == "rolegroup" && Nodes[i].childNodes.length == 0) {
          roleGroupIdList.push(data.id);
        } else if(data.type == "role") {
          roleIdList.push(data.id);
        }
      }
      let deptRoleRequestVo = {
        "subSystemIdList": subSystemIdList,
        "roleGroupIdList": roleGroupIdList,
        "roleIdList": roleIdList
      } as any;
      const response = await IdentityApi.addDepartmentRole(this.treeNode.id, deptRoleRequestVo);
      this.getRoleData();
      if(response == '203'){
        this.$message({message: '添加的角色组下无角色!', type: 'info'});
      }else{
        this.$message({message: '角色添加成功!', type: 'success'});
      }
      (this.$refs.roleTree as any).close();
    }
    //******************************************************************************************


    flushDepartmentForm() {
      this.treeNode.name = (this.$refs.departmentform as any).deptForm.name;
    }

    reloadDeptTabPage() {
      this.changePrimary({name: '机构信息', primary: true, compontName: 'departmentform'});
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
      if (item.compontName == 'departmentform') {
        this.displayDepartmentForm = true;
        this.displaySonDeptTable = false;
        this.displayUserTable = false;
        this.displayRoleTable = false;
        this.$nextTick(() => {
          (this.$refs.departmentform as any).initDeptForm(this.treeNode, "update");
        })
      } else if (item.compontName == 'sonDeptTable') {
        this.displayDepartmentForm = false;
        this.displaySonDeptTable = true;
        this.displayUserTable = false;
        this.displayRoleTable = false;
        // 打开组件
        this.$nextTick(() => {
          this.getSonDeptData();
        })
      } else if (item.compontName == 'userTable') {
        this.displayDepartmentForm = false;
        this.displaySonDeptTable = false;
        this.displayUserTable = true;
        this.displayRoleTable = false;
        // 打开组件
        this.$nextTick(() => {
          this.getUserData();
        })
      } else if (item.compontName == 'roleTable') {
        this.displayDepartmentForm = false;
        this.displaySonDeptTable = false;
        this.displayUserTable = false;
        this.displayRoleTable = true;

        // 打开组件
        this.$nextTick(() => {
          this.getRoleData();
        })
      }
    }
  }
</script>

<style lang="scss">
  .department-tab-page {
    width: 100%;
    height: 100%;
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

    .deptFormDialog .el-dialog {
      text-align: left;
      height: 440px;
      width: 60%;
      .el-dialog__body{
       width: 100%;
       height: calc(100% - 50px);
       box-sizing: border-box;

      }
      .el-form {
        width: 100%;
        height: 100%;
        overflow: auto;
        padding: 0 !important;
      }
    }
    .userFormDialog .el-dialog {
      text-align: left;
      height: 700px;
      width: 60%;

      .el-form {
        padding: 0 !important;
      }
    }

    .abow_dialog {
    display: flex;
    overflow: hidden;
    .el-dialog {
        padding: 0 !important;
        text-align: left;
        height: 700px;
        width: 60%;
    }
  }

  }

</style>
