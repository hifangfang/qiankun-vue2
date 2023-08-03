<template>
  <div class="department-tree">
    <el-dialog :visible.sync="visible" :title="title" :close-on-click-modal="false">
      <el-tree
        show-checkbox
        :props="props"
        class="filter-tree"
        node-key="id"
        ref="tree"
        lazy
        :load="loadNode"
        highlight-current
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
           <i :class="data.icon"></i>{{ data.name }}
       </span>
      </el-tree>
      <div>
        <el-button type="primary" @click="sure">确定</el-button>
        <el-button type="primary" @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import {IdentityApi} from '@/api/identity/identity-api';

  @Component({
    name: "department-tree",

  })
  export default class DepartmentTree extends Vue {
    @Prop({}) title !: any;
    deptId = "";
    visible = false;
    props = {
      label: 'name',
      children: 'zones',
      isLeaf: 'leaf',
      id: 'id'
    };

    show() {
      this.visible = true;
    }

    async initTree(deptId,filterId) {
      this.deptId = filterId;
      const response = await IdentityApi.getIdentityTreeNotIncludeMyselfAndChild(deptId,filterId,"ture");
      let tree = [] as any[];
      response.forEach(item => {
        let icon;
        if (item.type == "root") {
          icon = "iconfont zwpt_nav-yhgl";
        } else if (item.type == "dept") {
          icon = "iconfont zwpt_nav-yhgl-L1";
        }
        let o = {
          id: item.id, name: item.name, icon: icon,
          pid: item.pid, type: item.type, leaf: item.status
        } as any;
        tree.push(o);
      });
      return tree;
    }

    async loadNode(node, resolve) {
      if (node.level === 0) {
        const response = await this.initTree('null',this.deptId);
        return resolve(response);
      }
      const response = await this.initTree(node.data.id,this.deptId);
      setTimeout(() => {
        resolve(response);
      }, 500);
    }

    sure() {
      let Nodes = [] as any[];
      let Keys = (this.$refs.tree as any).getCheckedKeys();
      for (let i = 0; i < Keys.length; i++) {
        let Node = (this.$refs.tree as any).getNode(Keys[i]);
        Nodes.push(Node);
      }
      this.$emit("saveUserData", Nodes);
      this.close();
    }

    close() {
      this.visible = false;
    }
  }
</script>

<style lang="scss">
  .department-tree {
    .el-tree {
      height: 300px;
      position: relative;
      cursor: default;
      background: #FFF;
      color: #606266 !important;
    }
  }
</style>
