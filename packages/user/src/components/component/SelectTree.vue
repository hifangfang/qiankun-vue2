<template>
  <div class="selectTree">
    <el-select size="small" v-model="selectValue" :placeholder="placeholderName" ref="select" :clearable="clearable" @clear="handleClear">
        <el-option :value="selectValue" :label="label" style="height: auto" >
            <el-tree
                :data="treeData"
                :load="loadNode"
                :lazy="lazy"
                class="tree-select"
                ref="tree"
                highlight-current
                :expand-on-click-node="true"
                @node-click="handleNodeClick"
                >
                <span class="custom-tree-node" slot-scope="{ node, data }" :title="data.name">
                    <span>
                        <i :class="data.icon"></i>
                        {{ data.name }}
                    </span>
                </span>
            </el-tree>
        </el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Watch} from "vue-property-decorator";

  @Component({
    name: "selectTree"
  })
  export default class selectTree extends Vue {
    @Prop() label: any;// 选项的值
    @Prop() value: any;// 选项的标签
    @Prop() lazy: any;// 是否懒加载子节点
    @Prop() placeholderName:any;//
    @Prop() treeData: any;// 展示数据
    @Prop({type:Boolean,default:false}) clearable!: boolean;// 是否可以清楚数据
    selectValue=""
    @Watch('value')
    change(){
      this.selectValue=this.value
    }

    loadNode(node, resolve) {
        this.$emit('loadNode', node, resolve);
    }

    handleClear(){
      this.$emit('handleClear');
    }

    handleNodeClick(node) {
        this.$emit('handleNodeClick', node);
    }

    onblur() {
        (this.$refs.select as any).blur();
    }
  }
</script>

<style lang="scss">
//   .selectTree {

//   }
</style>
