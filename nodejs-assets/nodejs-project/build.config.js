export default {
  entries: ["./main.js"],
  external: ["rn-bridge"],
  failOnWarn: false,
  // cjs esm
  rollup: {
    emitCJS: true,
    // hu略动态导入
    commonjs: {
      // ignore: ['conditional-runtime-dependency'],
      ignoreDynamicRequires: true
    }
  }
}
