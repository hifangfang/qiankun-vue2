<template>
  <div class="select-image">
    <el-dialog :visible.sync="visible" title="选择图片" :before-close="close" top="7vh" :close-on-click-modal="false">
      <el-container>
        <el-aside width="200px" class="filter-tree">
          <el-tree
            ref="tree"
            :load="loadNode"
            lazy
            node-key="id"
            draggable
            :expand-on-click-node="true"
            @node-click="clickTree"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <i :class="data.icon"></i>{{ data.name }}
          </span>
          </el-tree>
        </el-aside>
        <el-main>
          <ul>
            <li v-for="v in contentList" :key="v.id" class="contentList" @click="selectImage(v.img)">
              <template
                v-if="v.resourceType == 'jpg'||v.resourceType == 'png'||v.resourceType == 'gif'||v.resourceType == 'jpeg'||v.resourceType == 'bmp'||v.resourceType == 'png'">
                <img v-bind:src="v.url" alt/>
                <h4 :title="v.realName">{{v.realName}}</h4>
                <p>{{v.time}}</p>
              </template>
            </li>
          </ul>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import {ResourceApi} from "@/api/bizmodel/module/Resource-api";
  import {SubsysApi} from '@/api/base/module/Subsys-api';

  @Component({
    name: "select-image"
  })
  export default class selectImage extends Vue {
    visible = false;
    data = [] as any;
    active = false;
    rootNode;
    contentList: any[] = [];
    @Prop() msg: any;

    async loadNode(node, resolve) {
      let subGuid;
      setTimeout(async () => {
        if (node.level === 0) {
          let tree = [] as any;
          let id = '';
          this.rootNode = node;
          /*
            if (this.$route.path == '/resourcedataSetting') {
                  subGuid = this.$store.state.subGuid;
             }else {
                  subGuid = null;
              }*/
          console.log(this.msg);
          if (this.msg == null) {
            subGuid = null;
            const reponse = await ResourceApi.getAll(subGuid);
            reponse.forEach(item => {
              let o2 = {
                id: null,
                name: item.subName,
                subGuid: item.id,
              };
              tree.push(o2);
            });
          } else {
            const request = {id: id, subGuid: this.msg};
            const reponse = await ResourceApi.resourceTree(request);
            reponse.forEach(item => {
              let o3 = {
                subGuid: item.id,
                name: item.name,
                id: null,
              };
              tree.push(o3);
            });
          }
          resolve(tree);
        }
        if (node.level > 0) {
          let tree = [] as any;
          const request = {id: node.data.id, subGuid: node.data.subGuid};
          const reponse = await ResourceApi.resourceGroupTree(request);
          if (reponse != null) {
            reponse.forEach(item => {
              let o = {
                id: item.id,
                subGuid: item.subGuid,
                name: item.name,
                icon: "iconfont zwpt_nav-zygl-L1",
                isLeaf: false,
                type: "group",
                types: "3"
              };
              tree.push(o);
            });
          }
          resolve(tree);
        }
      }, 500);

    }

    show() {
      this.visible = true;
    }

    close() {
      this.visible = false;
    }

    selectImage(img) {
      this.close();
      this.$emit("changeSelectImage", img);
    }

    async clickTree(data) {
      this.contentList = [];
      const response = await ResourceApi.getItemDetailInfo(data.id, data.subGuid);
      response.forEach(item => {
        item.uploadTime
        let s = item.groupId;
        let s1 = item.virtualName as string;
        //需要配置路径
        item.img = "/" + s + "/" + s1;// 保存到数据库路径
        item.url = this.MICRO_CONFIG.documentPath + "/" + s + "/" + s1;// 显示路径
        this.contentList.push(item);
      });
    }
  }
</script>

<style lang="scss">
  .select-image {
    .el-dialog {
      text-align: left;
      height: 550px;
      width: 50%;
      margin-top: calc((100vh - 550px)*0.5) !important;
      .el-dialog__body{
        height: calc(100% - 80px);
        padding: 10px;
      }
      .el-container{
        height: 100%;
      }
      .el-container .el-aside .el-tree {
        height: 100%!important;
        overflow: auto;
      }

      .el-container .el-main {
        width: 600px;
        height: 450px;

        ul {
          display: flex;
          flex-wrap: wrap;
        }

        ul li {
          padding: 3px;
          list-style: none;
          margin-right: 15px;
          border: 1px solid #eee;
          h4{
            display: block;
            width: 150px ;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--content-textcolor);
          }
        }

        ul li:hover {
          cursor: pointer;

          h4, p {
            color: var(--content-textcolor);
          }
        }

        img {
          width: 150px;
          height: 100px;
        }
      }

      .custom-tree-node i {
        color: var(--apply-iconcolor);
      }
    }

    .el-dialog__body {
      padding: 0px 20px 10px 10px;
    }
  }
</style>
