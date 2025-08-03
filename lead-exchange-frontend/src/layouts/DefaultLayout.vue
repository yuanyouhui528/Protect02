<template>
  <div class="default-layout">
    <!-- 头部导航 -->
    <header class="layout-header">
      <div class="header-left">
        <!-- Logo -->
        <div class="logo">
          <img src="/favicon.ico" alt="Logo" class="logo-image" />
          <span class="logo-text">招商线索流通平台</span>
        </div>

        <!-- 侧边栏切换按钮 -->
        <el-button type="text" class="sidebar-toggle" @click="toggleSidebar">
          <el-icon><Menu /></el-icon>
        </el-button>
      </div>

      <div class="header-center">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="header-right">
        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索线索..."
            prefix-icon="Search"
            clearable
            @keyup.enter="handleSearch"
          />
        </div>

        <!-- 通知 -->
        <el-badge :value="unreadCount" class="notification-badge">
          <el-button type="text" @click="showNotifications">
            <el-icon><Bell /></el-icon>
          </el-button>
        </el-badge>

        <!-- 主题切换 -->
        <el-button type="text" @click="toggleTheme">
          <el-icon><Sunny v-if="isDark" /><Moon v-else /></el-icon>
        </el-button>

        <!-- 用户菜单 -->
        <el-dropdown @command="handleUserCommand">
          <div class="user-info">
            <el-avatar :src="currentUser?.avatar" :size="32">
              {{ currentUser?.username?.charAt(0).toUpperCase() }}
            </el-avatar>
            <span class="username">{{ currentUser?.username }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人资料
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                系统设置
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 主体内容 -->
    <div class="layout-body">
      <!-- 侧边栏 -->
      <aside class="layout-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-content">
          <!-- 导航菜单 -->
          <el-menu
            :default-active="activeMenu"
            :collapse="sidebarCollapsed"
            :unique-opened="true"
            router
            class="sidebar-menu"
          >
            <template v-for="item in menuItems" :key="item.key">
              <!-- 有子菜单的项 -->
              <el-sub-menu v-if="item.children" :index="item.key">
                <template #title>
                  <el-icon><component :is="item.icon" /></el-icon>
                  <span>{{ item.title }}</span>
                </template>
                <el-menu-item v-for="child in item.children" :key="child.key" :index="child.path">
                  <el-icon><component :is="child.icon" /></el-icon>
                  <span>{{ child.title }}</span>
                </el-menu-item>
              </el-sub-menu>

              <!-- 无子菜单的项 -->
              <el-menu-item v-else :index="item.path">
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.title }}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="layout-main">
        <div class="main-content">
          <!-- 路由视图 -->
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>

    <!-- 通知抽屉 -->
    <el-drawer v-model="notificationDrawer" title="通知中心" direction="rtl" size="400px">
      <div class="notification-list">
        <!-- 通知列表内容 -->
        <el-empty v-if="notifications.length === 0" description="暂无通知" />
        <div v-else>
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item"
            :class="{ unread: notification.status === 'UNREAD' }"
          >
            <div class="notification-content">
              <h4>{{ notification.title }}</h4>
              <p>{{ notification.content }}</p>
              <span class="notification-time">{{ formatTime(notification.createTime) }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Menu,
  Bell,
  Sunny,
  Moon,
  User,
  Setting,
  SwitchButton,
  ArrowDown,
  Search,
  House,
  DataLine,
  Switch,
  Bell as BellIcon,
  Document,
} from '@element-plus/icons-vue'
import { useAuth } from '@/composables/useAuth'
import { elementPlusTheme } from '@/plugins/element-plus'
import type { MenuItem, Notification } from '@/types'

// ==================== 响应式数据 ====================

const route = useRoute()
const router = useRouter()
const { currentUser, logout } = useAuth()

// 侧边栏状态
const sidebarCollapsed = ref(false)

// 搜索关键词
const searchKeyword = ref('')

// 主题状态
const isDark = ref(false)

// 通知相关
const notificationDrawer = ref(false)
const notifications = ref<Notification[]>([])
const unreadCount = ref(0)

// ==================== 计算属性 ====================

/**
 * 当前激活的菜单项
 */
const activeMenu = computed(() => {
  return route.path
})

/**
 * 面包屑导航
 */
const breadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.meta?.title)
  return matched.map((item) => ({
    title: item.meta?.title as string,
    path: item.path,
  }))
})

/**
 * 菜单项配置
 */
const menuItems = computed<MenuItem[]>(() => [
  {
    key: 'dashboard',
    title: '仪表盘',
    icon: 'House',
    path: '/',
  },
  {
    key: 'leads',
    title: '线索管理',
    icon: 'Document',
    children: [
      {
        key: 'lead-list',
        title: '线索列表',
        icon: 'Document',
        path: '/leads',
      },
      {
        key: 'lead-create',
        title: '发布线索',
        icon: 'Document',
        path: '/leads/create',
      },
    ],
  },
  {
    key: 'exchange',
    title: '交换中心',
    icon: 'Switch',
    path: '/exchange',
  },
  {
    key: 'analytics',
    title: '数据分析',
    icon: 'DataLine',
    path: '/analytics',
  },
  {
    key: 'notifications',
    title: '通知中心',
    icon: 'Bell',
    path: '/notifications',
  },
])

