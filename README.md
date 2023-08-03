## 介绍

基于 qiankun+vue2.0 技术栈实现的前端微应用架构，实现了动态路由（所有路由均使用 history 模式）、主子应用以及子子应用之间的通信，并做了简单的自动化脚本命令，可用一行命令所有子应用的依赖安装、启动以及打包部署。

开源该 demo 的目的，只是想为大家在使用 qiankun 时提供一种思路。

## 项目运行

1. 项目克隆

   ```bash
   git clone https://github.com/hifangfang/qiankun-vue2.git
   ```

2. 依赖安装

   依赖安装采用pnpm，具体使用文档请查阅[pnpm官网](https://www.pnpm.cn)

   ```bash
   cd qiankun-vue2.0
   pnpm install
   ```

3. 项目启动

   ```bash
   cd qiankun-vue2.0
   pnpm run start
   ```

4. 升级依赖 qiankun-vue2-common

   ```bash
   cd qiankun-vue2.0
   pnpm run update
   ```

## 编译部署

关于 qiankun 项目打包编译请查看文档：[入门教程 (umijs.org)](https://qiankun.umijs.org/zh/cookbook#场景-1：主应用和微应用部署到同一个服务器（同一个-ip-和端口）) demo 将主应用和微应用部署到同一个服务器（同一个 IP 和端口），其他部署方式请自行查看官网文档。

打包编译

```bash
cd qiankun-vue2.0
pnpm run build
```

本地部署测试（请使用nginx进行部署测试）

