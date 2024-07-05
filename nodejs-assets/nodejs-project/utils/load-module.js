const requireFromString = require('require-from-string');
const moduleMap = {
};
const currentlyExecuting = new Set();

const run = async (modulePath, callFnName = '') => {
  let runModule = moduleMap[modulePath]
  if (!runModule) {
    runModule = await loadModule(modulePath)
  }
  const executionKey = `${modulePath}-${callFnName}`;
  if (currentlyExecuting.has(executionKey)) {
    console.warn(`当前函数${executionKey}正在执行，请勿重复执行，请等待`);
    return;
  }
  currentlyExecuting.add(executionKey);
  try {
    if (callFnName) return await runModule[callFnName]();
    else return await runModule();
  } catch (err) {
    console.error(err.message);
  } finally {
    currentlyExecuting.delete(executionKey); // 无论成功或失败，清理执行状态
    console.log(`运行结束:${modulePath} - ${callFnName}`);
  }
};


const loadModule = async (modulePath) => {
  if (moduleMap[modulePath]) return moduleMap[modulePath];
  // 判断是否是网址
  if (modulePath.startsWith('http')) {
    moduleMap[modulePath] = await loadRemoteModule(modulePath);
  } else {
    moduleMap[modulePath] = require(modulePath);
  }
  return moduleMap[modulePath];
}

const loadRemoteModule = async (url) => {
  // 使用fetch 和 requireFromString
  const response = await fetch(url);
  const text = await response.text();
  return requireFromString(text, url);
}


const clearModuleCache = () => {
  for (const key in moduleMap) {
    delete require.cache[key];
    delete moduleMap[key];
  }
}
module.exports = { run, loadModule, loadRemoteModule, clearModuleCache };