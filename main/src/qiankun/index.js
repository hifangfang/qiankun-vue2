
import { registerMicroApps, start } from "qiankun";

import { filterApps, microConfig } from "./app-register";

export { qiankunActions } from "./global-state";

// 微应用注册
export const registerApps = () => {
  const _apps = filterApps();
  registerMicroApps(_apps, microConfig);
  start({
    prefetch: "all", // 可选，是否开启预加载，默认为 true。
    sandbox: { strictStyleIsolation: true }, // 可选，是否开启沙箱，默认为 true。// 从而确保微应用的样式不会对全局造成影响。
    singular: true, // 可选，是否为单实例场景，单实例指的是同一时间只会渲染一个微应用。默认为 true。
  });
};
