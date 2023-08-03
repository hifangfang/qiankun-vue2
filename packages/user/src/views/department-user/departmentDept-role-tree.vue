<template>
    <el-dialog class="role-tree" :visible.sync="visible"  :title="title" :before-close="close" :close-on-click-modal="false">
      <div class="filter-tree">
        <el-tree
          ref="tree"
          show-checkbox
          :props="defaultProps"
          :load="loadNode"
          lazy
          node-key="id"
          draggable
          :expand-on-click-node="true"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <i :class="data.icon"></i>{{ data.name }}
        </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button type="primary" size="small" @click="sure">确定</el-button>
      </div>
    </el-dialog>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import {IdentityApi} from "@/api/identity/identity-api";
  import {getUrlParam} from "@/utils/js/url_path_utils";
  @Component({
    name: "department-role-tree",

  })
  export default class roleTree extends Vue {
    @Prop({}) title !:any;
    subGuid;
    visible = false;
    defaultProps = {
      label: 'name',
      children: 'children',
      isLeaf: 'leaf',
    };
    rootNode;
    treeNode;
    show(data) {
      this.treeNode=data
      this.subGuid = getUrlParam("subGuid");
      this.visible = true;
      this.rootNode.loaded = false;
      this.rootNode.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节
    }
    resolve(data){};
    loadNode(node, resolve) {
      let deptId,groupid,type,subGuid;
      if (node.level === 0) {
        this.rootNode = node;
        this.resolve = resolve;
        groupid = null;
        type = null;
        subGuid= null;
        if (this.subGuid) {
          subGuid = this.subGuid;
        }
      }

      if (node.level > 0){
        groupid = node.data.id;
        type=node.data.type;
        subGuid=node.data.subGuid
      }
      deptId = this.treeNode.id
      console.log(deptId,groupid,type,subGuid)
      this.$nextTick(async() => {
        const reponse = await IdentityApi.catchAssignableDeptForUser(deptId,groupid,type,subGuid)
        resolve(reponse);
      });
    }

    sure(){
      let Nodes = [] as any[];
      let Keys = (this.$refs.tree as any).getCheckedKeys();
      for(let i = 0 ;i< Keys.length; i++){
        let Node = (this.$refs.tree as any).getNode(Keys[i]);
        Nodes.push(Node);
      }
      this.$emit("saveRoleData",Nodes);
    }

    close(){
      this.visible = false;
      this.resolve([]);
    }
  }
</script>
<!--样式同  @/components/component/RoleTree.vue中的样式-->
