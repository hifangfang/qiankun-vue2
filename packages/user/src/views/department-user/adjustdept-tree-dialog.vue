<template>
  <div class="adjustdept-tree-dialog">
    <el-dialog :title="adjustDeptTreeTitle"
               :visible.sync="displayAdjustDeptTreeDialog"
               :close-on-click-modal="false"
               @close="closeAdjustDeptTreeDialog" top="14vh"
               class="hasTree_dialog"
    >
      <div class="filter-tree">
        <el-tree
          ref="tree"
          :props="defaultProps"
          node-key="id"
          :check-strictly="true"
          :load="loadNode"
          show-checkbox
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
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
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {IdentityApi} from '@/api/identity/identity-api';

  @Component({
    name: "adjustdept-tree-dialog",
  })
  export default class AdjustDeptTreeDialog extends Vue {
    @Prop() treeNode: any;// 接收父组件传过来的数据
    defaultProps = {
      label: 'name',
      children: 'children',
      isLeaf: 'leaf',
      id: 'id',
      disabled: 'disabled'
    };
    adjustDeptTreeTitle = '调整操作';
    displayAdjustDeptTreeDialog = false;
    rootNode;// 根节点
    editchecked;

    async initTree(id, status) {
      const filterId = this.treeNode.id;
      const response = await IdentityApi.getIdentityTreeNotIncludeMyselfAndChild(id, filterId, status);
      let tree = [] as any[];
      response.forEach(item => {
        let icon;
        if (item.type == "root") {
          icon = "#zwpt_nav-yhgl";
        } else if (item.type == "dept") {
          icon = "#zwpt_nav-yhgl-L1";
        }

        let o = {
          id: item.id, name: item.name, icon: icon,
          pid: item.pid, type: item.type, leaf: !item.isParent,status:item.status
        } as any;
        tree.push(o);
      });
      return tree;
    }

    async loadNode(node, resolve) {
      let id, status;
      if (node.level === 0) {
        id = null;
        status = null;
        this.rootNode = node;
      } else {
        id = node.data.id;
        status = node.data.status;
      }
      const response = await this.initTree(id, status);
      resolve(response);
    }

    handleNodeClick(data) {
      this.editchecked = data.id;
      (this.$refs.tree as any).setCheckedKeys([data.id]);
    }

    handleCheckChange(data, checked, child) {
      if (checked == true) {
        this.editchecked = data.id;
        (this.$refs.tree as any).setCheckedKeys([data.id]);
      } else {
        if (this.editchecked == data.id) {
          (this.$refs.tree as any).setCheckedKeys([data.id]);
        }
      }
    }

    closeAdjustDeptTreeDialog() {
      this.displayAdjustDeptTreeDialog = false;
      //关闭时刷新树
      this.rootNode.loaded = false;
      this.rootNode.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节
    }

    show() {
      this.displayAdjustDeptTreeDialog = true;
    }

    /**
     * 确定或取消 根据参数判断
     */
    cancleOrOk(data) {
      if (data == 'ok') {
        this.saveTree();
      } else if (data == 'cancel') {
        this.closeAdjustDeptTreeDialog();
      }
    }

    saveTree() {
      const nodes = (this.$refs.tree as any).getCheckedNodes();
      if (nodes.length != 0) {
        this.$emit("saveAdjustDeptData", nodes);
        this.closeAdjustDeptTreeDialog()
      } else {
        this.$message({message: '请选择需要调整到的部门', type: 'warning'});
      }
      console.log(nodes);
    }

  }
</script>

