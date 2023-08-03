<template>
  <div class="user-tab-page">
    <el-container>
      <el-header>
        <el-button-group>
          <el-button v-for="(item,index) in btnList"
                     :key="index" :type="item.primary?'primary':''" size="medium" @click="changePrimary(item)">
            {{ item.name }}
          </el-button>
        </el-button-group>
      </el-header>
      <el-divider></el-divider>
      <el-main>
        <user-form-page v-if="displayUserForm" :treeNode="treeNode" ref="userform"
                        @flushTree="flushUserForm"></user-form-page>
        <table-page v-if="displayRoleTable"
                    :tableColumnList="roleTableColumnList" :tableButtonList="roleTableButtonList"
                    :primaryColumnName="primaryColumnName" :tableOperateList="roleTableOperateList"
                    @getTableData="getRoleData"
                    ref="roleTable"></table-page>
        <user-extend-info-form-page v-if="displayUserExtendInfoForm" :treeNode="treeNode"
                                    ref="userextinfoform"></user-extend-info-form-page>
        <user-authority-count-page v-if="displayUserAuthorityCount" :treeNode="treeNode"></user-authority-count-page>
      </el-main>
    </el-container>
    <role-tree ref="roleTree" title="添加角色" @saveRoleData="saveRoleData"></role-tree>

    <user-tree ref="roleusertree" @saveUserTreeData="saveUserTreeData"></user-tree>

  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from "vue-property-decorator";

import UserTree from "@/components/component/UserTree.vue";//人员选择
import TablePage from '@/components/component/TablePage.vue';
import UserFormPage from "./user-form-page.vue";
import UserExtendInfoFormPage from "./user-extendinfo-form-page.vue";
import UserAuthorityCountPage from "./user-authoritycount-page.vue";
import RoleTree from "./department-role-tree.vue";
import {TableColumn} from "element-ui";
import {IdentityApi} from "@/api/identity/identity-api";
import {RolemgrApi} from "@/api/identity/module/Rolemgr-api";
import {LocalStorageUtil} from "@/utils/js/localstorage_utils";


@Component({
  name: "user-tab-page",
  components: {
    TablePage,
    UserFormPage,
    UserExtendInfoFormPage,
    UserAuthorityCountPage,
    RoleTree,
    UserTree
  }
})
export default class UserTabPage extends Vue {
  @Prop() treeNode: any // 接收父组件传过来的数据

  displayUserForm = true;
  displayRoleTable = false;
  displayUserExtendInfoForm = false;
  displayUserAuthorityCount = false;

  roleTableList = [];

  btnList = [{name: '用户信息', primary: true, compontName: 'userForm'},
    {name: '角色列表', primary: false, compontName: 'roleTable'},
    {name: '用户扩展信息', primary: false, compontName: 'userExtInfo'},
    {name: '权限计算', primary: false, compontName: 'userPriCount'}];// 按钮组

  //*********************************** 角色列表 *********************************************
  primaryColumnName = 'roleId';
  roleTableColumnList: Partial<{ [key in keyof TableColumn]?: any }>[] = [
    {prop: "id", type: "selection", width: '40'},
    {prop: "roleName", label: "名称", width: '300'},
    {prop: 'roleGroupName', label: '所在组', width: ''},
    {prop: 'subName', label: '隶属子系统', width: '300'},
    {prop: 'description', label: '描述', width: ''},
  ];
  roleTableButtonList = [{name: '添加', primary: 'primary', click: this.addRole},
    {name: '删除', primary: 'danger', click: this.deleteRoleBatch},
    {name: '复制用户权限', primary: 'primary', click: this.copyUserRole}];

  roleTableOperateList = [{name: '删除', icon: 'iconfont zwpt_del', click: this.deleteRole}];
  selectRoleIds=[]as any
  async addRole() {
    (this.$refs.roleTree as any).show(this.treeNode);
  }

  async copyUserRole(data) {
    this.selectRoleIds=data;
    if(data){
      const  params={
        roleIds:data
      }
      let response:any=await IdentityApi.getUnOperateRole(params)
      if(response?.length>0){
        let arrnew = response.map((obj,index) => {
          return obj.name;
        }).join(",").split(',')
        this.$message({message: '该用户没有  ['+arrnew+"]  角色权限", type: 'warning'});
      }else{
        (this.$refs.roleusertree as any).show();
      }
    }
  }

