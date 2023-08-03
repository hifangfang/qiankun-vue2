<template>
  <div class="department-tree-dialog">
    <el-dialog :title="deptTreeTitle"
               :visible.sync="displayDeptTreeDialog"
               :close-on-click-modal="false"
               append-to-body
               @close="closeDeptTreeDialog" top="14vh">
      <div class="filter-dialog-tree">
        <el-tree
          ref="tree"
          :props="defaultProps"
          node-key="id"
          :check-strictly="true"
          :load="loadNode"
          show-checkbox
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
        <el-button size="small"  @click="cancleOrOk('cancel')">取消</el-button>
        <el-button type="primary" size="small" @click="cancleOrOk('ok')">确定</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {IdentityApi} from '@/api/identity/identity-api';
  import {LocalStorageUtil} from "@/utils/js/localstorage_utils";


  @Component({
    name: "dept-tree-dialog",
  })
  export default class DeptTreeDialog extends Vue {

    defaultProps = {
      label: 'name',
      children: 'children',
      isLeaf: 'leaf',
      id: 'id',
      disabled: 'disabled'
    };
    deptTreeTitle = '添加部门';
    displayDeptTreeDialog = false;
    rootNode;// 根节点

    async initTree(id, status) {
      const currentUserName = LocalStorageUtil.getItem('username') as string;
      const response = await IdentityApi.getMultipleDept(id,currentUserName, status);

      let tree = [] as any[];
      let isLeaf = true;
      response.forEach(item => {
        let icon;
        if (item.type == "root") {
          icon = "#zwpt_nav-yhgl";
          isLeaf = false;
        } else if (item.type == "dept") {
          icon = "#zwpt_nav-yhgl-L1";
          isLeaf = false;
        }

        let disabled = item.status == 'false'?true:false;
        let o = {
          id: item.id,
          name: item.name,
          icon: icon,
          type: item.type,
          leaf: isLeaf,
          disabled: disabled,
          status: item.status
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
      this.$nextTick(async () => {
        const response = await this.initTree(id, status);
        resolve(response);
      });
    }



    closeDeptTreeDialog() {
      this.displayDeptTreeDialog = false;

      //关闭时刷新树
      this.rootNode.loaded = false;
      this.rootNode.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节
    }

    show() {
      this.displayDeptTreeDialog = true;
    }

    /**
     * 确定或取消 根据参数判断
     */
    cancleOrOk(data) {
      if (data == 'ok') {
        this.saveTree();
      } else if (data == 'cancel') {
        //(this.$refs.tree as any).setChecked(this.editchecked,false,false);
        this.closeDeptTreeDialog();
      }
    }

    saveTree() {
      const nodes = (this.$refs.tree as any).getCheckedNodes();
      if (nodes.length != 0) {
        this.$emit("saveDeptData", nodes);
        this.closeDeptTreeDialog()
      } else {
        this.$message({message: '请选择需要添加的部门', type: 'warning'});
      }
      console.log(nodes);
    }

  }
</script>

<style lang="scss">


</style>

