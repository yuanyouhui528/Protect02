<script setup lang="ts">
// Element Plus集成验证页面
import { ElMessage, ElNotification } from 'element-plus'
import { reactive } from 'vue'
import { SuccessFilled, Edit, Delete, Search, Plus, Setting } from '@element-plus/icons-vue'

// 表单数据
const form = reactive({
  username: '',
  password: ''
})

// 显示消息提示
const showMessage = () => {
  ElMessage({
    message: 'Element Plus 集成成功！',
    type: 'success',
  })
}

// 显示通知
const showNotification = () => {
  ElNotification({
    title: '集成验证',
    message: 'Element Plus UI组件库已成功集成到项目中',
    type: 'success',
  })
}
</script>

<template>
  <div class="app-container">
    <!-- 页面标题 -->
    <el-row justify="center" class="header">
      <el-col :span="16">
        <h1>招商线索流通Web应用</h1>
        <p class="subtitle">Vue.js 3.x + Element Plus 集成验证</p>
      </el-col>
    </el-row>

    <!-- Element Plus组件验证区域 -->
    <el-row justify="center" class="content">
      <el-col :span="16">
        <el-card class="verification-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><SuccessFilled /></el-icon>
              <span>Element Plus 集成验证</span>
            </div>
          </template>
          
          <!-- 按钮组件验证 -->
          <el-row :gutter="20" class="demo-section">
            <el-col :span="24">
              <h3>按钮组件</h3>
              <el-button type="primary">主要按钮</el-button>
              <el-button type="success">成功按钮</el-button>
              <el-button type="info">信息按钮</el-button>
              <el-button type="warning">警告按钮</el-button>
              <el-button type="danger">危险按钮</el-button>
            </el-col>
          </el-row>

          <!-- 图标组件验证 -->
          <el-row :gutter="20" class="demo-section">
            <el-col :span="24">
              <h3>图标组件</h3>
              <el-icon size="24"><Edit /></el-icon>
              <el-icon size="24"><Delete /></el-icon>
              <el-icon size="24"><Search /></el-icon>
              <el-icon size="24"><Plus /></el-icon>
              <el-icon size="24"><Setting /></el-icon>
            </el-col>
          </el-row>

          <!-- 消息提示验证 -->
          <el-row :gutter="20" class="demo-section">
            <el-col :span="24">
              <h3>消息提示</h3>
              <el-button @click="showMessage">显示消息</el-button>
              <el-button @click="showNotification">显示通知</el-button>
            </el-col>
          </el-row>

          <!-- 表单组件验证 -->
          <el-row :gutter="20" class="demo-section">
            <el-col :span="24">
              <h3>表单组件</h3>
              <el-form :model="form" label-width="80px">
                <el-form-item label="用户名">
                  <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">提交</el-button>
                  <el-button>重置</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>



<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  margin-bottom: 30px;
}

.header h1 {
  color: white;
  text-align: center;
  margin-bottom: 10px;
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  font-size: 1.2em;
  margin: 0;
}

.verification-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.demo-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.demo-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.demo-section h3 {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
}

.el-button {
  margin-right: 10px;
  margin-bottom: 10px;
}

.el-icon {
  margin-right: 15px;
  color: #409eff;
}

.el-form {
  max-width: 400px;
}
</style>
