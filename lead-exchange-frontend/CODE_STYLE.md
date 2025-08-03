# 代码规范配置说明

本项目已配置完整的代码规范工具链，包括 ESLint、Prettier 和 EditorConfig，确保代码质量和一致性。

## 🛠️ 工具配置

### ESLint 配置

- **配置文件**: `eslint.config.ts`
- **使用现代 Flat Config 格式**
- **支持的文件类型**: `.ts`, `.mts`, `.tsx`, `.vue`
- **集成插件**:
  - `@vue/eslint-config-typescript` - Vue + TypeScript 支持
  - `eslint-plugin-vue` - Vue.js 专用规则
  - `@vitest/eslint-plugin` - Vitest 测试规则
  - `eslint-plugin-playwright` - Playwright E2E 测试规则
  - `eslint-plugin-oxlint` - Oxlint 集成
  - `@vue/eslint-config-prettier` - 与 Prettier 兼容

### Prettier 配置

- **配置文件**: `.prettierrc.json`
- **主要规则**:
  - 不使用分号 (`"semi": false`)
  - 使用单引号 (`"singleQuote": true`)
  - 行宽限制 100 字符 (`"printWidth": 100`)

### EditorConfig 配置

- **配置文件**: `.editorconfig`
- **统一编辑器设置**:
  - UTF-8 编码
  - 2 空格缩进
  - 文件末尾插入换行符
  - 删除行尾空白字符
  - LF 换行符
  - 最大行长度 100 字符

## 📝 NPM 脚本命令

### 代码检查

```bash
# 运行所有 lint 检查
npm run lint

# 仅运行 ESLint 检查
npm run lint:eslint

# 仅运行 Oxlint 检查
npm run lint:oxlint
```

### 代码格式化

```bash
# 格式化 src 目录下的所有文件
npm run format
```

## 🔧 VSCode 集成配置

项目已配置 VSCode 工作区设置 (`.vscode/settings.json`)，包括：

### 推荐扩展

- **Vue Language Features (Volar)** - Vue 3 支持
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **EditorConfig** - 编辑器配置
- **Oxc** - 高性能 linter
- **Vitest** - 测试支持
- **Playwright** - E2E 测试支持

### 自动化功能

- **保存时自动格式化** - 使用 Prettier
- **保存时自动修复** - 使用 ESLint 和 Oxlint
- **实时错误提示** - ESLint 集成
- **智能导入** - TypeScript 自动导入

## 📋 代码规范要点

### TypeScript 规范

- 优先使用 `interface` 而非 `type`
- 避免使用 `any` 类型，使用具体类型或泛型
- 函数参数和返回值必须有类型注解
- 未使用的变量以 `_` 开头

### Vue 规范

- 组件名使用 PascalCase
- Props 定义使用 TypeScript 接口
- 事件名使用 kebab-case
- 使用 Composition API

### 通用规范

- 使用 2 空格缩进
- 使用单引号
- 不使用分号
- 行宽不超过 100 字符
- 文件末尾保留一个空行
- 删除行尾空白字符

## 🚀 开发工作流

1. **编写代码** - VSCode 会实时提示错误和格式问题
2. **保存文件** - 自动运行 Prettier 格式化和 ESLint 修复
3. **提交前检查** - 运行 `npm run lint` 确保代码质量
4. **格式化代码** - 运行 `npm run format` 统一代码风格

## 📚 相关文档

- [ESLint 官方文档](https://eslint.org/)
- [Prettier 官方文档](https://prettier.io/)
- [Vue ESLint 配置](https://eslint.vuejs.org/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [EditorConfig 官方文档](https://editorconfig.org/)

---

> 💡 **提示**: 建议在 VSCode 中安装推荐的扩展，以获得最佳的开发体验。所有配置都已针对 Vue 3 + TypeScript + Vite 项目进行优化。