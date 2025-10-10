<template>
  <!-- 复用bili-header，保持头部统一 -->
  <header>
    <bili-header />
  </header>

  <!-- 主体内容：使用Element Plus表单布局，风格与dashboard统一 -->
  <main class="setting-container">
    <el-card shadow="hover" class="setting-card">
      <div class="card-header">
        <p class="card-header-title">系统配置</p>
        <p class="card-header-desc">自定义数据监控看板的显示与更新规则</p>
      </div>

      <!-- 配置表单 -->
      <el-form 
        ref="settingFormRef"
        :model="form" 
        label-width="160px" 
        class="setting-form"
      >
        <!-- 1. 自动刷新间隔 -->
        <el-form-item 
          label="自动刷新间隔" 
          prop="refreshInterval"
          :rules="[{ required: true, message: '请选择刷新间隔', trigger: 'change' }]"
        >
          <el-select 
            v-model="form.refreshInterval" 
            placeholder="选择刷新间隔"
            style="width: 200px"
          >
            <el-option label="10秒" value="10" />
            <el-option label="30秒" value="30" />
            <el-option label="1分钟" value="60" />
            <el-option label="5分钟" value="300" />
            <el-option label="关闭自动刷新" value="0" />
          </el-select>
          <span class="form-hint">（设置为0将关闭dashboard自动刷新）</span>
        </el-form-item>

        <!-- 2. 图表显示设置 -->
        <el-form-item label="图表显示配置">
          <el-space direction="vertical" size="16">
            <!-- 显示图例 -->
            <el-switch 
              v-model="form.chartShowLegend" 
              active-text="显示图表图例" 
              inactive-text="隐藏图表图例"
              active-color="#FB7299"
            />
            <!-- 显示数据标签 -->
            <el-switch 
              v-model="form.chartShowLabel" 
              active-text="显示图表数据标签" 
              inactive-text="隐藏图表数据标签"
              active-color="#FB7299"
            />
          </el-space>
        </el-form-item>

        <!-- 3. 主题切换 -->
        <el-form-item label="界面主题">
          <el-radio-group 
            v-model="form.theme" 
            style="display: flex; gap: 20px"
          >
            <el-radio 
              label="light" 
              border 
              style="padding: 8px 20px"
            >
              浅色主题
            </el-radio>
            <el-radio 
              label="dark" 
              border 
              style="padding: 8px 20px"
            >
              深色主题
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 4. 操作按钮 -->
        <el-form-item class="form-actions">
          <el-button 
            type="primary" 
            @click="handleSave"
            :loading="isSaving"
          >
            保存设置
          </el-button>
          <el-button 
            type="default" 
            @click="handleReset"
            style="margin-left: 16px"
          >
            重置为默认值
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { ElForm, ElFormItem, ElSelect, ElOption, ElSwitch, ElRadioGroup, ElRadio, ElButton, ElMessage, ElCard } from 'element-plus';
import type { FormInstance } from 'element-plus';
import BiliHeader from '@/components/BiliHeader.vue'; // 复用头部组件
import { useSettingStore } from '@/stores/settingStore'; // 引入设置状态

// 表单实例（用于验证）
const settingFormRef = ref<FormInstance | null>(null);
// 保存加载状态
const isSaving = ref(false);
// 引入设置Store
const settingStore = useSettingStore();
// 表单数据（与Store状态同步）
const form = reactive({
  refreshInterval: 30,
  chartShowLegend: true,
  chartShowLabel: true,
  theme: 'light' as 'light' | 'dark'
});

// 组件挂载时：从Store同步数据到表单
onMounted(() => {
  form.refreshInterval = settingStore.refreshInterval;
  form.chartShowLegend = settingStore.chartShowLegend;
  form.chartShowLabel = settingStore.chartShowLabel;
  form.theme = settingStore.theme;

  // 主题生效（添加body类名，后续可在全局样式中扩展深色主题）
  document.body.className = `theme-${settingStore.theme}`;
});

// 保存设置
const handleSave = async () => {
  // 表单验证
  if (!settingFormRef.value) return;
  const valid = await settingFormRef.value.validate();
  if (!valid) return;

  // 显示加载状态
  isSaving.value = true;
  try {
    // 保存到Store（自动同步到localStorage）
    settingStore.saveSetting({
      refreshInterval: Number(form.refreshInterval), // 转为数字
      chartShowLegend: form.chartShowLegend,
      chartShowLabel: form.chartShowLabel,
      theme: form.theme
    });

    // 主题立即生效
    document.body.className = `theme-${form.theme}`;

    // 提示成功
    ElMessage({
      type: 'success',
      message: '设置保存成功！',
      duration: 1500
    });
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '设置保存失败，请重试！',
      duration: 1500
    });
    console.error('保存设置失败：', error);
  } finally {
    isSaving.value = false;
  }
};

// 重置为默认值
const handleReset = () => {
  // 重置Store
  settingStore.resetSetting();
  // 同步到表单
  form.refreshInterval = settingStore.refreshInterval;
  form.chartShowLegend = settingStore.chartShowLegend;
  form.chartShowLabel = settingStore.chartShowLabel;
  form.theme = settingStore.theme;
  // 主题生效
  document.body.className = `theme-${settingStore.theme}`;
  // 提示
  ElMessage({
    type: 'info',
    message: '已重置为默认设置！',
    duration: 1500
  });
};
</script>

<style scoped>
/* 主体容器：与dashboard保持一致的间距和宽度 */
.setting-container {
  padding: 24px 32px;
  background-color: #fafafa;
  min-height: calc(100vh - 80px); /* 减去header高度 */
}

/* 配置卡片：与dashboard的chart-card风格统一 */
.setting-card {
  border-radius: 12px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
  border: none !important;
  max-width: 800px; /* 限制卡片宽度，避免过宽 */
  margin: 0 auto; /* 水平居中 */
}

/* 卡片头部：复用dashboard的card-header样式 */
.card-header-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}
.card-header-desc {
  font-size: 14px;
  color: #999;
  margin: 0 0 24px 0;
}

/* 表单样式：增加间距，提升可读性 */
.setting-form {
  padding: 0 24px 24px 24px;
}
.form-hint {
  margin-left: 12px;
  font-size: 12px;
  color: #999;
}
.form-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 16px;
}

/* 深色主题适配（可扩展） */
.theme-dark .setting-container {
  background-color: #1e1e2e;
}
.theme-dark .card-header-title,
.theme-dark .el-form-item__label,
.theme-dark .el-radio,
.theme-dark .form-hint {
  color: #eee;
}
.theme-dark .card-header-desc {
  color: #bbb;
}
</style>