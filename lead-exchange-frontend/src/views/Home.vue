<template>
  <div class="home">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <span>欢迎使用招商线索流通平台</span>
        </div>
      </template>
      <div class="welcome-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-statistic title="我的线索" :value="0" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="交换次数" :value="0" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="收藏线索" :value="0" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="待处理" :value="0" />
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 首页组件
// 显示用户的基本统计信息和快捷操作
</script>

<style scoped>
.home {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-content {
  padding: 20px 0;
}
</style>
