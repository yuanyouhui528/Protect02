# 业务组件目录

## 目录说明

此目录用于存放包含业务逻辑的组件，这些组件与具体的业务场景相关，可能会调用API、处理业务数据或包含特定的业务规则。

## 组件分类

### 用户相关组件

- **UserProfile**: 用户资料组件
- **UserAvatar**: 用户头像组件
- **UserCard**: 用户卡片组件
- **UserList**: 用户列表组件
- **UserSelector**: 用户选择器

### 线索相关组件

- **LeadCard**: 线索卡片组件
- **LeadList**: 线索列表组件
- **LeadForm**: 线索表单组件
- **LeadDetail**: 线索详情组件
- **LeadSearch**: 线索搜索组件
- **LeadFilter**: 线索筛选组件
- **LeadRating**: 线索评级组件

### 交换相关组件

- **ExchangeCard**: 交换卡片组件
- **ExchangeList**: 交换列表组件
- **ExchangeForm**: 交换申请表单
- **ExchangeDetail**: 交换详情组件
- **ExchangeHistory**: 交换历史组件
- **ExchangeStatus**: 交换状态组件

### 通知相关组件

- **NotificationList**: 通知列表组件
- **NotificationItem**: 通知项组件
- **NotificationCenter**: 通知中心组件
- **NotificationBell**: 通知铃铛组件

### 统计分析组件

- **StatCard**: 统计卡片组件
- **TrendChart**: 趋势图表组件
- **DataOverview**: 数据概览组件
- **AnalyticsPanel**: 分析面板组件

### 权限相关组件

- **PermissionGuard**: 权限守卫组件
- **RoleSelector**: 角色选择器
- **PermissionTree**: 权限树组件

## 组件开发规范

### 命名规范

- 组件文件名使用PascalCase：`LeadCard.vue`
- 组件名称与文件名保持一致
- 组件目录名使用kebab-case：`lead-card/`
- 业务组件名称应体现其业务含义

### 文件结构

```
lead-card/
├── LeadCard.vue       # 主组件文件
├── index.ts           # 导出文件
├── types.ts           # 类型定义
├── hooks.ts           # 组件专用hooks（如需要）
├── constants.ts       # 组件常量（如需要）
└── README.md          # 组件文档
```

### 组件模板

```vue
<template>
  <div class="lead-card">
    <!-- 组件内容 -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Lead } from '@/types'
import { useLeadApi } from '@/composables'

// Props定义
interface Props {
  lead: Lead
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
})

// Events定义
interface Emits {
  (e: 'edit', lead: Lead): void
  (e: 'delete', leadId: number): void
  (e: 'exchange', lead: Lead): void
}

const emit = defineEmits<Emits>()

// 组件逻辑
const { updateLead, deleteLead } = useLeadApi()

// 处理编辑
const handleEdit = () => {
  emit('edit', props.lead)
}

// 处理删除
const handleDelete = async () => {
  try {
    await deleteLead(props.lead.id)
    emit('delete', props.lead.id)
  } catch (error) {
    console.error('删除线索失败:', error)
  }
}

// 处理交换
const handleExchange = () => {
  emit('exchange', props.lead)
}
</script>

<style lang="scss" scoped>
.lead-card {
  // 组件样式
}
</style>
```

### API调用规范

- 使用composables进行API调用
- 统一错误处理
- 提供加载状态
- 支持数据缓存

### 状态管理

- 组件内部状态使用ref/reactive
- 全局状态使用Pinia store
- 避免在组件中直接操作全局状态

### 事件处理

- 使用emit向父组件传递事件
- 事件名称应清晰表达其含义
- 提供必要的事件参数

## 使用示例

```vue
<template>
  <div class="lead-management">
    <LeadCard
      v-for="lead in leads"
      :key="lead.id"
      :lead="lead"
      :show-actions="true"
      @edit="handleEditLead"
      @delete="handleDeleteLead"
      @exchange="handleExchangeLead"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { LeadCard } from '@/components/business'
import type { Lead } from '@/types'
import { useLeadStore } from '@/stores'

const leadStore = useLeadStore()
const leads = ref<Lead[]>([])

// 处理编辑线索
const handleEditLead = (lead: Lead) => {
  // 编辑逻辑
}

// 处理删除线索
const handleDeleteLead = (leadId: number) => {
  // 删除逻辑
}

// 处理交换线索
const handleExchangeLead = (lead: Lead) => {
  // 交换逻辑
}

onMounted(async () => {
  leads.value = await leadStore.fetchLeads()
})
</script>
```

## 组件通信

### 父子组件通信

- Props：父组件向子组件传递数据
- Emit：子组件向父组件传递事件
- v-model：双向数据绑定

### 跨组件通信

- Provide/Inject：祖先组件向后代组件传递数据
- Event Bus：事件总线（谨慎使用）
- Pinia Store：全局状态管理

### 组件间协作

- 使用composables共享逻辑
- 通过store共享状态
- 使用事件进行解耦

## 注意事项

1. **业务逻辑封装**：将复杂的业务逻辑封装到composables中
2. **组件职责单一**：每个组件只负责一个特定的业务功能
3. **数据流清晰**：明确数据的来源和流向
4. **错误处理**：提供友好的错误提示和处理
5. **性能优化**：合理使用计算属性和监听器
6. **可测试性**：编写单元测试验证组件功能
7. **文档完善**：提供详细的组件使用文档
8. **版本兼容**：考虑组件API的向后兼容性