  deleteRoleBatch(data) {
    if (data) {
      this.$confirm("确定删除选中的角色吗？", "提示", {
        iconClass: 'el-icon-question'
      })
        .then(async () => {
          const response = await IdentityApi.deleteSelectedRoles(this.treeNode.id, data);
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
        const response = await IdentityApi.deleteSelectedRoles(this.treeNode.id, [data.roleId]);
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
    let tableData = await IdentityApi.getRoleTabMessage(this.treeNode.id, param);
    if (tableData.data.length == 0 && num > 0) {
      num = num - 1
      let param = {"pagesize": size, "pagenum": num};
      tableData = await IdentityApi.getRoleTabMessage(this.treeNode.id, param);
    }
    this.roleTableList = tableData.data;
    (this.$refs.roleTable as any).initData(tableData);
  }

  async saveRoleData(Nodes) {
    let nodeUserId = this.treeNode.id;// 部门树中被点击的用户的id
    let roleSubsysArray = new Array();// 保存角色组根节点id
    let roleGroupArray = new Array();// 保存角色组的id
    let roleArray = new Array();// 保存角色的id
    for (let i = 0; i < Nodes.length; i++) {
      let data = Nodes[i].data;
      if (data.type == "subsystem" && Nodes[i].childNodes.length == 0) {
        roleSubsysArray.push(data.id);
      } else if ("rolegroup" == data.type && Nodes[i].childNodes.length == 0) {
        roleGroupArray.push(data.id);
      } else if ("role" == data.type) {
        roleArray.push(data.id);
      }
    }
    let roleSubsysArray1 = "[" + roleSubsysArray + "]";
    let roleGroupArray1 = "[" + roleGroupArray + "]";// 格式化
    let roleArray1 = "[" + roleArray + "]";// 格式化
    if (roleGroupArray1.length != 2 || roleArray1.length != 2 || roleSubsysArray1.length != 2) {
      let param = {
        roleSubsysIds: roleSubsysArray1,
        roleGroupIds: roleGroupArray1,
        roleIds: roleArray1,
        userId: nodeUserId,
        systemUser: LocalStorageUtil.getItem('systemUser'),
        loginUserId: LocalStorageUtil.getItem('userId')
      };
      const response = await RolemgrApi.establishRelationshipOnUserRole(param);
      if (response == "true") {
        (this.$refs.roleTree as any).close();
        this.getRoleData();
        this.$message({message: '添加成功!', type: 'success'});
      } else if (response == "false") {// 重复了直接关闭
        (this.$refs.roleTree as any).close();
      } else {
        this.$message({message: '添加失败!', type: 'error'});
      }
    }
  }

  //复制成员角色权限
  async saveUserTreeData(nodes) {
    const deptsArray = [] as string[];
    const usersArray = [] as string[];
    if (nodes != null) {
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.type == 'dept') { //有部门勾选
          deptsArray.push(node.id); //保存部门id到数组
        } else if (node.type == 'user' || node.type == 'disableUser') { //有用户勾选
          usersArray.push(node.id); //保存用户id到数组
        }
      }
    }
    //格式化
    const usersArray1 = "[" + usersArray + "]";
    const deptsArray1 = "[" + deptsArray + "]";
    let param = {
      id: this.treeNode.id, //当前选中的用户
      userId: usersArray1,
      deptId: deptsArray1,
      roleIds: this.selectRoleIds
    }
    if (usersArray1.length != 2 || deptsArray1.length != 2) { //长度为2是表示数组为"[]"
      const reponse = await RolemgrApi.copyUserRole(param);
      if (reponse == "true") {
        this.$message({message: '复制成功!', type: 'success'});
      }
    } else {
      this.$message({message: '请选择需要复制权限的成员', type: 'warning'});
    }
  }

  //*********************************** 角色列表结束 *********************************************

  flushUserForm(id) {
    let form = (this.$refs.userform as any).userForm;
    let disableIcon = '#zwpt_jyzjd';
    this.treeNode.icon = 1!=form.disabled?'#zwpt_zjd':disableIcon;
    this.treeNode.name = form.staffName;
    //用户修改所在机构 刷新树节点
    this.$emit("flushTree",id,null)
  }

  reloadUserTabPage() {
    this.changePrimary({name: '用户信息', primary: true, compontName: 'userForm'});
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
    if (item.compontName == 'userForm') {
      this.displayUserForm = true;
      this.displayRoleTable = false;
      this.displayUserExtendInfoForm = false;
      this.displayUserAuthorityCount = false;
      this.$nextTick(() => {
        (this.$refs.userform as any).initUserForm(this.treeNode, "update");
      })
    } else if (item.compontName == 'roleTable') {
      this.displayUserForm = false;
      this.displayRoleTable = true;
      this.displayUserExtendInfoForm = false;
      this.displayUserAuthorityCount = false;
      // 打开组件
      this.$nextTick(() => {
        this.getRoleData();
      })
    } else if (item.compontName == 'userExtInfo') {
      this.displayUserForm = false;
      this.displayRoleTable = false;
      this.displayUserExtendInfoForm = true;
      this.displayUserAuthorityCount = false;
      // 打开组件
      this.$nextTick(() => {
        (this.$refs.userextinfoform as any).initUserExtForm(this.treeNode.id);
      })
    } else if (item.compontName == 'userPriCount') {
      this.displayUserForm = false;
      this.displayRoleTable = false;
      this.displayUserExtendInfoForm = false;
      this.displayUserAuthorityCount = true;
    }
  }
}
</script>

<style lang="scss">
.user-tab-page {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  .headerStyle{
    width: 100%;
    border-bottom: 1px solid #ccc;
    padding: 0px 0px 15px 0px;
  }
  .el-container{
    height: 100% !important;
    width: 100% !important;
    box-sizing: border-box;
  }
  .el-header {
    text-align: left;

    .el-button + .el-button {
      margin-left: 0px;
    }
  }
  .el-main{
    height: calc(100% - 60px);
  }
}
</style>
