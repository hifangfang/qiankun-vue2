function getMenu() {
  return {
    "b031600a-dad0-11ea-8b02-0e2d0f600685":[
      {
        path: "loginSetting",
        title: "登录页设置",
        icon:'iconfont zwpt_loading'
      },
      // {
      //   path: "registerSetting",
      //   title: "注册页设置",
      //   icon:'iconfont zwpt_loading'
      // },
      {
        path: "homeSetting",
        title: "首页设置",
        icon:'iconfont zwpt_home'
      },
      {
        path: "menuSetting",
        title: "菜单项设置",
        icon:'iconfont zwpt_nav-gxzx-apply'
      },
      {
        path: "rolesgroupSetting",
        title: "角色项设置",
        icon:'iconfont zwpt_nav-jsgl'
      },
      {
        path: "keyvalueSetting",
        title: "变量设置",
        icon:'iconfont zwpt_nav-blsz'
      },
      {
        path: "serialnumberSetting",
        title: "编号设置",
        icon:'iconfont zwpt_nav-bhpz'
      },
      {
        path: "resourcedataSetting",
        title: "应用资源",
        icon:'iconfont zwpt_yyzy'
      },{
        path: "",
        title: '流程表单设置',
        icon: 'iconfont zwpt_nav-ywdz',
        children:[]
      },
      {
        path: "fieldSetting",
        title: "扩展字段",
        icon:'iconfont zwpt_kzzd',
      },
      {
        path: "dictionarySetting",
        title: "数据字典",
        icon:'iconfont zwpt_nav-sjzd'
      },
      {
        path: "ruleSetting",
        title: "规则管理",
        icon:'iconfont zwpt_nav-gzyq-rule',
      },
      {
        path: "shareSetting",
        title: "共享中心",
        icon:'iconfont zwpt_gxzx',
      },
      {
        path: "http://gtkj.gisquest.com/geoplat/viewer/userSystem_emb.html",
        title: "组织管理",
        icon:'iconfont zwpt_nav-lcst-L2',
      },
      {
        path: "",
        title: "系统配置",
        icon:'iconfont zwpt_set',
        children:[ {
          path: "http://gtkj.gisquest.com/geoplat/viewer/approvalFlow_emb.html",
          title: "审批流程配置",
          icon:'',
          },
          {
            path: "http://gtkj.gisquest.com/geoplat/viewer/publicDispose_emb.html",
            title: "系统参数配置",
            icon:'',
          },
          {
            path: "http://gtkj.gisquest.com/geoplat/viewer/portalServerDispose_emb.html",
            title: "门户服务配置",
            icon:'',
          },
          {
            path: "http://gtkj.gisquest.com/geoplat/viewer/news_emb.html",
            title: "轮播图片配置",
            icon:'',
          },
        ]
      },
      {
        path: "",
        title: "资源目录",
        icon:'iconfont zwpt_mulu',
        children:[{
          path: "http://gtkj.gisquest.com/geoplat/viewer/resourceCatalog_emb.html",
          title: "目录管理",
          icon:'',
        },{
          path: "http://gtkj.gisquest.com/geoplat/viewer/tagConfig_emb.html",
          title: "目录配置",
          icon:'',
        },]
      },
      {
        path: "",
        title: "监控管理",
        icon:'iconfont zwpt_preview',
        children:[{
          path: "http://gtkj.gisquest.com/geoplat/viewer/controllerPlat_emb.html",
          title: "监控工作台",
          icon:'',
        },{
          path: "http://gtkj.gisquest.com/geoplat/viewer/sourceMonitor_emb.html",
          title: "资源监控",
          icon:'',
        },{
          path: "http://gtkj.gisquest.com/geoplat/viewer/operationLogs_emb.html",
          title: "操作监控",
          icon:'',
        },]
      },
    ]
  };
}
