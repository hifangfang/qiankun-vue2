<template>
  <div class="department-usertree-dialog">
    <el-dialog :title="userTreeTitle"
               :visible.sync="displayUserTreeDialog"
               :close-on-click-modal="false"
               @close="closeUserTreeDialog" top="14vh"
               class="hasTree_dialog"
    >
      <div class="filter-tree">
        <el-tree
          ref="tree"
          :props="defaultProps"
          node-key="id"
          :load="loadNode"
          show-checkbox
          @node-click="handleNodeClick"
          lazy>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <svg class="icon myIconStyle" aria-hidden="true" style="color: red">
            <use :xlink:href="data.icon"></use>
          </svg>
          {{ data.name }}
        </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small"   @click="cancleOrOk('cancel')">取消</el-button>
        <el-button type="primary" size="small" @click="cancleOrOk('ok')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {IdentityApi} from '@/api/identity/identity-api';
  import {LocalStorageUtil} from '@/utils/js/localstorage_utils';
  @Component({
    name: "user-tree-dialog",
  })
  export default class UserTreeDialogLeft extends Vue {

    deptId;//所属机构的id

    defaultProps = {
      label: 'name',
      children: 'children',
      isLeaf: 'leaf',
      id: 'id'
    };
    userTreeTitle = '人员选择';
    displayUserTreeDialog = false;
    rootNode;// 根节点
    async initTree(id) {
      const userName = LocalStorageUtil.getItem('username') as string;
      const response = await IdentityApi.syncDepartmentsUserTree(id, userName, "true");
      let tree = [] as any[];
      let disabled = false
      response.forEach(item => {
        let icon;
        if (item.type == "root") {
          icon = "#zwpt_nav-yhgl";
        } else if (item.type == "dept") {
          icon = "#zwpt_nav-yhgl-L1";
          console.log(this.deptId);
          if(this.deptId == item.id){
            item.treeStatus = true;
            disabled = true;
          }else{
            disabled = false;
          }
        } else if (item.type == "user") {
          icon = "#zwpt_nav-yhgl-L2";
        } else if (item.type == "disableUser") {
          icon = "#zwpt_nav-yhgl-L2-disable";
        }

        let o = {
          id: item.id, name: item.name, icon: icon,
          pid: item.pid, type: item.type, leaf: item.treeStatus,disabled:disabled
        } as any;
        tree.push(o);
      });
      return tree;
    }

    async loadNode(node, resolve) {
      let id;
      if (node.level === 0) {
        id = null;
        this.rootNode = node;
      } else {
        id = node.data.id;
      }
      this.$nextTick(async () => {
        const response = await this.initTree(id);
        resolve(response);
      });
    }

    handleNodeClick(data) {

    }

    closeUserTreeDialog() {
      this.displayUserTreeDialog = false;
      //关闭时刷新树
      this.rootNode.loaded = false;
      this.rootNode.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节
    }

    show(id) {
      this.deptId = id;
      this.displayUserTreeDialog = true;
    }

    /**
     * 确定或取消 根据参数判断
     */
    cancleOrOk(data) {
      if (data == 'ok') {
        this.saveTree();
      } else if (data == 'cancel') {
        this.closeUserTreeDialog();
      }
    }

    saveTree() {
      const nodes = (this.$refs.tree as any).getCheckedNodes();
      if(nodes.length != 0){
        this.$emit("saveUserTreeData",nodes);
        this.closeUserTreeDialog()
      }else{
        this.$message({message: '请选择需要添加的成员', type: 'warning'});
      }
      console.log(nodes);
    }

  }
</script>

<style lang="scss">
  #zwpt_nav-yhgl path,
  #zwpt_nav-yhgl-L1 path,
  #zwpt_nav-yhgl-L2 path {
    fill: var(--primary-color) !important;
  }
</style>

