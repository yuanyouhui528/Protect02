# UI组件目录

## 目录说明

此目录用于存放通用的UI组件，这些组件不包含业务逻辑，可以在项目的任何地方复用。

## 组件分类

### 基础组件

- **Button**: 按钮组件
- **Input**: 输入框组件
- **Select**: 选择器组件
- **DatePicker**: 日期选择器
- **Upload**: 文件上传组件

### 布局组件

- **Container**: 容器组件
- **Grid**: 栅格布局
- **Card**: 卡片组件
- **Divider**: 分割线组件

### 反馈组件

- **Loading**: 加载组件
- **Message**: 消息提示
- **Dialog**: 对话框组件
- **Drawer**: 抽屉组件
- **Tooltip**: 文字提示

### 导航组件

- **Menu**: 菜单组件
- **Breadcrumb**: 面包屑导航
- **Pagination**: 分页组件
- **Steps**: 步骤条

### 数据展示组件

- **Table**: 表格组件
- **List**: 列表组件
- **Tree**: 树形组件
- **Tag**: 标签组件
- **Badge**: 徽章组件
- **Avatar**: 头像组件

## 组件开发规范

### 命名规范

- 组件文件名使用PascalCase：`MyComponent.vue`
- 组件名称与文件名保持一致
- 组件目录名使用kebab-case：`my-component/`

### 文件结构

```
my-component/
├── MyComponent.vue     # 主组件文件
├── index.ts           # 导出文件
├── types.ts           # 类型定义（如需要）
└── README.md          # 组件文档
```

### 组件模板

```vue
<template>
  <div class="my-component">
    <!-- 组件内容 -->
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style lang="scss" scoped>
// 组件样式
</style>
```

### Props定义

- 使用TypeScript定义Props类型
- 提供默认值和验证
- 添加详细的注释说明

### 事件定义

- 使用defineEmits定义事件
- 事件名使用kebab-case
- 提供事件参数类型

### 插槽定义

- 合理使用具名插槽和默认插槽
- 提供插槽参数类型
- 添加插槽说明文档

## 使用示例

```vue
<template>
  <MyComponent :prop1="value1" :prop2="value2" @event1="handleEvent1" @event2="handleEvent2">
    <template #slot1="{ data }">
      <!-- 插槽内容 -->
    </template>
  </MyComponent>
</template>

<script setup lang="ts">
import { MyComponent } from '@/components/ui'

// 组件使用逻辑
</script>
```

## 注意事项

1. **保持组件的纯净性**：UI组件不应包含业务逻辑
2. **提供完整的类型定义**：确保TypeScript支持
3. **编写组件文档**：说明组件的用途、API和使用示例
4. **考虑可访问性**：遵循WCAG标准
5. **响应式设计**：确保组件在不同设备上正常显示
6. **主题支持**：支持浅色/深色主题切换
