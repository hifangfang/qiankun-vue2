import { useDynamicScript, loadComponent } from './asyncLoadModules'

// 远程模块地址，加载js
const remoteUrl = 'http://localhost:2755/remoteEntry.js'
useDynamicScript(remoteUrl) // 远程模块地址
const  Button =  loadComponent('base', './Button.vue@2.6.11')()
console.log(Button, 'Button')
export { Button }
