<template>
  <div class="not-found">
    <div class="not-found-container">
      <!-- 404图标 -->
      <div class="not-found-icon">
        <el-icon size="120"><Warning /></el-icon>
      </div>

      <!-- 404标题 -->
      <h1 class="not-found-title">404</h1>

      <!-- 错误描述 -->
      <p class="not-found-description">抱歉，您访问的页面不存在或已被删除</p>

      <!-- 建议操作 -->
      <div class="not-found-suggestions">
        <p>您可以尝试：</p>
        <ul>
          <li>检查网址是否正确</li>
          <li>返回首页重新导航</li>
          <li>联系管理员获取帮助</li>
        </ul>
      </div>

      <!-- 操作按钮 -->
      <div class="not-found-actions">
        <el-button type="primary" @click="goHome">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
        <el-button @click="goBack">
          <el-icon><Back /></el-icon>
          返回上页
        </el-button>
      </div>

      <!-- 快捷导航 -->
      <div class="quick-nav">
        <h3>快捷导航</h3>
        <div class="nav-links">
          <el-button text @click="navigateTo('/home')">
            <el-icon><House /></el-icon>
            首页
          </el-button>
          <el-button text @click="navigateTo('/leads')">
            <el-icon><Document /></el-icon>
            线索管理
          </el-button>
          <el-button text @click="navigateTo('/exchange')">
            <el-icon><Switch /></el-icon>
            交换中心
          </el-button>
          <el-button text @click="navigateTo('/analytics')">
            <el-icon><TrendCharts /></el-icon>
            数据分析
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Warning, House, Back, Document, Switch, TrendCharts } from '@element-plus/icons-vue'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  // 如果有历史记录，返回上一页；否则跳转到首页
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

// 导航到指定路径
const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.not-found-container {
  text-align: center;
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

.not-found-icon {
  color: #f56c6c;
  margin-bottom: 20px;
}

.not-found-title {
  font-size: 72px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 20px 0;
  background: linear-gradient(45deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.not-found-description {
  font-size: 18px;
  color: #606266;
  margin-bottom: 30px;
  line-height: 1.6;
}

.not-found-suggestions {
  text-align: left;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.not-found-suggestions p {
  margin: 0 0 10px 0;
  font-weight: 600;
  color: #303133;
}

.not-found-suggestions ul {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.not-found-suggestions li {
  margin-bottom: 5px;
  line-height: 1.5;
}

.not-found-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 40px;
}

.not-found-actions .el-button {
  padding: 12px 24px;
  font-size: 16px;
}

.quick-nav {
  border-top: 1px solid #ebeef5;
  padding-top: 30px;
}

.quick-nav h3 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 18px;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.nav-links .el-button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s;
}

.nav-links .el-button:hover {
  background-color: #409eff;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .not-found-container {
    padding: 40px 20px;
  }

  .not-found-title {
    font-size: 48px;
  }

  .not-found-description {
    font-size: 16px;
  }

  .not-found-actions {
    flex-direction: column;
    align-items: center;
  }

  .not-found-actions .el-button {
    width: 200px;
  }

  .nav-links {
    flex-direction: column;
    align-items: center;
  }

  .nav-links .el-button {
    width: 150px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .not-found {
    padding: 10px;
  }

  .not-found-container {
    padding: 30px 15px;
  }

  .not-found-title {
    font-size: 36px;
  }

  .not-found-icon {
    font-size: 80px;
  }
}
</style>
