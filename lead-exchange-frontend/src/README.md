# 招商线索流通Web应用 - 前端项目

## 项目概述

本项目是一个基于Vue.js 3.x的招商线索流通Web应用前端，采用现代化的前端技术栈，提供线索管理、交换、评级等核心功能。

## 技术栈

- **框架**: Vue.js 3.x + TypeScript
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **路由**: Vue Router 4.x
- **状态管理**: Pinia
- **HTTP客户端**: Axios
- **图表库**: ECharts 5.x
- **样式**: SCSS

## 项目结构

```
src/
├── api/                    # API接口定义
│   ├── auth.ts            # 认证相关API
│   ├── leads.ts           # 线索相关API
│   ├── exchange.ts        # 交换相关API
│   ├── users.ts           # 用户相关API
│   └── index.ts           # API统一导出
│
├── assets/                 # 静态资源
│   ├── images/            # 图片资源
│   ├── icons/             # 图标资源
│   └── fonts/             # 字体资源
│
├── components/             # 组件目录
│   ├── ui/                # 通用UI组件
│   ├── business/          # 业务组件
│   ├── charts/            # 图表组件
│   └── index.ts           # 组件统一导出
│
├── composables/            # 组合式API
│   ├── useAuth.ts         # 认证相关
│   ├── useApi.ts          # API调用
│   ├── useTable.ts        # 表格相关
│   └── index.ts           # Composables统一导出
│
├── constants/              # 常量定义
│   └── index.ts           # 项目常量
│
├── directives/             # 自定义指令
│   ├── permission.ts      # 权限指令
│   └── index.ts           # 指令统一导出
│
├── layouts/                # 布局组件
│   ├── DefaultLayout.vue  # 默认布局
│   ├── AuthLayout.vue     # 认证布局
│   └── index.ts           # 布局统一导出
│
├── middleware/             # 路由中间件
│   ├── auth.ts            # 认证中间件
│   └── index.ts           # 中间件统一导出
│
├── plugins/                # 插件配置
│   ├── element-plus.ts    # Element Plus配置
│   ├── echarts.ts         # ECharts配置
│   └── index.ts           # 插件统一导出
│
├── router/                 # 路由配置
│   ├── index.ts           # 路由主文件
│   └── routes.ts          # 路由定义
│
├── stores/                 # Pinia状态管理
│   ├── auth.ts            # 认证状态
│   ├── user.ts            # 用户状态
│   ├── leads.ts           # 线索状态
│   └── index.ts           # Store统一导出
│
├── styles/                 # 样式文件
│   ├── variables.scss     # SCSS变量
│   ├── mixins.scss        # SCSS混入
│   ├── global.scss        # 全局样式
│   └── themes/            # 主题样式
│       ├── light.scss     # 浅色主题
│       └── dark.scss      # 深色主题
│
├── types/                  # TypeScript类型定义
│   └── index.ts           # 类型统一导出
│
├── utils/                  # 工具函数
│   ├── http.ts            # HTTP工具
│   ├── echarts.ts         # ECharts工具
│   ├── format.ts          # 格式化工具
│   └── index.ts           # 工具统一导出
│
├── views/                  # 页面组件
│   ├── auth/              # 认证相关页面
│   ├── dashboard/         # 仪表板
│   ├── leads/             # 线索管理
│   ├── exchange/          # 交换管理
│   ├── profile/           # 个人中心
│   └── error/             # 错误页面
│
├── App.vue                 # 根组件
├── main.ts                 # 应用入口
└── README.md              # 项目说明
```

## 核心功能模块

### 1. 用户管理模块

- 用户注册、登录、登出
- 用户资料管理
- 权限控制
- 角色管理

### 2. 线索管理模块

- 线索创建、编辑、删除
- 线索搜索、筛选
- 线索评级
- 线索状态管理

### 3. 交换引擎模块

- 线索交换申请
- 交换审核
- 交换历史
- 价值计算

### 4. 数据分析模块

- 数据统计
- 趋势分析
- 图表展示
- 报表生成

### 5. 通知服务模块

- 站内消息
- 邮件通知
- 短信通知
- 实时推送

## 开发规范

### 代码规范

- 使用TypeScript进行类型检查
- 遵循Vue 3 Composition API规范
- 使用ESLint + Prettier进行代码格式化
- 组件命名使用PascalCase
- 文件命名使用kebab-case

### 组件开发

- 组件职责单一
- Props类型定义完整
- 事件定义清晰
- 提供完整的TypeScript支持
- 编写组件文档

### 样式规范

- 使用SCSS预处理器
- 采用BEM命名规范
- 支持主题切换
- 响应式设计

### API调用

- 使用Axios进行HTTP请求
- 统一错误处理
- 请求/响应拦截器
- 接口类型定义

## 状态管理

使用Pinia进行状态管理，按功能模块划分Store：

- **authStore**: 认证状态管理
- **userStore**: 用户信息管理
- **leadStore**: 线索数据管理
- **exchangeStore**: 交换数据管理
- **notificationStore**: 通知数据管理

## 路由设计

采用Vue Router 4.x，支持：

- 路由懒加载
- 权限控制
- 路由守卫
- 动态路由
- 嵌套路由

## 主题系统

支持浅色/深色主题切换：

- CSS变量定义主题色彩
- 动态主题切换
- 主题持久化存储
- 组件主题适配

## 国际化

支持多语言：

- 中文（简体）
- 英文
- 动态语言切换
- 语言持久化存储

## 性能优化

- 组件懒加载
- 图片懒加载
- 虚拟滚动
- 防抖节流
- 缓存策略

## 安全措施

- JWT认证
- 权限控制
- XSS防护
- CSRF防护
- 敏感数据加密

## 开发环境

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

### 类型检查

```bash
npm run type-check
```

## 部署说明

### 环境配置

- 开发环境：`.env.development`
- 生产环境：`.env.production`
- 测试环境：`.env.test`

### 构建部署

1. 执行构建命令生成dist目录
2. 将dist目录部署到Web服务器
3. 配置Nginx反向代理
4. 配置HTTPS证书

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交代码变更
4. 推送到分支
5. 创建Pull Request

## 许可证

本项目采用MIT许可证，详见LICENSE文件。

## 联系方式

如有问题或建议，请联系开发团队。
