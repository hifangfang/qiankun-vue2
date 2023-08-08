<template>
  <div class="department-user-page-left base-left-page">
    <div v-if="!subGuid" class="base-left-tree-page">
      <span>{{ this.title }}</span>
      <div class="base-left-icon-box">
        <i class="iconfont zwpt_search1 search-icon" @click="openSearch() "></i>
      </div>
    </div>
    <el-input
      v-if="showInput"
      class="searchInput"
      size="small"
      clearable
      placeholder="输入关键字进行过滤"
      v-model="filterText">
      <i slot="suffix" class=" iconfont zwpt_search1 el-input__icon"></i>
    </el-input>
    <div class="department-tree-wrap left-tree-wrap" :class="subGuid?'none-title-page':''">
      <el-tree
        class="filter-tree"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :load="loadNode"
        :expand-on-click-node="true"
        node-key="id"
        @node-click="clickTree"
        @node-expand="nodeChange"
        @node-collapse="nodeChange"
        lazy
        :data="treeData"
        draggable
        :allow-drag="allowDrag"
        :allow-drop="allowDrop"
        @node-drag-end="nodeDrag"
        :default-expanded-keys="expandKeys"
        :current-node-key="currentNodeId"
        ref="tree"
        @check-change="handleCheckChange">
         <span class="custom-tree-node hover-tree-node" slot-scope="{ node, data }">
           <svg v-if="node.expanded&&data.type=='root'" class="icon" aria-hidden="true">
    　　      <use xlink:href="#zwpt_L1-open"></use>
           </svg>
           <svg v-else-if="node.expanded&&data.type=='dept'" class="icon" aria-hidden="true">
    　　      <use xlink:href="#zwpt_fileOpen"></use>
           </svg>
           <svg v-else class="icon" aria-hidden="true">
    　　      <use :xlink:href="data.icon"></use>
           </svg>
           <div :title="data.name" class="title">{{ data.name }}</div>
           <ButtonMore v-if="getButtonList(data).length>0" :buttonList="getButtonList(data)" :data="data"></ButtonMore>
         </span>
      </el-tree>
    </div>

    <adjust-dept-tree ref="adjustdepttree" :treeNode="treeNode"
                      @saveAdjustDeptData="saveAdjustDeptData"></adjust-dept-tree>
    <upload-deptuser-dialog ref="uploadDeptUser" @flushTree="flushNode"></upload-deptuser-dialog>
    <resetSM3-dialog ref="resetSM3"></resetSM3-dialog>
    <import-appkey-dialog ref="importAppkey"></import-appkey-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import {IdentityApi} from '@/api/identity/identity-api';
import ButtonMore from '@/components/component/ButtonMore.vue';
import AdjustDeptTree from "@/views/department-user/adjustdept-tree-dialog.vue";
import UploadDeptuserDialog from "@/views/department-user/upload-deptuser-dialog.vue";
import ResetSM3Dialog from "@/views/department-user/resetSM3-dialog.vue";
import {DragDeptAndUserSeqRequest} from "@/api/identity/model/department-user-model";
import ImportAppkeyDialog from "@/views/department-user/import-appkey-dialog.vue"
import {UserSyncRequest} from "@/api/identity/model/department-user-model";
import {getUrlParam} from "@/utils/js/url_path_utils";
import {LocalStorageUtil} from "@/utils/js/localstorage_utils";

@Component({
  name: "department-user-page-left",
  components: {
    UploadDeptuserDialog,
    ResetSM3Dialog,
    ButtonMore,
    AdjustDeptTree,
    ImportAppkeyDialog
  }
})
export default class DepartmentUserPageLeft extends Vue {
  subGuid = "";
  title = '用户管理';
  treeNode: any = {};// 选中树节点数据
  currentNodeId = '';// 当前节点名称
  rootNode;// 根节点
  defaultProps = {
    label: 'name',
    children: 'childrenNode',
    isLeaf: 'leaf',
    id: 'id'
  };
  expandKeys = [] as any;
  filterText = "";
  treeData = [] as any;
  userTreeData = [] as any;
  expandedId = '';
  isLazy: boolean = true;
  showInput = false;
  itemData = {
    code: '',
    id: '',
    name: ''
  };//
  loginUserDetail = {} as any
  loginUserSameOrNextLevelDept = [] as any;
  systemUser = LocalStorageUtil.getItem('systemUser') as any;

