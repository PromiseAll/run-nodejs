
require('./utils/hook-event-log')
const rn_bridge = require('rn-bridge');
const { run, clearModuleCache } = require('./utils/load-module');
console.log("node初始化完成");

rn_bridge.channel.on('message', (msg) => {
  const { type, modulePath, callFnName } = JSON.parse(msg);
  switch (type) {
    case 'run':
      console.log("收到消息", { modulePath, callFnName });
      run(modulePath, callFnName)
      break;
    case 'clearModuleCache':
      clearModuleCache()
      break;
    default:
      break;
  }

});

// 捕获全局错误
process.on('uncaughtException', (err) => {
  console.error(err.message);
});