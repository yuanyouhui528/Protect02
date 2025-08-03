<template>
  <div class="notification-center">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>通知中心</h2>
      <div class="header-actions">
        <el-button @click="markAllAsRead" :disabled="unreadCount === 0">
          <el-icon><Check /></el-icon>
          全部标记为已读
        </el-button>
        <el-button @click="clearAll">
          <el-icon><Delete /></el-icon>
          清空通知
        </el-button>
      </div>
    </div>

    <!-- 通知筛选 -->
    <el-card class="filter-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select
            v-model="filters.type"
            placeholder="通知类型"
            clearable
            @change="loadNotifications"
          >
            <el-option label="全部" value="" />
            <el-option label="系统通知" value="system" />
            <el-option label="交换通知" value="exchange" />
            <el-option label="线索通知" value="lead" />
            <el-option label="审核通知" value="audit" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="filters.status"
            placeholder="阅读状态"
            clearable
            @change="loadNotifications"
          >
            <el-option label="全部" value="" />
            <el-option label="未读" value="unread" />
            <el-option label="已读" value="read" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="loadNotifications"
          />
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="loadNotifications">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 通知统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="总通知数" :value="stats.total" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="未读通知" :value="stats.unread" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="今日新增" :value="stats.today" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="本周新增" :value="stats.thisWeek" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 通知列表 -->
    <el-card class="notification-list">
      <template #header>
        <div class="card-header">
          <span>通知列表</span>
          <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="notification-badge">
            <el-icon><Bell /></el-icon>
          </el-badge>
        </div>
      </template>

      <div v-loading="loading" class="notification-container">
        <div v-if="notifications.length === 0" class="empty-state">
          <el-empty description="暂无通知" />
        </div>

        <div v-else class="notification-items">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            :class="['notification-item', { unread: !notification.isRead }]"
            @click="handleNotificationClick(notification)"
          >
            <!-- 通知图标 -->
            <div class="notification-icon">
              <el-icon v-if="notification.type === 'system'" class="icon-system"
                ><Setting
              /></el-icon>
              <el-icon v-else-if="notification.type === 'exchange'" class="icon-exchange"
                ><Switch
              /></el-icon>
              <el-icon v-else-if="notification.type === 'lead'" class="icon-lead"
                ><Document
              /></el-icon>
              <el-icon v-else-if="notification.type === 'audit'" class="icon-audit"
                ><View
              /></el-icon>
              <el-icon v-else class="icon-default"><Bell /></el-icon>
            </div>

            <!-- 通知内容 -->
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-meta">
                <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
                <el-tag
                  v-if="notification.type"
                  :type="getTypeTagType(notification.type)"
                  size="small"
                >
                  {{ getTypeLabel(notification.type) }}
                </el-tag>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="notification-actions">
              <el-button
                v-if="!notification.isRead"
                type="primary"
                size="small"
                @click.stop="markAsRead(notification.id)"
              >
                标记已读
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click.stop="deleteNotification(notification.id)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 通知详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="通知详情" width="600px">
      <div v-if="selectedNotification" class="notification-detail">
        <div class="detail-header">
          <h3>{{ selectedNotification.title }}</h3>
          <el-tag :type="getTypeTagType(selectedNotification.type)">
            {{ getTypeLabel(selectedNotification.type) }}
          </el-tag>
        </div>
        <div class="detail-content">
          <p>{{ selectedNotification.message }}</p>
          <div v-if="selectedNotification.data" class="detail-data">
            <h4>相关数据：</h4>
            <pre>{{ JSON.stringify(selectedNotification.data, null, 2) }}</pre>
          </div>
        </div>
        <div class="detail-footer">
          <p><strong>发送时间：</strong>{{ formatTime(selectedNotification.createdAt) }}</p>
          <p>
            <strong>阅读状态：</strong>
            <el-tag :type="selectedNotification.isRead ? 'success' : 'warning'">
              {{ selectedNotification.isRead ? '已读' : '未读' }}
            </el-tag>
          </p>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button
          v-if="selectedNotification && !selectedNotification.isRead"
          type="primary"
          @click="markAsReadAndClose"
        >
          标记已读并关闭
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Check,
  Delete,
  Search,
  Bell,
  Setting,
  Switch,
  Document,
  View,
} from '@element-plus/icons-vue'

// 接口定义
interface Notification {
  id: string
  type: 'system' | 'exchange' | 'lead' | 'audit'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  data?: any
}

// 响应式数据
const loading = ref(false)
const notifications = ref<Notification[]>([])
const selectedNotification = ref<Notification | null>(null)
const detailDialogVisible = ref(false)

// 筛选条件
const filters = reactive({
  type: '',
  status: '',
  dateRange: null as [string, string] | null,
})

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

// 统计数据
const stats = reactive({
  total: 0,
  unread: 0,
  today: 0,
  thisWeek: 0,
})

// 计算属性
const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.isRead).length
})

// 获取类型标签类型
const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    system: 'info',
    exchange: 'success',
    lead: 'warning',
    audit: 'danger',
  }
  return typeMap[type] || 'info'
}

// 获取类型标签文本
const getTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    system: '系统通知',
    exchange: '交换通知',
    lead: '线索通知',
    audit: '审核通知',
  }
  return labelMap[type] || '未知类型'
}

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  } else {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }
}

