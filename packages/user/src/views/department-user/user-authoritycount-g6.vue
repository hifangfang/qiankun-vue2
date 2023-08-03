<template>
  <div class="user-authoritycount-page">
    <div id="g6-container" :style="{ height: '500%', width: '100%' }" />
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from 'vue-property-decorator';
  import G6 from '@antv/g6';
  import {IdentityApi} from "@/api/identity/identity-api";
  import uuid from "@/utils/js/common";
  @Component({
    name: "user-authoritycount-page"
  })
  export default class UserAuthorityCountPage extends Vue {
    @Prop() treeNode: any;// 接收父组件传过来的数据
    graph:any;
    treedata={} as any;
    async mounted() {
      await this.getTreedata()
      this.$nextTick(()=>{
        // if(this.treedata?.name){
          this.showChart();
          this.$forceUpdate()
        // }
      })
    }
    async getTreedata(){
      // 点集
      let treeTopNode={
        id:this.treeNode.id,
        name:this.treeNode.name,
        //数据中指定锚点
        anchorPoints: [
          [1, 0.5], // 右侧中间
        ],
      }

      let nodes=[] as any;
      nodes.push(treeTopNode)
      //用户角色列表
      let param = {pagesize: 10000, pagenum: 1};
      let userRoleData = await IdentityApi.getRoleTabMessage(this.treeNode.id, param);
      let userRoleDataArr=userRoleData.data?.map(item=>{return{id:item.roleId,name:item.roleName,  anchorPoints: [
          [0, 0.5], // 左侧中间
          [1, 0.5], // 右侧中间
        ],}})
      nodes=nodes.concat(userRoleDataArr)
      console.log(userRoleData,nodes)
      //查看权限计算结果
      let authorityId=uuid.newGuid()
      console.log(userRoleDataArr.length*(25),"xxxx")
      let authorityObj={
        id:authorityId,
        name:"查看权限计算结果",
        anchorPoints: [
          [0, 0.5], // 左侧中间
          [1, 0.5], // 右侧中间
        ],

      }
      nodes.push(authorityObj)
      //  菜单权限 自定义权限
        let authorityArr=[{
           name:"菜单权限",
           id:uuid.newGuid(),
           anchorPoints: [
              [0, 0.5], // 左侧中间
              [1, 0.5], // 右侧中间
            ],
        },
          {
            name:"自定义权限",
            id:uuid.newGuid(),
            anchorPoints: [
              [0, 0.5], // 左侧中间
              [1, 0.5], // 右侧中间
            ],
          },
        ]
      nodes=nodes.concat(authorityArr);
      console.log(nodes,"唉呀妈呀")
      // 边集
      let edges=[] as any;
      userRoleDataArr.forEach(item=>{
        let obj={
          source:this.treeNode.id,
          target:item.id,
        }
        let obj1={
          source:item.id,
          target:authorityId,
        }
        edges.push(obj,obj1);
      })
      authorityArr.forEach(item=>{
        let obj={
          source:authorityId,
          target:item.id,
        }
        console.log()
        edges.push(obj);
      })
      this.treedata={nodes, edges};
      console.log(this.treedata)
    }
    showChart() {
      const that = this
      G6.registerNode(
        "dom-node",
        {
          drawShape: function drawShape(cfg:any, group:any) {
            const rect = group.addShape("rect", {
              // 节点框样式
              attrs: {
                fill: "blue",//节点框蓝色背景色
                // stroke: "red",
                x: 0,
                y: 0,
                width: 150,
                height: 50,
                radius: [12],
              },
              name: "rect-shape",
            });
            const content = cfg.name;
            group.addShape("text", {
              // 节点文字样式
              attrs: {
                text: content,
                x: 10,
                y: 25,
                fontSize: 14,
                textAlign: 'left',
                textBaseline: 'middle',
                fill: "white",//节点框内白色文字
              },
              // name: "ellipse-shape",
            });
            return rect;
          },
          update: (cfg, item) => {
            const group = item.getContainer();
            const icon = group.find((e) => e.get("name") === "collapse-icon");
            icon.attr(
              "symbol",
              cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse
            );
          },
        },
        "single-node"
      );
      let element;
      // if(window.__POWERED_BY_QIANKUN__){
      //   let shadow=document.querySelectorAll("[data-name='subapp-user']")[0].shadowRoot;
      //   if(shadow){
      //     element=shadow.querySelectorAll('#subapp-user')[0];
      //   }
        console.log(document)
      const container:any = document.getElementById('g6-container');
      console.log(container,"hahahahhceshi1")
      const width = container.scrollWidth;
      const height = container.scrollHeight;
      console.log(width,height)
      const graph = new G6.Graph({
        container: 'container',
        width,
        height,
        fitViewPadding: [ 20, 40, 50, 20 ], // 画布边距
        linkCenter:false,
        modes: {
          default: [ 'drag-canvas', 'drag-node'],
        },
        layout: {
          preventOverlap: true,
          type: 'dagre',
          rankdir: 'LR', //布局的方向
          // align: 'DL',  //节点对齐方式
          nodesepFunc: (d) => {
            return 1
          },  //这个就是节点与节点之间的距离，可以说是纵向拉伸高度
          ranksepFunc: () => 70,//这个参数设置的是你的箭头距离节点的距离，值越大，图横向拉伸的越宽
        },
        defaultNode: {
          type: 'dom-node',
          style: {
            lineWidth: 2,
            stroke: '#5B8FF9',
            fill: '#C6E5FF',
          },
        },
        defaultEdge: {
          type:"quadratic",
          size: 1,
          color: '#aaaaaa',
          style: {
            //结束箭头
            endArrow:true
          },
        },
      });
      console.log(this.treedata,"xxxhahahce测试")
      graph.data(this.treedata);
      graph.render();

      if (typeof window !== 'undefined')
        window.onresize = () => {
          if (!graph || graph.get('destroyed')) return;
          if (!container || !container.scrollWidth || !container.scrollHeight) return;
          graph.changeSize(container.scrollWidth, container.scrollHeight);
        };
    }

  }
</script>

<style scoped>
.user-authoritycount-page{
  height: 100%;
}
</style>
