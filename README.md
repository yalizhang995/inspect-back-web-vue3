## 开发（Vue 3 + Vite）

```bash
# 安装依赖
npm install

# 启动开发服务
npm run dev
```

默认地址：`http://localhost:80`

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 迁移说明

本仓库已从 `Vue CLI + Vue 2` 迁移为 `Vite + Vue 3` 基础构建链路：

- 构建工具切换到 Vite（`vite.config.js`）；
- 入口切换为 Vue 3 `createApp`；
- 路由升级为 `vue-router@4`；
- 状态管理升级为 `vuex@4`；
- UI 组件库切换为 `element-plus`。

> 由于项目体量较大，业务页面仍建议分模块继续做兼容性回归测试与细节适配。

## 页面是否需要修改（重点）

结论：**需要，且建议按模块分批改，不建议一次性全量改完。**

### 1) 基础上通常不需要改动的

- 绝大多数 `Options API` 写法（`data / methods / computed / watch`）可以继续用。
- 普通模板语法（`v-if / v-for / v-model` 基础用法）大多可复用。

### 2) 高概率要改的（Vue 3 / Element Plus 差异）

- `this.$refs.xxx` 依赖旧组件内部实例行为的地方。
- 依赖 `this.$listeners`、`$scopedSlots`、`.native` 事件修饰符的写法。
- 过滤器（`| filter`）等 Vue 2 时代能力。
- 旧版 `slot=""` / `slot-scope` 语法（需改为 `v-slot`）。
- Element UI 与 Element Plus 的 API 差异（如部分表单、弹窗、上传、日期类组件的 props/events）。
- 样式层面的类名差异（尤其是深度选择器、主题变量覆盖）。

### 3) 组件库是否必须用 Element Plus

如果目标是 **Vue 3 正式运行**，建议直接使用 **Element Plus**：

- `element-ui` 官方只支持 Vue 2；
- 在 Vue 3 项目中长期保留 `element-ui` 风险高、维护成本高；
- 新功能/兼容修复基本集中在 Element Plus 生态。

### 4) 推荐迁移顺序

1. 先保证登录、布局、菜单、权限路由可用；
2. 再迁移高频业务页（列表、表单、详情）；
3. 最后处理低频页面与样式细节；
4. 每个模块迁移后做一次联调回归（接口、权限、导出、上传、图表）。
