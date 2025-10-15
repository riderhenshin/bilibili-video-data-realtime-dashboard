<template>
  <el-card body-class="header-bar" shadow="hover">
    <div class="header-left">
      <div class="main-title">
        B站视频数据
        <span class="highlight">实时监控看板</span>
      </div>
      <div class="update-info">
        <el-icon>
          <Timer />
        </el-icon>
        <span class="update-time">{{ updateTime }}</span>
        <span class="auto-indicator"></span>
        <span class="auto-text">自动更新中</span>
      </div>
    </div>
    <div class="header-right">
      <el-button
        type="primary"
        :icon="Refresh"
        :loading="isRefreshing"
        @click="handleRefresh"
        class="refresh-btn"
      >
      刷新
      </el-button>
      
      <el-button
        type="primary"
        :icon="Sunny" 
        circle 
        title="切换浅色主题"
        @click="toggleTheme('light')"
        />
      <el-button 
        type="primary" 
        :icon="Moon" 
        circle 
        title="切换深色主题"
        @click="toggleTheme('dark')"
      />
    </div>
  </el-card>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted,watch } from 'vue';
import { useRouter } from 'vue-router';
import { Refresh, Timer, Moon, Sunny } from '@element-plus/icons-vue';
import { useChartStore } from '@/stores/chartStore';
import { ElMessage } from 'element-plus';
import { useThemeStore} from '@/stores/themeStore';

const themeStore = useThemeStore()
const currentTheme = ref<'light' | 'dark'>(themeStore.currentTheme)

// 主题切换
const toggleTheme = (theme: 'light' | 'dark') => {
  themeStore.setTheme(theme);
  currentTheme.value = theme;
  applyTheme(theme);
  ElMessage.success(`已切换至${theme === 'light' ? '浅色' : '深色'}主题`);
};

// 应用主题到页面
const applyTheme = (theme: 'light' | 'dark') => {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark-theme');
    html.classList.remove('light-theme');
  } else {
    html.classList.add('light-theme');
    html.classList.remove('dark-theme');
  }
};

// 监听主题变化
watch(
  () => themeStore.currentTheme,
  (newTheme) => {
    currentTheme.value = newTheme;
    applyTheme(newTheme);
  }
);


// 1. 响应式状态：解决“静态数据”问题
const updateTime = ref(''); // 实时更新的时间
const isRefreshing = ref(false); // 刷新按钮加载状态
const router = useRouter();
let timeTimer: number | null = null; // 定时器实例，用于销毁

const chartStore = useChartStore()

// 2. 时间格式化：统一格式为“YYYY-MM-DD HH:mm:ss”
const formatTime = () => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-'); // 把“/”替换为“-”，更符合习惯
};

// 3. 刷新按钮
// 为了避免加载太快，添加一个最小延迟时间来确保加载状态至少显示一段时间
// 即使数据请求快速完成。这样既能保持真实的加载状态，又能让用户清晰感知到刷新操作正在进行。
const handleRefresh = async () => {
  if (isRefreshing.value) return; // 防止重复点击

    // 定义最小加载时间（毫秒），可根据需要调整
  const MIN_LOADING_TIME = 500;
  console.log(`最小加载时间：${MIN_LOADING_TIME}ms`)
  const startTime = Date.now();

  isRefreshing.value = true;
  try{
    // 1. 并行获取数据（如果接口之间无依赖）
    await Promise.all([
      chartStore.fetchAllData(),
      chartStore.fetchUserActivity()
    ]);
    
    // 2. 计算需要补充的延迟时间
    const elapsedTime = Date.now() - startTime;
    console.log(`实际重新获取数据所耗时间：${elapsedTime}ms`)
    const delayTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
    
    // 3. 如果实际请求时间短于最小加载时间，则补充延迟
    if (delayTime > 0) {
      await new Promise(resolve => setTimeout(resolve, delayTime));
    }
    
    ElMessage.success('数据已成功刷新');
  }catch(error){
    console.error('数据刷新失败：',error);
  } finally {
    isRefreshing.value = false;
  }
};

// 5. 实时更新时间：组件挂载时启动定时器，销毁时清除
onMounted(() => {
  // 初始赋值
  updateTime.value = formatTime();
  // 每秒更新一次时间
  timeTimer = window.setInterval(() => {
    updateTime.value = formatTime();
  }, 1000);

  // 初始化主题
  applyTheme(currentTheme.value);
});

// 6. 清除定时器：避免内存泄漏
onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer);
});
</script>

<style scoped>
:deep(.header-bar){
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
}
.main-title{
  font-size:20px;
  font-weight: 700;
}
.highlight{
  color:#FB7299;
}
.update-info{
  display: flex;
  align-items: center;
  padding: 5px 0 0 0;
  color: #666;
  gap: 8px;
}
.auto-text {
  font-size: 12px;
  color: #999;
}
/* 自动更新指示器：粉色小圆点，闪烁动画 */
.auto-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #FB7299;
  opacity: 0.5;
  animation: blink 1.2s infinite alternate
}
@keyframes blink {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

/* 按钮样式优化：hover时轻微缩放，增强交互感 */
.refresh-btn{
  transition: all 0.2s ease;
}
.refresh-btn:hover{
  transform: scale(1.05); /*  hover时放大5% */
}
</style>