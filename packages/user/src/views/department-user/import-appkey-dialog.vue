<template>
  <el-dialog   class="importAppkey-dialog" :visible.sync="visible" title="导入电子签名签章" :close-on-click-modal="false">
    <el-button class="downloadButton"  size="small"  @click="downloadTemplate">下载导入模板</el-button>
    <el-upload
      class="importAppkey"
      ref="upload"
      action
      multiple
      :auto-upload="true"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :http-request="uploadFiles"
      :limit="1"
      :file-list="fileList"
      accept=".xlsx"
    >
      <el-button size="small" type="primary">选取文件</el-button>
      <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过10M</div>
    </el-upload>
  </el-dialog>
</template>
<script lang="ts">
  import { Component, Vue, Watch, Prop } from "vue-property-decorator";
  @Component({
    name: "import-appkey-dialog",
  })
  export default class ImportAppkeyDialog extends Vue{
    fileList = [];
    visible = false;
    treeNode = '' as any;
    init(data) {
      this.visible = true;
      this.treeNode = data;
    }
    beforeUpload(file) {
      const ext = file.name.substr(file.name.lastIndexOf(".")+1);
      const isZip = ext === 'xlsx';
      const limit = file.size / 1024 / 1024 < 10;
      if (!isZip) {
        this.$message.error('上传文件只能是xlsx格式!');
      }
      if (!limit) {
        this.$message.error('上传大小不能超过 10MB!');
      }
      return isZip && limit;
    }
    downloadTemplate(){
      this.fileDownload("/importAppkey.xlsx","批量导入签名签章.xlsx")
    }
    uploadFiles (file) {

    }
    handleSuccess(res, file) {

      (this.$refs.upload as any).clearFiles();
      this.$emit('flushNode',this.treeNode.id);
      this.visible = false;
    }
    fileDownload(url,name) {

      var nowA = document.createElement('a');

      nowA.setAttribute('href', url);

      nowA.setAttribute('download', name);

      nowA.style.display = 'none';

      document.body.appendChild(nowA);

      nowA.click();

      document.body.removeChild(nowA);

    }

  }
</script>
<style lang="scss">
  .importAppkey-dialog {
   .el-dialog{
     width: 520px;
   }
    .el-dialog__body{
      display: flex;
      justify-content: center;
     }
    .downloadButton{
     height: 38px;
    }
    .importAppkey{
      text-align: center;

    }
  }
</style>
