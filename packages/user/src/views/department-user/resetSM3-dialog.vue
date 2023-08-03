<template>
  <el-dialog :visible.sync="visible" title="输入动态验证码" :close-on-click-modal="false">
        <el-input
              type="text"
              v-model="dyncode"
              placeholder="请输入动态验证码"
            >
            <el-button
                type="success"
                slot="append"
                @click="doReset"
                >重置</el-button>    
        </el-input>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {IdentityApi} from '@/api/identity/identity-api';

@Component({
  name: "resetSM3-dialog",
})
export default class ResetSM3Dialog extends Vue{
  visible = false;
  dyncode = '';
  init() {
    this.dyncode = '';
    this.visible = true;
  }
  
  async doReset() {
    let a = {
        "code":this.dyncode
    };
    const res = await IdentityApi.resetSM3pwd(a);
    this.$message({
        type: 'success',
        message: '重置成功' + res + '条记录!'
      });
  }

}
</script>
