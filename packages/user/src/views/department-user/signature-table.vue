<template>
  <div  class="signature-wrap" >
    <el-table
      v-show="signatureData!=null&&signatureData.filter(item=>item.operatestate!=1).length>0"
      ref="tableData"
      class="signature-table"
      :data="signatureData.filter(item=>item.operatestate!=1)"
      border
      style="width: 100%;"
    >
      <el-table-column
        prop="sealName"
        label="简称"
        align="center"
        >
        <template slot-scope="scope">
         <span v-if="scope.row.isSet">
           <el-input size="mini" placeholder="请输入内容" v-model="scope.row.sealName" ></el-input>
         </span>
          <span v-else>{{scope.row.sealName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sealSn"
        label="sealSn"
        align="center"
        >
        <template slot-scope="scope">
         <span v-if="scope.row.isSet">
              <el-input size="mini" placeholder="请输入内容" v-model="scope.row.sealSn" ></el-input>
         </span>
          <span v-else>{{scope.row.sealSn}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="chapter"
        label="缩略图"
        align="center"
        class="signatureCell"
      >
        <template slot-scope="scope">
           <span class="sealImg" v-if="scope.row.thumbImgBase64">
             <i @click="setDefaultSeal(scope.row)" :class="scope.row.isDefault?'iconfont zwpt_shoucang':'iconfont zwpt_shoucang nodefault '"></i>
             <el-image
               style="height: 50px;width: 50px"
               :src="'data:image/png;base64,' +scope.row.thumbImgBase64"
               :preview-src-list="scope.row.sealList">
             </el-image>
           </span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        >
        <template slot-scope="scope">
          <div class="btn-scope-box" v-if="scope.row.isSet">
            <el-button  type="text" size="small"  @click="addData(scope.row)">确定</el-button>
            <el-button  type="text" size="small" @click="cancelData(scope.row)">取消</el-button>
          </div>
          <div class="btn-scope-box" v-else>
            <el-button  type="text" size="small"  @click="editDate(scope.row)">编辑</el-button>
            <el-tooltip  placement="top" effect="light">
              <div slot="content">这里是临时删除，如果需要永久删除，<br/>请在删除后再点击底部的 '保存' 按钮。</div>
              <el-button  type="text" size="small"  @click="deleteData(scope.row)">删除</el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script lang="ts">
  import {Component, Vue, Prop, Emit} from "vue-property-decorator";
  import {signnatureApi} from "@/api/identity/module/signature-api"
  import {LocalStorageUtil} from "@/utils/js/localstorage_utils";
  @Component({
    name: "signature-table",
    components: {

    }
  })

  export default class SignatureTable extends Vue{
    signatureData=[] as any;
    sealList=[] as any;
    treeNode={} as any;
    deleteArr=[] as any

    async initData(data,treeNode){
      this.treeNode=treeNode
      if(data!=null&&data.length>0){
        this.signatureData=data
        await this.signatureData.forEach((item,index)=>{
          item.sealList=[]
          this.$set(item,"operatestate", "0"); //(虚拟字段) 增加的字段operatestate（ 1 表示删除）
          item.copySealName=item.sealName
          item.copySealSn=item.sealSn
          item.sealList.push('data:image/png;base64,'+item.thumbImgBase64)
        })
      }else {
        this.signatureData=[]
      }
    }

    showInput(){
      const obj={
        sealSn:"",
        sealName: "",
        isSet: true,
        isDefault: false,
        sealGuid: "",
        thumbImgBase64: '',
        userId: this.treeNode.id,
        operatestate:0,
        index:this.signatureData.length,
        copySealName:'',
        copySealSn:''
      }
      this.signatureData.splice(this.signatureData.length+1,0,obj)
    }

    // 增加或者修改电子签章
    async addData(row) {
      let token = String(LocalStorageUtil.getItem("X-Gisq-Token"));
      // this.signatureData = this.signatureData.filter(item => item.operatestate == 0)
      if (!row.sealName) {
        this.$message.warning("请输入简称")
        return false
      }
      if (!row.sealSn) {
        this.$message.warning("请输入sealSn值")
        return false
      }
      for(let i=0;i<this.signatureData.length;i++){
        if (this.signatureData[i].thumbImgBase64&&this.signatureData[i].copySealSn === row.sealSn&&row.sealSn!=row.copySealSn&&this.signatureData[i].operatestate == 0) {
          this.$message.warning("sealSn值已存在")
          row.sealSn=row.copySealSn
          row.sealName=row.copySealName
          if(row.sealGuid){
            this.$set(row,"isSet",false)
          }
          return false
        }
      }
      let getSealDetail =  signnatureApi.getSealDetail(row.sealSn, token)
      getSealDetail.then(data=>{
        if(data&&data.thumbImgBase64){
          row.thumbImgBase64 = data.thumbImgBase64
          row.copySealSn=row.sealSn
          row.copySealName=row.sealName
          this.$set(row, "isSet", false)
          this.$message.success("添加成功!")
        }
      }).catch(error=>{
        if (row.copySealName||row.copySealSn||row.thumbImgBase64){
          row.sealSn=row.copySealSn
          row.sealName=row.copySealName
          this.$set(row,"isSet",false)
        }else {
          row.sealSn=''
          row.sealName=''
        }
      })
    }

    //取消输入框
    cancelData(row){
        if(row.copySealName||row.copySealSn||row.thumbImgBase64){
          row.sealSn=row.copySealSn
          row.sealName=row.copySealName
          this.$set(row,"isSet",false)
        }else{
          this.signatureData.splice(row.index,1)
        }
    }

    editDate(row){
      if(!row.isSet){
        this.$set(row,"copySealName",row.sealName)
        this.$set(row,"copySealSn",row.sealSn)
        this.$set(row,"isSet",true)
      }
    }

    //设置为默认签名
    setDefaultSeal(row){
      if(row.isDefault){
        this.$message.warning("已设置为默认签章")
      }else {
        //整个列表只有一个默认签名和默认签章
        this.signatureData.forEach((item)=>{
          if(item.isDefault){
            item.isDefault=false
          }
        })
        row.isDefault=true
      }
    }

    deleteData(row){
      //  operatestate（ 1 表示删除） 用来增加一个前端删除，但未保存到数据库端的中间的待删除状态
      if(row.sealGuid){
        this.$set(row,"operatestate",1)
        this.deleteArr.push(row)
      }else{
        this.$set(row,"operatestate",1)
        this.signatureData.splice(row.index,1)
      }
      // if(this.signatureData?.every(item=>item.operatestate==1)){
      //   this.signatureData=[]
      // }
    }
  }
</script>

<style lang="scss">
  .signature-wrap{
    display: flex;
    .el-button{
      height: 32px;
      margin-left: 5px;

    }
  }
  .signature-table{
    border-bottom: 1px solid #EBEEF5 !important;
    .el-table__header-wrapper{
      th,td,.cell{
        width: 100%;
        padding: 5px;
        line-height: 32px;
        box-sizing: border-box;
      }
    }
    .el-table__body-wrapper{
      th,td{
        padding: 12px 15px;
        position: relative;
      }
      .el-table__row{
        .cell{
          display: flex;
          flex-wrap: wrap;
          padding: 0!important;
          .btn-scope-box{
            width: 100%;
          }
          span{
            width: 100%;
          }
        }
      }
      i{
        width: 16px!important;
      }

    }
    i.el-icon-d-arrow-right{
      transform:rotate(90deg);
      position: absolute;
      right: 0;
      top: 20px;
    }
    i.upIcon{
      transform:rotate(-90deg);
      position: absolute;
      right: 0;
      top: 20px;
    }
    .sealImg{
      position: relative;
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 5px;
      line-height: 50px;
      i{
        position: absolute;
        top: 0;
        left: 0;
      }
      i.zwpt_shoucang{
        color: red;
      }
      i.nodefault{
        color: gray!important;
      }
      .el-image{
        width: 50px;
        height: 60px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .el-image__error{
        font-size: 12px;
      }

    }
    i.el-icon-bottom{
      margin-top: 3px;
    }
  }
</style>
