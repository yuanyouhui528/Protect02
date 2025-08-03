<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <div class="card-header">
          <span>用户注册</span>
        </div>
      </template>
      <el-form :model="registerForm" :rules="rules" ref="registerFormRef" label-width="80px">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="registerForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-row :gutter="10">
            <el-col :span="16">
              <el-input v-model="registerForm.code" placeholder="请输入验证码" />
            </el-col>
            <el-col :span="8">
              <el-button @click="sendCode" :disabled="codeDisabled">
                {{ codeText }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="registerForm.name" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="registerForm.company" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister" :loading="loading" style="width: 100%">
            注册
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="primary" @click="$router.push('/auth/login')">
            已有账号？立即登录
          </el-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 路由实例
const router = useRouter()

// 表单引用
const registerFormRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 验证码相关
const codeDisabled = ref(false)
const codeText = ref('发送验证码')
const countdown = ref(0)

// 注册表单数据
const registerForm = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  name: '',
  company: '',
})

// 确认密码验证
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const rules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
  name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  company: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
}

// 发送验证码
const sendCode = () => {
  if (!registerForm.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }

  // TODO: 调用发送验证码API
  ElMessage.success('验证码已发送')

  // 开始倒计时
  codeDisabled.value = true
  countdown.value = 60

  const timer = setInterval(() => {
    countdown.value--
    codeText.value = `${countdown.value}秒后重发`

    if (countdown.value <= 0) {
      clearInterval(timer)
      codeDisabled.value = false
      codeText.value = '发送验证码'
    }
  }, 1000)
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()
    loading.value = true

    // TODO: 调用注册API
    // 模拟注册成功
    setTimeout(() => {
      loading.value = false
      ElMessage.success('注册成功，请登录')
      router.push('/auth/login')
    }, 1000)
  } catch (error) {
    console.error('注册失败:', error)
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px 0;
}

.register-card {
  width: 450px;
}

.card-header {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}
</style>
