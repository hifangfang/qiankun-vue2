// export const MICRO_CONFIG = getConf();
export const MICRO_CONFIG = {
  platform: "/platform/",
  activiti: "/activiti/",
  bizmodel: "/bizmodel/",
  identity: "/identity/",
  identity2: "/identity2/",
  base: "/base/",
  external: "/external",
  gisqBI: "/gisqBI/api/",
  gisqForm: "/gisqForm/api/",
  auth: "/auth/",
  share: "/share/",
  rule: "/rule/",
  eureka: "/eureka/",
  subIds: ["aa4ab92a-6f4d-11ea-a207-52e55c6d7a2c"],
  message: "/message",
  code: "/code/",
  title: "臻善应用快速构建平台",
  // bi定制/自定义页面预览设计的地址
  gisqBIEditor: "/gisqBI/", // 镜像配置
  //图片,文档等资源路径
  documentPath: "/resource/",
  //应用编辑里规则引擎和共享的地址
  ruleOrShareEditor: "/ruleOrShareEditor/", // 镜像配置
  webSocketPath: "ws://192.168.100.4:19004/", // 镜像配置
  expInfoWebSocket: "ws://192.168.100.4:19001/websocket/", // 镜像配置
  expDownloadPath: "/expDownload/",
  gisqFormWeb: "/gisqForm/",
  //下面这个配置主要是因为有的项目会加多层代理，导致访问404，一般部署这里的值为空就行
  routePath: "",
  innerCode: false, // 后台配置
  diviceId: "465165",
  mainPage: "/startPage", // 后台配置
  isNew: true,
  //配置移动端地址
  webAppLink: "/gisqMMP/",
  //是否使用表单
  useForm: true, // 后台配置
  //流程设计器里是否关联档案袋和表单
  showFilebagOrForm: true, // 后台配置
  timestampToken: false, // 后台配置
  //默认主题 深色(dark)或者浅色(light)
  defaultTheme: "light", // 后台配置
  //帮助中心地址
  helpCenterUrl: "/resource/docs/",
  //Zipkin 详细信息 地址
  enableSync: false, // 后台配置
  zipKinRequestUrl: "/zipkin/api/v2/trace/",
  zzdAppCode: "",
  isLocalStorageSubGuidFilter: true, // 后台配置
  //配置GIS地址
  GISPlatform: "/gisqGIS/",
  //配置GIS接口地址
  GISPlatformApi: "/gisqGIS/api",
  //配置GIS地址
  gisEnable: true,
};
export default MICRO_CONFIG;
