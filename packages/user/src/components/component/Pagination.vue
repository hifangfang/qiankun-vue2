<template>

  <div class="pagenation">
    <el-pagination
     @size-change="handleSizeChange"
     @current-change="handleCurrentChange"
     :current-page.sync="page.pageNum"
     :page-sizes="pageSizes"
     :page-size="page.pageSize"
     layout="total, sizes, prev, pager, next, jumper"
    :total="total">
    </el-pagination>
   </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number
    }, // 总条数
    page:{
      type: Object,
      default:()=>{
        return {
          pageNum: 1,
          pageSize: 10
        }
      }
    }
  },
  data() {
    return {
      pageSizes: [10, 20, 50, 100],
    };
  },
  methods: {
    // // 每页查看条数变化
    handleSizeChange(val) {
      this.page.pageSize= val;
      this.page.pageNum= 1;
      this.$emit('pageChange', this.page);
    },
    // 当前页码变化
    handleCurrentChange(val) {
      this.page.pageNum= val;
      this.$emit('pageChange', this.page);
    }
  },

}
</script>

<style lang="scss">
  .pagenation{
    width: 100%;
    text-align: right;
    margin-right: 20px;
    margin-top: 15px;
    .el-pagination{
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