  async created() {
    debugger
    //获取当前登录用户的父机构及跟他平级或子级的部门
    this.loginUserSameOrNextLevelDept = []
    console.log(this.$store.state,"ssssss测试测试")
    const userId = this.$store.state?.global.userInfo?.user_id || getUrlParam("userId")
    const response = await IdentityApi.getByIdUserDepartments(userId);
    this.loginUserDetail = response
    for (let i = 0; i < this.loginUserDetail.departments.length; i++) {
      const data = await IdentityApi.getIterateDeptEthnicGroup(this.loginUserDetail.departments[i].id)
      this.loginUserSameOrNextLevelDept = this.loginUserSameOrNextLevelDept.concat(data)
      const filter_arrObj = this.loginUserSameOrNextLevelDept.filter((item, index, origin) =>
        index === origin.findIndex(itemInner => {
          return itemInner.departmentId === item.departmentId
        }
        ))
      this.loginUserSameOrNextLevelDept = filter_arrObj
    }
  }

  @Watch("filterText")
  async FilterTextDepartment(val) {
    (this.$refs.tree as any).$data.store.lazy = false
    this.expandKeys = [] as any;
    this.userTreeData = [] as any;
    if (val) {
      let isSystemUser = this.systemUser;
      const data: any = await IdentityApi.getUsersSearchTree(val, isSystemUser)
      this.treeData = await this.formatTreeData(data)
      this.getAllExpand(this.treeData, val)
      this.$nextTick(() => {
        (this.$refs.tree as any).$data.store.lazy = true
        if (this.userTreeData[0]?.id) {
          (this.$refs.tree as any).setCurrentKey(this.userTreeData[0].id)
          this.clickTree(this.userTreeData[0])
        } else {
          this.$emit('changeCompont', '', '');
        }
      })
    } else {
      (this.$refs.tree as any).$data.store.lazy = true
      this.getTreeUsers()
    }
  }

  handleCheckChange(data, checked, indeterminate) {
    this.itemData = data;
  }

  formatTreeData(data) {
    if (data.length == 0) {
      return
    }
    let tree: any = []
    data.forEach(item => {
      if (item.type == "root") {
        item.icon = "#zwpt_L1-closed";
        item.isLeaf = false;
        item.showMore = true;
        if (!item.childrenNode) {
          this.$set(item, 'childrenNode', [])
        }
        tree.push(item)
      } else if (item.type == "dept") {
        item.icon = "#zwpt_fileClose";
        item.isLeaf = false;
        item.showMore = true;
        if (!item.childrenNode) {
          this.$set(item, 'childrenNode', [])
        }
        tree.push(item)
      } else if (item.type == "user") {
        item.icon = "#zwpt_zjd";
        item.isLeaf = true;
        item.showMore = true;
        if (!item.childrenNode) {
          this.$set(item, 'childrenNode', [])
        }
        tree.push(item)
      } else if (item.type = "disableUser") {
        item.icon = "#zwpt_jyzjd";
        item.isLeaf = true;
        item.showMore = true;
        if (!item.childrenNode) {
          this.$set(item, 'childrenNode', [])
        }
        tree.push(item)
      }
      if (item.childrenNode && item.childrenNode.length > 0) {
        this.formatTreeData(item.childrenNode)
      }
      return tree
    })
    return tree
  }

  //展开全部节点
  getAllExpand(data, value) {
    if (!data || data.length == 0) {
      return
    }
    data.forEach(item => {
      this.expandKeys.push(item.id)
      if (item.name.indexOf(value) > -1) {
        this.userTreeData.push(item)
      }
      if (item.childrenNode && item.childrenNode.length > 0) {
        this.getAllExpand(item.childrenNode, value)
      }
    });
  }

  async getTreeUsers() {
    const userName = this.$store.state?.global.userInfo?.user_name as string;
    const id = 'null';
    const fg = 'true';
    let response: any = await IdentityApi.syncDepartmentsUserTree(id, userName, fg);
    response=response.map(item=>{return{...item,icon:this.getNodeIcon(item.type,item.disabled)}})
    this.expandKeys = []
    this.$emit('changeCompont');
    this.treeData = response
  }

  filterNode(value, data) {
    if (!value) return true;
    return data.name.indexOf(value) !== -1;
  }

