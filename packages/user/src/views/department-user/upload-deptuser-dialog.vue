<template>
  <el-dialog :visible.sync="visible" title="上传文件" :close-on-click-modal="false">
    <el-upload
      class="upload-dialog"
      ref="upload"
      action
      multiple
      :auto-upload="false"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :http-request="uploadFiles"
      :limit="1"
      :file-list="fileList"
      accept=".xlsx"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
      <el-button style="margin-left: 10px;" size="small" type="info" @click="importTemplate">导入模板</el-button>
      <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过10M</div>
    </el-upload>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
@Component({
  name: "upload-deptuser-dialog",
})
export default class UploadDeptuserDialog extends Vue{
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
      this.$message.error('上传文件只能是xlsx 格式!');
      return false
    }
    if (!limit) {
      this.$message.error('上传大小不能超过 10MB!');
      return false
    }
  }
  submitUpload() {
    (this.$refs.upload as any).submit();
  }

  importTemplate(){
    this.fileDownload("/部门用户模板.xlsx","导入部门用户模板.xlsx")
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
  uploadFiles (file) {
    let formData = new FormData()
    formData.append('file',file.file );
    formData.append('fileName',file.file.name);
    formData.append('categoryId',this.treeNode.id);
    let config = {
      //添加请求头
      'headers': {
        'Content-Type': 'multipart/form-data'
      },
      'onUploadProgress': progressEvent => {
        let percent =
          progressEvent.loaded / progressEvent.total * 100 | 0;
        //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
        file.onProgress({ 'percent': percent });
      }
    };
    this.$axios.post(this.MICRO_CONFIG.identity+"/department-user/importDeptUserExcel", formData, config)
      .then(res => {
        //上传成功 调用onSuccess方法，否则没有完成图标
        file.onSuccess();
        let list = res.data.data;
        if(list.length>0) {
          let html = "导入完成，存在相同的用户：";
          for (let i = 0; i < list.length; i++) {
            let str = "";
            if (i ==list.length - 1) {
              str = list[i].userName;
            } else {
              str = list[i].userName + ",";
            }
            html = html + str;
          }

          this.$alert(html, '提示', {
            confirmButtonText: '确定',
          });
        }else{
          this.$message({message: '上传成功!', type: 'success'});
        }
        this.$emit('flushTree')
      })
      .catch(err => {
        //上传失败 调用onError方法
        file.onError();
      });
  }
  handleSuccess(res, file) {

    (this.$refs.upload as any).clearFiles();
    this.$emit('flushNode',this.treeNode.id);
    this.visible = false;
  }
}
</script>
<style lang="scss">
  .el-message-box__message p {
    word-break: break-all;
  }
</style>
