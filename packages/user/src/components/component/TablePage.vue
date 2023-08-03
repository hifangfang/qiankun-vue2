<template>
  <div class="table-page">
    <div class="topBtn" :class="undefined == this.tableButtonList?'top0Height':''">
      <el-button size="small" v-for="(item,index) in tableButtonList" :key="index"
                 :type="item.primary" :disabled="item.disabled" @click="item.click(getSelection(item))">{{item.name}}
      </el-button>
    </div>
    <div class="main">
      <el-table
        ref="multipleTable"
        :data="tableData"
        class="zt_table"
        highlight-current-row
        :height="tableHeight"
        :header-cell-style="{background:'rgba(245,247,250,1)'}"
        @row-click="handleRowClick"
      >
        <el-table-column
          v-for="item in this.tableColumnList"
          :type="item.type"
          :formatter="dateFormatter"
          :label="item.label"
          :key="item.label"
          :fixed="item.fixed"
          :prop="item.prop"
          :width="item.width"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="操作" v-if="this.tableOperateList" min-width="120px">
          <template slot-scope="scope">
            <template v-for="(item,index) in tableOperateList">
              <template v-if="baseForms&&!scope.row.formUrl">
                <el-button v-if="item.name!='设计'&&item.name!='权限'"   size="mini" :key="index" plain :type="item.name == '删除'?'danger':'info'" :icon="item.icon" :title="item.name" @click="item.click(scope.row)" ></el-button>
              </template>
              <template v-else>
                <el-button    size="mini" :key="index" plain :type="item.name == '删除'?'danger':'info'" :icon="item.icon" :title="item.name" @click="item.click(scope.row)" ></el-button>
              </template>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <pagination ref="pagination" v-if="this.paginationFlag" class="page" :total="total" @pageChange="pageChange"
                  @tableRefresh="tableRefresh"/>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Watch} from "vue-property-decorator";
  import Pagination from './Pagination.vue';
  import Formatter from '@/utils/js/formatter.js';
  import {PageData} from '../../api/base/model/Fungroup-item-model';
  import {property} from '../../utils/js/underscore';

  @Component({
    name: "table-page",
    components: {
      Pagination
    }
  })
  export default class TablePage extends Vue {
    @Prop() tableColumnList: any;// 表格列
    @Prop() tableButtonList: any;// 头部按钮组
    @Prop() tableOperateList: any;// 操作按钮
    @Prop() primaryColumnName?: any;// 列表中主键id
    @Prop() pageDisplay: any;
    @Prop() dataTableHeight: any;
    @Prop() getSelectionObject:any;
    @Prop() baseForms:any  //是否是应用资源里基础表单
    @Watch('dataTableHeight')
    change(){
      if(this.dataTableHeight!=undefined){
        this.tableHeight = this.dataTableHeight;
      }
    }

    paginationFlag = this.pageDisplay ? this.pageDisplay : true;

    tableHeight = window.innerHeight - 220;// 高度
    tableData = [] as any[];// 表格数据
    total = 0;// 总纪录数
    page = {// 分页信息
      'pagesize': 10,
      'pagenum': 1
    } as any;

    //页码改变
    async pageChange(item) {
      this.page.pagenum = item.pageNum;
      this.page.pagesize = item.pageSize;
      //改变页码，重新渲染页面
      await this.tableRefresh();
    }

    initData(data) {
      if (this.paginationFlag) {
        this.total = data.total;
        this.tableData = data.data;
      } else {
        this.tableData = data;
      }
    }

    async tableRefresh() {
      await this.$emit('getTableData');
    }

    handleRowClick(row, column, event){
        this.$emit("rowClick",row,column,event)
    }
    handleCurrentChange(item){
      (this.$refs.pagination as any).handleCurrentChange(item.pageNum);
    }
    getSelection(item) {
      if(item.name!='批量添加' && item.name!='添加当前人员'&& item.name!='复制用户权限'){
      if(this.getSelectionObject == true){
        if (item.name != '添加' && (undefined == item.type)) {
          let checkedData = (this.$refs.multipleTable as any).selection;
          if (checkedData.length < 1) {
            this.$message({message: '请选择需要' + item.name + '的数据!', type: 'warning'});
            return;
          }
          return checkedData;
        }
        return null;
      }else{
        if (item.name != '添加' && (undefined == item.type)) {
          let checkedData = (this.$refs.multipleTable as any).selection;
          let ids = [] as any[];
          if (checkedData.length < 1) {
            this.$message({message: '请选择需要' + item.name + '的数据!', type: 'warning'});
            return;
          }
          if (!this.primaryColumnName) {
            this.primaryColumnName = 'id';
          }
          for (let i = 0; i < checkedData.length; i++) {
            let obj = checkedData[i];
            ids.push(obj[this.primaryColumnName]);
          }
          return ids;
        }
        return null;
      } }
    }

    dateFormatter(row, column, cellValue, index){
      if(column.type == "datetime"){
        return  Formatter.DateTimeFormatter(null,null,cellValue);
      }else if(column.type == "longtime") {
        return  Formatter.LongTimeFormatter(null,null,cellValue);
      }else if(column.type == "date") {
        return  Formatter.DateFormatter(null,null,cellValue);
      }else if(column.type == "time") {
        return  Formatter.TimeFormatter(null,null,cellValue);
      }else if(column.type == "receiveType") {//业务定制窗口资料收取类型
        if (cellValue == "MustSelected") {
          return "必须选择";
        } else if (cellValue == "Selected") {
          return "默认选中";
        } else if (cellValue == "NotSelected") {
          return "不选中";
        }
      }else{
        return cellValue;
      }

    }
    created() {
      if (undefined == this.pageDisplay) {
        this.paginationFlag = true;
      } else {
        this.paginationFlag = this.pageDisplay;
      }
      if (undefined != this.dataTableHeight) {
        this.tableHeight = this.dataTableHeight;
      }
      if (!this.paginationFlag) {
        this.tableHeight = this.tableHeight + 47;
      }
      if(undefined == this.tableButtonList){
        this.tableHeight = this.tableHeight + 52;
      }
    }
  }
</script>

<style lang="scss">
  .table-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .topBtn {
      text-align: left;
      margin-bottom: 13px;
    }
    .top0Height {
      display: none;
    }
  }
</style>