  async initTree(id, fg) {
    const userName = this.$store.state?.global.userInfo?.user_name as string;
    const response: any = await IdentityApi.syncDepartmentsUserTree(id, userName, fg);
    let tree:any=response.map(item=>{return{...item,icon:this.getNodeIcon(item.type,item.disabled),leaf:item.treeStatus}})
    return tree;
  }
  //获取用户管理图标
  getNodeIcon(type,disabled){
    let icon = '';
    if(type=="root"){
      icon="#zwpt_L1-closed"
    }
    if(type=="dept"){
      icon="#zwpt_fileClose"
    }
    if(type=="user"&&!disabled){
      icon="#zwpt_zjd"
    }
    if(type=="user"&&disabled){
      icon="#zwpt_jyzjd"
    }
    return icon;
  }
  async loadNode(node, resolve) {
    let response;
    if (node.level === 0) {
      this.rootNode = node;
      response = await this.initTree('null', "true");
    } else {
      response = await this.initTree(node.data.id, node.data.leaf);
    }
    this.$nextTick(() => {
      resolve(response);
    });
  }


  nodeChange(data) {// 展开的时候选中节点有变化
    this.currentNodeId = data.id;
  }

  openForm() {  //添加子系统
    this.$emit('changeCompont', 'DepartmentUserTab', null);
  }


  clickTree(data) {
    this.currentNodeId = data.id;
    const username = LocalStorageUtil.getItem("username")
    const isSameOrNextLevelDept = this.loginUserSameOrNextLevelDept.some(item => item.departmentId == data.id)
    if (data.type == 'root' && (this.systemUser == 1 || isSameOrNextLevelDept)) {
      this.$emit('changeCompont', 'DepartmentUserTab', data);
    } else if (data.type == 'dept' && (this.systemUser == 1 || isSameOrNextLevelDept)) {
      this.$emit('changeCompont', 'DepartmentTab', data);
    } else if (data.type == 'user') {
      this.$emit('changeCompont', 'UserTab', data);
    } else {
      this.$emit('changeCompont', '');
    }
  }

  //添加机构
  departmentAdd(data) {
    this.$emit('changeCompont', 'DepartmentFormPage', data);
  }

  //删除机构
  async deleteDeptAdjustChild(data) {
    this.$confirm('删除该部门后，其下若存在子部门以及用户，则将被上调一级，确定要删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      if (this.MICRO_CONFIG.enableSync) {
        let syncRequest = {
          userId: '',
          type: 'delete',
          deptId: data.id
        } as UserSyncRequest;
        await IdentityApi.userSync(syncRequest);
      }
      await IdentityApi.deleteDeptAdjustChild(data.id, data.pid);
      (this.$refs.tree as any).remove(data.id);
      this.$emit('changeCompont', '', '');
      const pNode = (this.$refs.tree as any).getNode(data.pid);
      this.flushNode(pNode.data.id, null)
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
    })
  }

  //添加用户
  userAdd(data) {
    this.$emit('changeCompont', 'UserFormPage', data);
  }

  //删除用户
  async deleteUser(data) {

    const dataJson = await IdentityApi.hasTaskInstance(data.id);
    if (dataJson.flag) {
      let userHasManage = dataJson.userHasManage;// 用户办理过的环节数
      let nextManagerUser = dataJson.nextManagerUser;// 为下个环节的办理人员
      let div = "<div><label style='color:red;margin-left:5px;'>用户【" + data.name
        + "】存在以下关联，不可删除！</label><table class='table table-bordered table-hover' style='width:390px;margin-left:5px;'>" +
        "<thred><tr class='info'><th>关联条件</th><th>关联数</th></tr></thred><tbody>";
      if (userHasManage && userHasManage != 0) {
        div += "<tr><td>用户办理过的环节数</td><td>" + userHasManage + "</td></tr>";
      }
      if (nextManagerUser && nextManagerUser != 0) {
        div += "<tr><td>下个环节的办理人员</td><td>" + nextManagerUser + "</td></tr>";
      }
      div += "</tbody></table></div>";

      await this.$alert(div, '提示', {
        dangerouslyUseHTMLString: true
      });
    } else {
      this.$confirm('确定要删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        if (this.MICRO_CONFIG.enableSync) {
          let syncRequest = {
            userId: data.id,
            type: 'delete',
            deptId: ''
          } as UserSyncRequest;
          await IdentityApi.userSync(syncRequest);
        }
        let str = await IdentityApi.userDelete(data.id);
        if (!str) {
          this.$message({
            type: 'warning',
            message: '禁止删除!'
          });
        } else {
          // (this.$refs.tree as any).remove(data.id);
          //当用户属于多个机构时 直接remove删除有问题
          data.departmentList.forEach(item => {
            this.flushNode(item.id, null)
          })
          this.$emit('changeCompont', '', '');
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      });
    }
  }