// ==================== 方法 ====================

/**
 * 切换侧边栏
 */
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem('sidebar_collapsed', String(sidebarCollapsed.value))
}

/**
 * 切换主题
 */
const toggleTheme = () => {
  elementPlusTheme.toggle()
  isDark.value = elementPlusTheme.getCurrentTheme() === 'dark'
}

/**
 * 处理搜索
 */
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/leads',
      query: { keyword: searchKeyword.value },
    })
  }
}

/**
 * 显示通知
 */
const showNotifications = () => {
  notificationDrawer.value = true
  // TODO: 加载通知数据
}

/**
 * 处理用户菜单命令
 */
const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      logout()
      break
  }
}

/**
 * 格式化时间
 */
const formatTime = (time: string) => {
  return new Date(time).toLocaleString()
}

/**
 * 初始化布局
 */
const initLayout = () => {
  // 恢复侧边栏状态
  const savedCollapsed = localStorage.getItem('sidebar_collapsed')
  if (savedCollapsed) {
    sidebarCollapsed.value = savedCollapsed === 'true'
  }

  // 初始化主题
  elementPlusTheme.init()
  isDark.value = elementPlusTheme.getCurrentTheme() === 'dark'
}

// ==================== 生命周期 ====================

onMounted(() => {
  initLayout()
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.default-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

// 头部样式
.layout-header {
  height: $header-height;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-medium;
  box-shadow: var(--el-box-shadow-lighter);
  z-index: 1000;

  .header-left {
    display: flex;
    align-items: center;
    gap: $spacing-medium;

    .logo {
      display: flex;
      align-items: center;
      gap: $spacing-small;

      .logo-image {
        width: 32px;
        height: 32px;
      }

      .logo-text {
        font-size: $font-size-large;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }

    .sidebar-toggle {
      font-size: $font-size-large;
    }
  }

  .header-center {
    flex: 1;
    margin: 0 $spacing-large;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: $spacing-medium;

    .search-box {
      width: 240px;
    }

    .notification-badge {
      .el-button {
        font-size: $font-size-large;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: $spacing-small;
      cursor: pointer;
      padding: $spacing-small;
      border-radius: $border-radius-base;
      transition: $transition-base;

      &:hover {
        background: var(--el-fill-color-light);
      }

      .username {
        font-size: $font-size-base;
        color: var(--el-text-color-primary);
      }
    }
  }
}

// 主体样式
.layout-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

// 侧边栏样式
.layout-sidebar {
  width: $sidebar-width;
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
  transition: width 0.3s ease;

  &.collapsed {
    width: $sidebar-collapsed-width;
  }

  .sidebar-content {
    height: 100%;
    overflow-y: auto;
  }

  .sidebar-menu {
    border: none;
    height: 100%;

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      height: 48px;
      line-height: 48px;

      .el-icon {
        margin-right: $spacing-small;
      }
    }
  }
}

// 主内容区样式
.layout-main {
  flex: 1;
  overflow: hidden;

  .main-content {
    height: 100%;
    overflow-y: auto;
    padding: $spacing-medium;
    background: var(--el-bg-color-page);
  }
}

// 通知列表样式
.notification-list {
  .notification-item {
    padding: $spacing-medium;
    border-bottom: 1px solid var(--el-border-color-lighter);
    cursor: pointer;
    transition: $transition-base;

    &:hover {
      background: var(--el-fill-color-light);
    }

    &.unread {
      background: var(--el-color-primary-light-9);
      border-left: 3px solid var(--el-color-primary);
    }

    .notification-content {
      h4 {
        margin: 0 0 $spacing-small 0;
        font-size: $font-size-base;
        color: var(--el-text-color-primary);
      }

      p {
        margin: 0 0 $spacing-small 0;
        font-size: $font-size-small;
        color: var(--el-text-color-regular);
        line-height: 1.4;
      }

      .notification-time {
        font-size: $font-size-extra-small;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 响应式设计
@include respond-to(md) {
  .layout-header {
    .header-center {
      display: none;
    }

    .header-right {
      .search-box {
        width: 200px;
      }
    }
  }
}

@include respond-to(sm) {
  .layout-header {
    .header-right {
      .search-box {
        display: none;
      }
    }
  }

  .layout-sidebar {
    position: fixed;
    left: 0;
    top: $header-height;
    height: calc(100vh - #{$header-height});
    z-index: 999;
    transform: translateX(-100%);

    &:not(.collapsed) {
      transform: translateX(0);
    }
  }

  .layout-main {
    margin-left: 0;
  }
}
</style>
