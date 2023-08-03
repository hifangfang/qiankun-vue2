<template>
  <div class="user-authoritycount-page" id="appWorkcenter2">
<!--    <iframe width="100%" height="100%" src="/workcenter/taskList?missionType=opened" frameborder="0"></iframe>-->
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from 'vue-property-decorator';
  import { loadMicroApp } from 'qiankun';
  @Component({
    name: "user-authoritycount-page"
  })
  export default class UserAuthorityCountPage extends Vue {
    mounted(){
       loadMicroApp({
         name: 'subapp-workcenter',
         entry: '//localhost:2750/workcenter/createWork',
         container: '#appWorkcenter2',
       });

    }
  }
</script>

<style scoped>
.user-authoritycount-page{
  width: 100%;
  height: 100%;
}
</style>
