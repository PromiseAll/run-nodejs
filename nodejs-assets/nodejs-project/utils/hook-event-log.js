const rn_bridge = require('rn-bridge');
// 定义一个处理程序，来代理 console 对象
const consoleProxyHandler = {
  get(target, propName, receiver) {
    if (typeof target[propName] === 'function') {
      // 如果访问的是 console 下的方法，则返回一个新的函数
      return (...args) => {
        // 创建 JSON 消息
        const message = JSON.stringify({
          type: propName,  // 使用访问的方法名作为消息类型
          content: args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')
        });

        // 使用 rn_bridge.channel.send 发送消息
        rn_bridge.channel.send(message);

        // 保持 console 方法的原有功能
        target[propName](...args);
      };
    }

    // 默认行为
    return Reflect.get(...arguments);
  }
};
// 使用 Proxy 代理原始的 console 对象
console = new Proxy(console, consoleProxyHandler);
global.console = console;