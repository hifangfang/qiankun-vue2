import { AxiosInstance } from 'axios';
import {Store} from "vuex";
// @ts-ignore
import {MICRO_CONFIG,MICRO_DESC} from './api/platform-config';
// @ts-ignore
import VueRouter, {Route} from 'vue-router';

declare module 'vue/types/vue' {

  interface Vue {
    $axios: AxiosInstance;
    MICRO_CONFIG: MICRO_CONFIG;
    MICRO_DESC:any;

    beforeCreate?(this: Vue): void;
    created?(): void;
    beforeDestroy?(): void;
    destroyed?(): void;
    beforeMount?(): void;
    mounted?(): void;
    beforeUpdate?(): void;
    updated?(): void;
    activated?(): void;
    deactivated?(): void;
    errorCaptured?(err: Error, vm: Vue, info: string): boolean | void;
    serverPrefetch?(this: Vue): Promise<void>;
    $router: VueRouter; // 这表示this下有这个东西
    $route: Route;
    $store: Store<any>;
    // 以下是在main.ts中挂载到Vue.prototype上的变量
    ColumnFormatter:any;
    ColumnCommon:any;
    timestampToTime:any;
    timestampToDate:any;
    urlPathUtils:any;
    getUrlParam:any;
    getQueryString:any;
  }
}
