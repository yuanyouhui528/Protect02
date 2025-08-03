<template>
  <div class="test-auth-container">
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>🛡️ 路由守卫安全性测试</span>
        </div>
      </template>
      
      <div class="auth-status">
        <h3>当前认证状态</h3>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="登录状态">
            <el-tag :type="isLoggedIn ? 'success' : 'danger'">
              {{ isLoggedIn ? '已登录' : '未登录' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="当前用户">
            {{ currentUser?.username || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="用户角色">
            <el-tag v-for="role in userRoles" :key="role" class="role-tag">
              {{ role }}
            </el-tag>
            <span v-if="userRoles.length === 0">无</span>
          </el-descriptions-item>
          <el-descriptions-item label="用户权限">
            <el-tag v-for="permission in userPermissions" :key="permission" class="permission-tag" type="info">
              {{ permission }}
            </el-tag>
            <span v-if="userPermissions.length === 0">无</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="test-actions">
        <h3>测试操作</h3>
        <el-space direction="vertical" style="width: 100%">
          <el-button type="primary" @click="testLogin" :loading="isLoading">
            🔑 模拟登录
          </el-button>
          <el-button type="danger" @click="testLogout" :disabled="!isLoggedIn">
            🚪 退出登录
          </el-button>
          <el-button type="info" @click="checkTokenInfo">
            🔍 检查Token信息
          </el-button>
          <el-button type="warning" @click="testProtectedRoute">
            🛡️ 测试受保护路由
          </el-button>
        </el-space>
      </div>

      <div class="route-links">
        <h3>路由测试链接</h3>
        <el-space wrap>
          <el-link type="primary" @click="$router.push('/home')">
            首页 (需要登录)
          </el-link>
          <el-link type="success" @click="$router.push('/leads')">
            线索管理 (需要权限)
          </el-link>
          <el-link type="warning" @click="$router.push('/analytics')">
            数据分析 (需要角色)
          </el-link>
          <el-link type="info" @click="$router.push('/chart-demo')">
            图表示例 (无需登录)
          </el-link>
        </el-space>
      </div>

      <div class="token-info" v-if="tokenInfo">
        <h3>Token 信息</h3>
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="Token类型">
            {{ tokenInfo.type || 'JWT' }}
          </el-descriptions-item>
          <el-descriptions-item label="用户ID">
            {{ tokenInfo.userId || '未知' }}
          </el-descriptions-item>
          <el-descriptions-item label="过期时间">
            {{ tokenInfo.exp ? new Date(tokenInfo.exp * 1000).toLocaleString() : '未知' }}
          </el-descriptions-item>
          <el-descriptions-item label="签发时间">
            {{ tokenInfo.iat ? new Date(tokenInfo.iat * 1000).toLocaleString() : '未知' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuth } from '@/composables/useAuth'
import { utils as guardUtils } from '@/router/guards'

// 路由实例
const router = useRouter()

// 认证相关
const {
  isLoggedIn,
  currentUser,
  userRoles,
  userPermissions,
  isLoading,
  login,
  logout
} = useAuth()

// Token信息
const tokenInfo = ref<any>(null)

/**
 * 模拟登录
 */
const testLogin = async () => {
  try {
    const success = await login({
      phone: '13800138000',
      password: '123456'
    })
    
    if (success) {
      ElMessage.success('🎉 登录成功！')
      await checkTokenInfo()
    } else {
      ElMessage.error('❌ 登录失败')
    }
  } catch (error) {
    console.error('登录测试失败:', error)
    ElMessage.error('登录过程中发生错误')
  }
}

/**
 * 测试退出登录
 */
const testLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '确认退出', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await logout()
    tokenInfo.value = null
    ElMessage.success('👋 已退出登录')
  } catch (error) {
    // 用户取消操作
  }
}

/**
 * 检查Token信息
 */
const checkTokenInfo = async () => {
  try {
    const info = await guardUtils.getTokenInfo()
    tokenInfo.value = info
    
    if (info) {
      ElMessage.success('✅ Token信息获取成功')
    } else {
      ElMessage.warning('⚠️ 未找到有效Token')
    }
  } catch (error) {
    console.error('获取Token信息失败:', error)
    ElMessage.error('❌ 获取Token信息失败')
  }
}

/**
 * 测试受保护路由
 */
const testProtectedRoute = () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('⚠️ 请先登录后再测试受保护路由')
    return
  }
  
  ElMessage.info('🚀 即将跳转到首页测试路由守卫...')
  setTimeout(() => {
    router.push('/home')
  }, 1000)
}

// 组件挂载时检查Token信息
onMounted(() => {
  if (isLoggedIn.value) {
    checkTokenInfo()
  }
})
</script>

<style scoped>
.test-auth-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.test-card {
  margin-bottom: 20px;
}

.card-header {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.auth-status,
.test-actions,
.route-links,
.token-info {
  margin-bottom: 30px;
}

.auth-status h3,
.test-actions h3,
.route-links h3,
.token-info h3 {
  margin-bottom: 15px;
  color: #409eff;
  border-bottom: 2px solid #e4e7ed;
  padding-bottom: 8px;
}

.role-tag,
.permission-tag {
  margin-right: 8px;
  margin-bottom: 4px;
}

.route-links .el-link {
  margin-right: 15px;
  margin-bottom: 10px;
}
</style>