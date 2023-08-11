/**
 * 打包时将各个应用打包的文件拷贝到一个文件夹中
 */

const fs = require('fs-extra');
const path = require('path');

const outputDir = 'qiankun';// 打包后得文件名
// 拷贝文件
fs.copySync(path.join(process.cwd(), './packages/dist'), path.join(process.cwd(), outputDir, 'module'));
fs.copySync(path.join(process.cwd(), './main/dist'), path.join(process.cwd(), outputDir, 'main'));
// 删除文件
fs.removeSync('./main/dist');
fs.removeSync('./packages/dist');