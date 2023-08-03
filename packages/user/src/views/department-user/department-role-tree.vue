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
        :expand-on-click-node="true">
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
import {RolemgrApi} from "@/api/identity/module/Rolemgr-api";
import {RoleSelectTreeVo} from "@/api/identity/model/Rolemgr-model";
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
    let userId,groupid,type,subGuid;
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
    userId = this.treeNode.id
    this.$nextTick(async() => {
      const reponse = await IdentityApi.catchAssignableRolesForUser(userId,groupid,type,subGuid)
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
<style lang="scss">
.role-tree{
  .el-dialog {
    text-align: left;
    height: 70vh;
    min-width: 500px;
    max-width: 40%;
    width: auto;
    display: flex;
    flex-direction: column;
    .el-dialog__body{
      flex: 1;
      overflow: hidden;
    }
    .filter-tree {
      height: 100%;
      overflow: auto;
    }
    .el-form {
      padding: 0 !important;
    }
    .dialog-footer {
      text-align: right;
    }
    .el-dialog__body {
      padding: 0px 20px 10px 10px;
    }

    .el-tree ,
    .el-tree-node__content ,
    .el-tree-node__content:active ,
    .el-tree-node__content:hover{
      background: transparent;
      color:#606266;
    }
    .el-tree-node:focus>.el-tree-node__content {
      background: transparent;
      color: #606266;
      background-color: #F5F7FA;
    }
    .is-current>.el-tree-node__content{
      background: transparent;
      color: #606266;
    }
    .custom-tree-node {
      width: calc(100% - 48px) !important;
    }
    .el-tree-node__children .custom-tree-node {
      width: 300px;
    }
  }
}
</style>