// 加载通知列表
const loadNotifications = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取通知列表
    // 模拟数据
    setTimeout(() => {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'exchange',
          title: '交换申请通过',
          message: '您的线索交换申请已通过，请查看详情。',
          isRead: false,
          createdAt: new Date(Date.now() - 300000).toISOString(),
        },
        {
          id: '2',
          type: 'lead',
          title: '新线索发布',
          message: '有新的优质线索发布，符合您的筛选条件。',
          isRead: false,
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          id: '3',
          type: 'system',
          title: '系统维护通知',
          message: '系统将于今晚22:00-24:00进行维护，请提前做好准备。',
          isRead: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ]

      notifications.value = mockNotifications
      pagination.total = mockNotifications.length

      // 更新统计数据
      stats.total = mockNotifications.length
      stats.unread = mockNotifications.filter((n) => !n.isRead).length
      stats.today = mockNotifications.filter((n) => {
        const today = new Date().toDateString()
        return new Date(n.createdAt).toDateString() === today
      }).length
      stats.thisWeek = mockNotifications.length // 简化计算

      loading.value = false
    }, 500)
  } catch (error) {
    console.error('加载通知列表失败:', error)
    ElMessage.error('加载通知列表失败')
    loading.value = false
  }
}

// 点击通知
const handleNotificationClick = (notification: Notification) => {
  selectedNotification.value = notification
  detailDialogVisible.value = true

  // 如果是未读通知，自动标记为已读
  if (!notification.isRead) {
    markAsRead(notification.id)
  }
}

// 标记为已读
const markAsRead = async (id: string) => {
  try {
    // TODO: 调用API标记为已读
    const notification = notifications.value.find((n) => n.id === id)
    if (notification) {
      notification.isRead = true
      stats.unread = Math.max(0, stats.unread - 1)
    }
    ElMessage.success('已标记为已读')
  } catch (error) {
    console.error('标记已读失败:', error)
    ElMessage.error('标记已读失败')
  }
}

// 标记已读并关闭对话框
const markAsReadAndClose = () => {
  if (selectedNotification.value) {
    markAsRead(selectedNotification.value.id)
  }
  detailDialogVisible.value = false
}

// 全部标记为已读
const markAllAsRead = async () => {
  try {
    await ElMessageBox.confirm('确定要将所有通知标记为已读吗？', '确认操作', {
      type: 'warning',
    })

    // TODO: 调用API全部标记为已读
    notifications.value.forEach((n) => {
      n.isRead = true
    })
    stats.unread = 0

    ElMessage.success('已全部标记为已读')
  } catch (error) {
    // 用户取消操作
  }
}

// 删除通知
const deleteNotification = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这条通知吗？', '确认删除', {
      type: 'warning',
    })

    // TODO: 调用API删除通知
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      const notification = notifications.value[index]
      notifications.value.splice(index, 1)

      // 更新统计
      stats.total--
      if (!notification.isRead) {
        stats.unread--
      }

      pagination.total--
    }

    ElMessage.success('删除成功')
  } catch (error) {
    // 用户取消操作
  }
}

// 清空所有通知
const clearAll = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有通知吗？此操作不可恢复。', '确认清空', {
      type: 'warning',
    })

    // TODO: 调用API清空通知
    notifications.value = []
    Object.assign(stats, {
      total: 0,
      unread: 0,
      today: 0,
      thisWeek: 0,
    })
    pagination.total = 0

    ElMessage.success('已清空所有通知')
  } catch (error) {
    // 用户取消操作
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.size = size
  loadNotifications()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadNotifications()
}

// 组件挂载
onMounted(() => {
  loadNotifications()
})
</script>

<style scoped>
.notification-center {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.filter-card {
  margin-bottom: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.notification-list {
  min-height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-badge {
  margin-left: 10px;
}

.notification-container {
  min-height: 300px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.notification-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.notification-item:hover {
  background-color: #f5f7fa;
  border-color: #409eff;
}

.notification-item.unread {
  background-color: #f0f9ff;
  border-color: #409eff;
}

.notification-icon {
  margin-right: 15px;
  margin-top: 5px;
}

.icon-system {
  color: #909399;
}
.icon-exchange {
  color: #67c23a;
}
.icon-lead {
  color: #e6a23c;
}
.icon-audit {
  color: #f56c6c;
}
.icon-default {
  color: #409eff;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 5px;
}

.notification-message {
  color: #606266;
  margin-bottom: 10px;
  line-height: 1.5;
}

.notification-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-time {
  font-size: 12px;
  color: #909399;
}

.notification-actions {
  display: flex;
  gap: 10px;
  margin-left: 15px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.notification-detail {
  padding: 10px 0;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.detail-header h3 {
  margin: 0;
  color: #303133;
}

.detail-content {
  margin-bottom: 20px;
}

.detail-content p {
  line-height: 1.6;
  color: #606266;
}

.detail-data {
  margin-top: 15px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.detail-data h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.detail-data pre {
  margin: 0;
  font-size: 12px;
  color: #606266;
  white-space: pre-wrap;
  word-break: break-all;
}

.detail-footer {
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

.detail-footer p {
  margin: 5px 0;
  color: #606266;
}
</style>
