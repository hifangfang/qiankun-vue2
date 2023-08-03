<template>
  <div class="pagenation zs-pagenation">
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="pageSizes"
        :page-size="page.pageSize"
        layout="total,sizes, prev, pager, next,jumper, slot"
        :total="total">
    </el-pagination>
    <el-button class="zs-btn marL8" size="mini" type="primary" plain @click="refresh">刷新</el-button>
  </div>
</template>

<script>
export default {
  name: "FtPagination",
  props: {
    total: {
      type: Number
    }, // 总条数
  },
  data() {
    return {
      pageSizes: [10, 20, 50, 100],
      page: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    // // 每页查看条数变化
    handleSizeChange(val) {
      this.page.pageSize= val;
      this.$emit('pageChange', this.page);
    },
    // 当前页码变化
    handleCurrentChange(val) {
      this.page.pageNum= val;
      this.$emit('pageChange', this.page);
    },
    //刷新
    refresh() {
      this.$emit('tableRefresh');
    }
  },

}
</script>

<style lang="scss">
//.pagenation{
//  height:32px;
//  line-height: 32px;
//  text-align: right;
//  margin-right: 20px;
//  .el-pagination{
//    font-size: 14px;
//    font-family: "SourceHanSansSC-Normal";
//    font-weight: 400;
//    color: #000000;
//    margin-top: 15px;
//    .el-pagination__total{
//      display: inline-block!important;
//      height: 32px!important;
//      line-height: 32px!important;
//    }
//    .btn-prev,.btn-next{
//      width: 32px;
//      height: 32px;
//      line-height: 32px;
//      background: #FFFFFF;
//      border-radius: 2px;
//      border: 1px solid rgba(0, 0, 0, 0.15);
//      text-align: center;
//      padding: 0px;
//      margin-left: 8px;
//    }
//    .el-pager{
//      .number{
//        width: 32px;
//        height: 32px;
//        line-height: 32px;
//        background: #FFFFFF;
//        border-radius: 2px;
//        border: 1px solid rgba(0, 0, 0, 0.15);
//        margin-left:8px ;
//      }
//      li.active{
//        color: #1564FF;
//        border: 1px solid #1564FF;
//      }
//    }
//    .el-pagination__sizes{
//      .el-input__inner{
//        width: 88px;
//        height: 32px!important;
//        background: #FFFFFF;
//        border-radius: 2px;
//        border: 1px solid rgba(0, 0, 0, 0.15);
//        margin-top: 1px!important;
//        font-size: 14px;
//        font-family: "SourceHanSansSC-Normal";
//        font-weight: 400;
//        color: #000000;
//      }
//    }
//    .el-pagination__jump{
//      height: 32px!important;
//      line-height: 32px;
//      margin-left: 0px;
//      .el-input__inner{
//        height: 32px!important;
//        line-height: 32px;
//        background: #FFFFFF;
//        border-radius: 2px;
//        border: 1px solid rgba(0, 0, 0, 0.15);
//      }
//    }
//    .el-button{
//      height: 32px!important;
//      line-height: 32px;
//    }
//  }
//
//}
.pagenation.zs-pagenation{
  height:32px;
  margin-top: 15px;
  padding: 0;
  .marL8 {
    margin-left: 8px;
  }
}
</style>