async resetSM3Pwd() {
    this.$confirm('重置所有密码为SM3加密？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    }).then(async () => {
      (this.$refs.resetSM3 as any).init();
      let a = {};
      await IdentityApi.resetSM3pwd(a);

    }).catch(() => {
    });

  }


  //重置密码
  async resetPwd(data) {
    this.$confirm('确定要重置密码吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    }).then(async () => {
      await IdentityApi.resetPwd(data.id);
      this.$message({
        type: 'success',
        message: '重置成功，下次登录生效!'
      });
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消重置'
      });
    });
  }

  //机构调整
  identityAdjust(data) {
    this.treeNode = data;
    (this.$refs.adjustdepttree as any).show();
  }

  //导入用户
  importUser(data) {
    (this.$refs.uploadDeptUser as any).init(data);
  }

  //导出用户
  async exportUser(data) {
    const response = await IdentityApi.exportDeptUser(data.id);

    let url = window.URL.createObjectURL(new Blob([response as any]));
    let link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", "部门用户" + this.getExportTime() + ".xlsx");
    document.body.appendChild(link);
    link.click();
    this.$message.success("导出成功");
  }

  // 导入电子签名签章
  importAppkey(data) {
    (this.$refs.importAppkey as any).init(data);
  }

  flushNode(id, type) {
    let node = this.rootNode;
    if (!type) {
      if (!id) {
        if (this.currentNodeId != '' && null != this.currentNodeId) {
          node = (this.$refs.tree as any).getNode(this.currentNodeId); // 通过节点id找到对应树节点对象
        }
      } else {
        node = (this.$refs.tree as any).getNode(id); // 通过节点id找到对应树节点对象
      }
    }
    //if (node.childNodes.length > 0) {
    node.loaded = false;
    node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节
    //}
  }

  async saveAdjustDeptData(node) {
    const response = await IdentityApi.adjustDepartment(this.treeNode.id, node[0].id);
    if (response == "success") {
      this.flushNode(null, 'root');
      this.$message({message: '机构调整成功', type: 'success'});
    } else {
      this.$message({message: '目标节点下已存在相同名称的机构,请重新选择!', type: 'error'});
    }

  }

  getButtonList(data) {// 获取buttonList
    //查出当前登录人的父机构 当前登录人其父级及上级机构右侧页面的所有内容不显示，鼠标悬浮父级及上级机构出现的功能也全部隐藏掉
    const isParentDept = this.loginUserDetail.departments?.some(item => item.id == data.id)
    const isSameOrNextLevelDept = this.loginUserSameOrNextLevelDept.some(item => item.departmentId == data.id)
    let username = LocalStorageUtil.getItem("username")
    let buttonList = [] as any;
    if (data.type == 'root') {
      if (this.systemUser == 1 || isParentDept || isSameOrNextLevelDept) {
        if (data.nodePrivilege) {
          buttonList.push({
            name: '添加机构',
            icon: 'iconfont zwpt_add icon-add',
            disabled: false,
            method: this.departmentAdd
          });
          buttonList.push({
            name: '一键排序', icon: 'iconfont zwpt_yijianpaixu icon-sort', disabled: false, method: this.oneClickSort,
            showTool: true, tipContent: '点击后即机构部门按照行政区编码排序，人员按照姓名首字母排序，操作后排序不可恢复。'
          });
        }
        buttonList.push({name: '导入用户', icon: 'iconfont zwpt_dryh icon-dryh', disabled: false, method: this.importUser});
        buttonList.push({name: '导出用户', icon: 'iconfont zwpt_dcyh icon-dryh', disabled: false, method: this.exportUser});
      }
      // buttonList.push({name: '导入电子签名签章', icon: 'el-icon-circle-plus-outline', disabled: false, method: this.importAppkey});
      const pullData = localStorage.pullData
      if (pullData == "true") {
        buttonList.push({name: '数据同步', icon: 'iconfont zwpt_sjtb icon-sjtb', disabled: false, method: this.pullData});
      }
    } else if (data.type == 'dept') {
      if (this.systemUser == 1 || isParentDept || isSameOrNextLevelDept) {
        if (data.nodePrivilege) {
          buttonList.push({
            name: '添加机构',
            icon: 'iconfont zwpt_add icon-add',
            disabled: false,
            method: this.departmentAdd
          });
        }
        // 删除机构、机构调整，这两个功能只对最高的系统管理员可见可操作
        if (this.systemUser == 1) {
          buttonList.push({
            name: '删除机构',
            icon: 'iconfont zwpt_del1 icon-del',
            disabled: false,
            method: this.deleteDeptAdjustChild
          });
          buttonList.push({
            name: '机构调整',
            icon: 'iconfont zwpt_jgtz icon-jgtz',
            disabled: false,
            method: this.identityAdjust
          });
        }
        buttonList.push({name: '添加用户', icon: 'iconfont zwpt_add icon-add', disabled: false, method: this.userAdd});
        buttonList.push({name: '导入用户', icon: 'iconfont zwpt_dryh icon-dryh', disabled: false, method: this.importUser});
        buttonList.push({name: '导出用户', icon: 'iconfont zwpt_dcyh icon-dryh', disabled: false, method: this.exportUser});
      } else{
        if (data.nodePrivilege) {
          buttonList.push({
            name: '添加机构',
            icon: 'iconfont zwpt_add icon-add',
            disabled: false,
            method: this.departmentAdd
          });
        }
        buttonList.push({name: '添加用户', icon: 'iconfont zwpt_add icon-add', disabled: false, method: this.userAdd});
        buttonList.push({name: '导入用户', icon: 'iconfont zwpt_dryh icon-dryh', disabled: false, method: this.importUser});
        buttonList.push({name: '导出用户', icon: 'iconfont zwpt_dcyh icon-dryh', disabled: false, method: this.exportUser});
      }
    } else {
      if(data.id === '8c7d3682-c080-4d4a-947f-af08e64576a2') {
        buttonList.push({name: '重置SM3密码', icon: 'iconfont zwpt_czmm icon-czmm', disabled: false, method: this.resetSM3Pwd});
      }
      buttonList.push({name: '删除用户', icon: 'iconfont zwpt_del1 icon-del', disabled: false, method: this.deleteUser});
      buttonList.push({name: '重置密码', icon: 'iconfont zwpt_czmm icon-czmm', disabled: false, method: this.resetPwd});
    }
    return buttonList;
  }

  //******************************************************拖拽节点 Start ***************************************************
  allowDrag(node) {// 允许拖拽的条件
    let type = node.data.type;
    if (type == "root") {// 根目录级别不允许调整
      this.$message({message: '根节点机构不允许拖拽', type: 'warning'});
      return false;
    }
    return true;
  }

  allowDrop(draggingNode, dropNode, type) {
    if (draggingNode.level != dropNode.level || draggingNode.data.type != dropNode.data.type || draggingNode.data.pid != dropNode.data.pid) {
      return false;
    }
    if (type == 'inner') {
      return false;
    }
    return true;
  }

  async nodeDrag(sourceNode, targetNode, direction, event) {// 拖拽
    if (sourceNode.level != targetNode.level) {
      return;
    }
    if (sourceNode.data.type != targetNode.data.type) {
      this.$message({message: '部门与用户级别顺序调整无效', type: 'warning'});
      return false;
    }
    if ("after" == direction) {
      direction = "next";
    } else if ("before" == direction) {
      direction = "prev";
    }
    if (direction == "prev" || direction == "next") {
      let request = {
        parentDeptId: sourceNode.data.pid,// 当前拖拽节点的父id
        moveType: direction,
        currentNodeId: sourceNode.data.id,// 当前拖拽节点的id
        targetNodeId: targetNode.data.id,// 目标节点的id
      } as DragDeptAndUserSeqRequest;
      if (sourceNode.data.type == "dept") {
        await IdentityApi.dragDeptSequence(request);
      }
      if (sourceNode.data.type == "user") {
        await IdentityApi.dragUserSequence(request);
      }
      this.$message({message: '拖拽成功!', type: 'success'});
    }
  }

  getExportTime() {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
    let date = new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate();
    let hh = new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours();
    let mm = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes();
    let ss = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
    let exportTime = "" + year + month + date + hh + mm + ss;
    return exportTime;
  }

  //******************************************************拖拽节点 END ***************************************************
  //数据同步
  async pullData(data) {
    this.$emit("refleshLoad", true)
    const dataDetail = await IdentityApi.pullData()
    if (dataDetail.success) {
      this.$message({message: "数据同步成功!", type: "success"});
      this.flushNode(data.id, data.type)
      //expandKeys 去重
      this.expandKeys.push(data.id);
      const mySet = new Set(this.expandKeys);
      this.expandKeys = [...mySet];
      this.$emit("refleshLoad", false)
    }
  }

  //打开搜索框
  openSearch() {
    this.showInput = !this.showInput
  }


  //一键排序
  async oneClickSort() {
    const response = await IdentityApi.oneClickSort();
    if (response) {
      this.$message({message: '已排序', type: 'success'});
      this.flushNode(null, 'root');
    } else {
      this.$message({message: '排序失败!', type: 'error'});
    }
  }
}
</script>

<style lang="scss">
.department-user-page-left {
  .custom-tree-node {
    width: 100%;
  }
}
</style>

