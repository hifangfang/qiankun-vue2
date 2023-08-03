<template>
  <div  class="login-page">
    <video  class="bg_video" src="../assets/images/loginPage/loginmp4.mp4"  autoplay loop muted></video>
    <ul class="logoaAndTitle">
      <li v-if="flag">
        <img :src="logoUrl" alt="">
        <p>{{platformTitle}}</p>
      </li>
    </ul>
    <div v-if="flag">
      <loginForm></loginForm>
    </div>
  </div>
</template>
<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { WaterMarkService } from '@/utils/js/water-mark.service.ts';
import { BaseApi } from '@/api/base/module/base-api.ts';
import loginForm from "@/components/loginForm.vue";
import bus from "@/utils/js/bus";
@Component({
  components:{
    loginForm
  }
})
export default class LoginComponent extends Vue {
  platformTitle="" as any;
  logoUrl="";
  flag=false
  created() {
    bus.$emit("showLoginForm",{isDialog:false});
    this.clickChange()
    //移除水印
    WaterMarkService.remove()
  }
  //页面加载调用获取cookie值
  mounted() {
    const rememberPassword=localStorage.rememberPassword
    if(rememberPassword=="true"){
      const keys=["rememberPassword","username","password","appObject"]
      for (let key in localStorage){
        if (keys.indexOf(key)==-1) {
          localStorage.removeItem(key);
        }
      }
    }else{
      const keys=["appObject"]
      for (let key in localStorage){
        if (keys.indexOf(key)==-1) {
          localStorage.removeItem(key);
        }
      }
    }
    //背景视频加载后显示
    setTimeout(()=>{
      this.flag=true
      localStorage.removeItem("tokenLost");
      localStorage.removeItem("tokenFail");
      console.log(localStorage)
    },500)
  }
  //更换系统名称及图标
  async clickChange(){
    let propertyKeys=['platformDesignerTitle',"platformDesignerLogo"]
    let params={
      subGuid:'',
      propertyKeys:propertyKeys
    }
    const data:any = await BaseApi.getCodeValuePropertysByKeys(params)
    if(data.length>0){
      //获取变量配置的系统名称
      const titleData=data.filter(item=>item.key=="platformDesignerTitle")
      this.platformTitle=titleData.length>0?titleData[0].value:this.MICRO_CONFIG.title
      //获取变量配置的系统logo
      const logoData=data.filter(item=>item.key=="platformDesignerLogo")
      if(logoData.length>0 && logoData[0].value !== 'image'){
        this.logoUrl = logoData[0].value
      }else{
        this.logoUrl = this.logoUrl
      }
      this.logoUrl=logoData.length>0&&logoData[0].value !== 'image'?logoData[0].value:require("../assets/images/loginPage/ztgx_logo.svg")
      //替换浏览器图标
      this.changeFavicon(this.logoUrl)//刷新登录界面浏览器icon
    }
  }
  //刷新登录界面浏览器icon
  async changeFavicon(value) {
    document.title=this.platformTitle?this.platformTitle:"登录";
    const link =value
    let $favicon:any = document.querySelector('link[rel="icon"]');
    if ($favicon !== null) {
      $favicon.href = link;
    } else {
      let $favicon = document.createElement("link");
      $favicon.rel = "icon";
      $favicon.href = link;
      document.head.appendChild($favicon);
    }
  }
}
</script>
<style lang="scss">
body,html{
  width: 100vw;
  height: 100vh;
}
.login-page{
  display: flex;
  height: 100vh;
  //background-image: url("../assets/images/loginPage/login-bg.gif");
  background-repeat: no-repeat;
  background-size:cover;

  .bg_video{
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    object-fit: fill;
  }
  .logoaAndTitle{
    position: absolute;
    top: 0;
    left: 0;
    li{
      img{
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
      display: flex;
      margin-top: 55px;
      margin-left: 130px;
      font-size:28px;
      font-family: "SourceHanSansSC-Normal";
      font-weight:400;
      color: #FFFFFF;
    }
  }

  .login-box{
    /*border: 1px solid red;*/
    position: absolute;
    top: 46%;
    left: 62%;
    margin-top: -160px;
    padding:30px 50px;
    width: 450px;
    min-height: 280px;
    box-sizing: border-box;
    border: 1px solid #467CF3;
    background: #0E2851;
    //opacity: 0.8;
    border-radius: 10px;
    z-index: 99;
    .login-type-wrap{
      .el-tabs__header{
        .el-tabs__nav{
          margin-left: 75px;
        }
        .el-tabs__item{
          width: 100px;
          height: 70px!important;
          line-height: normal;
          >span{
            width: 100%;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            color: #C0C4CC;
            i{
              display: block;
              font-size: 32px;
            }

          }

        }
        .el-tabs__item.is-active{
          >span{
            color: #467CF3;
          }
        }

      }
    }
    .login-password-wrap{
      >span{
        display: inline-block;
        width: 100%;
        font-size: 22px;
        color: #FFF0F0;
        margin-bottom: 10px;
        text-align: center;
      }
    }
    .el-form{
      .el-form-item{
        height: 50px;
        line-height: 50px;
        margin-bottom: 18px;
        &:nth-child(1),&:nth-child(2){
          border: 1px solid #467CF3;
          .el-form-item__content{
            display: flex;
            line-height: 50px!important;

            i{
              height: 50px;
              line-height: 50px;
              padding:0 8px;
              color: white;
              font-size: 22px;
            }
            .el-input{
              height: 50px;
              line-height: 50px;
              .el-input__inner{
                height: 50px;
                line-height: 50px;
                border: none;
                background-color: transparent;
                color: #FFFFFF;
              }
            }
            .input_set .el-input__inner:-webkit-autofill {
              //input 背景色
              -webkit-box-shadow : 0 0 0px 1000px  #0E2851 inset !important;
              //input字体颜色 颜色根据自己要求替换
              -webkit-text-fill-color: #FFFFFF !important;
            }
            .getCode{
              padding: 8px;
              color: #467CF3;
            }
          }
        }
      }
    }

    .rememberpassword{
      .el-checkbox__label {
        color: #FFFFFF;
      }
      .el-checkbox__input.is-checked .el-checkbox__inner{
        background-color: #557cec;
        border-color: #557cec;
      }
      .el-checkbox__input.is-checked+.el-checkbox__label{
        color: #557cec
      }
      .registerbtn{
        float: right;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        cursor: pointer;
      }
    }
    .loginbtn{
      margin-top: 10px;
      .el-button{
        width:100%;
        height:47px!important;
        line-height: 47px!important;
        background: #467CF3;
        border-radius: 4px;
        color: white;
        font-size: 18px;
        padding: 0;
      }
    }
  }
}
</style>