<template>
  <div class="login-container">
    <!-- B站风格登录卡片 -->
    <el-card class="login-card" shadow="hover">
      <!-- 顶部Logo+标题 -->
      <div class="login-header">
        <div class="logo">
          <!-- 简化B站Logo：粉色圆形+白色电视图标 -->
          <div class="logo-icon">📺</div>
        </div>
        <h2 class="login-title">B站数据仪表盘 - 登录</h2>
      </div>

      <!-- 登录表单 -->
      <el-form 
        ref="loginFormRef" 
        :model="loginForm" 
        :rules="loginRules" 
        class="login-form"
      >
        <!-- 账号输入 -->
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入账号" 
            prefix-icon="User"
            class="input-item"
          />
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码" 
            prefix-icon="Lock"
            class="input-item"
          />
        </el-form-item>

        <!-- 错误提示 -->
        <el-form-item v-if="errorMsg" class="error-item">
          <div class="error-text">{{ errorMsg }}</div>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item class="btn-item">
          <el-button 
            type="primary" 
            class="login-btn"
            @click="handleLogin"
            :loading="isLoading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import type { ElForm, FormItemRule } from 'element-plus';

// 表单Ref与数据
const loginFormRef = ref<InstanceType<typeof ElForm> | null>(null);
const loginForm = reactive({
  username: '',
  password: ''
});

// 表单校验规则
const loginRules = reactive<Record<string, FormItemRule[]>>({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
});

// 状态管理
const isLoading = ref(false);
const errorMsg = ref('');
const router = useRouter();

// 登录处理
const handleLogin = async () => {
  // 表单校验
  const valid = await loginFormRef.value?.validate();
  if (!valid) return;

  isLoading.value = true;
  errorMsg.value = '';

  try {
    // 基础验证（真实项目替换为接口请求）
    const mockUser = { username: 'admin', password: 'admin123' };
    if (
      loginForm.username === mockUser.username && 
      loginForm.password === mockUser.password
    ) {
      // 生成简单token（真实项目用接口返回的token）
      const token = 'bilibili_dashboard_token_' + Date.now();
      // 存储登录态
      localStorage.setItem('dashboard_token', token);
      localStorage.setItem('current_user', loginForm.username);
      // 跳首页
      router.push('/');
    } else {
      errorMsg.value = '账号或密码错误（默认：admin/admin123）';
    }
  } catch (err) {
    errorMsg.value = '登录失败，请重试';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 全屏居中容器 */
.login-container {
  width: 100vw;
  height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 登录卡片 */
.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 16px !important;
  border: none !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
  padding: 32px;
}

/* 顶部Logo区域 */
.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}
.logo {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #FB7299;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.logo-icon {
  font-size: 32px;
  color: #fff;
}
.login-title {
  font-size: 20px;
  color: #333;
  margin: 0;
}

/* 表单样式 */
.login-form {
  width: 100%;
}
.input-item {
  border-radius: 8px !important;
  height: 48px !important;
  font-size: 14px;
}
/* 输入框聚焦样式（B站粉） */
:deep(.el-input__wrapper:focus-within) {
  box-shadow: 0 0 0 2px rgba(251, 114, 153, 0.2) !important;
  border-color: #FB7299 !important;
}

/* 错误提示 */
.error-item {
  margin-bottom: 16px;
  margin-top: -8px;
}
.error-text {
  color: #f56c6c;
  font-size: 12px;
  text-align: center;
}

/* 登录按钮（B站粉主色） */
.btn-item {
  margin-top: 16px;
}
.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px !important;
  background-color: #FB7299 !important;
  border-color: #FB7299 !important;
  font-size: 16px;
}
:deep(.login-btn:hover) {
  background-color: #E05678 !important; /* 加深粉色hover */
  border-color: #E05678 !important;
}
</style>