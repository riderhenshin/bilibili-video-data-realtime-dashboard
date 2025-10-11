<template>
  <div class="header-bar">
    <!-- 左侧标题区域：突出品牌感+时间状态 -->
    <div class="header-left">
      <!-- 主标题：粉色高亮，加轻微阴影 -->
      <h1 class="main-title">
        B站视频数据
        <span class="highlight">实时监控看板</span>
      </h1>
      <!-- 时间+自动更新状态：带图标+闪烁指示器 -->
      <div class="update-info">
        <el-icon :size="18">
          <Timer/>
        </el-icon>
        <span class="update-time">{{ updateTime }}</span>
        <span class="auto-indicator"></span>
        <span class="auto-text">自动更新中</span>
      </div>
    </div>

    <!-- 右侧操作区域：主次按钮区分+动态反馈 -->
    <div class="header-right"> 
      <!-- 刷新按钮：主色+加载状态+图标 -->
      <el-button 
        type="primary" 
        :icon="Refresh" 
        :loading="isRefreshing"
        @click="handleRefresh"
        class="refresh-btn"
      >
        刷新
      </el-button>
      
      <!-- 设置按钮：默认样式+图标，次要操作 -->
      <el-button 
        type="primary" 
        :icon="Setting"
        @click="handleGoSettings"
        class="settings-btn"
      >
        设置
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElButton, ElIcon, ElMessage } from 'element-plus';
import { Refresh, Setting, Timer } from '@element-plus/icons-vue';
import { useChartStore } from '@/stores/chartStore';

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
    // 1. 重新获取所有核心数据
    // await chartStore.fetchAllData();
    
    // 2. 同时刷新用户活跃度
    // await chartStore.fetchUserActivity();
    
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

// 4. 跳转设置页
const handleGoSettings = () => {
  router.push('/setting');
};

// 5. 实时更新时间：组件挂载时启动定时器，销毁时清除
onMounted(() => {
  // 初始赋值
  updateTime.value = formatTime();
  // 每秒更新一次时间
  timeTimer = window.setInterval(() => {
    updateTime.value = formatTime();
  }, 1000);
});

// 6. 清除定时器：避免内存泄漏
onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer);
});
</script>

<style scoped>
/* 头部整体布局：高度优化（80px更紧凑），阴影弱化更自然 */
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 0 32px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.01);
}

/* 左侧标题区域：间距调整，避免拥挤 */
.header-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px; /* 标题与时间的间距 */
}

/* 主标题：字体加粗，粉色高亮部分突出 */
.main-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}
.highlight {
  color: #FB7299;
  /*每个阴影都有两到三个 <length> 参数，以及一个与阴影颜色相关的 <color> 参数。前两个 <length> 参数，是以“文字中心”为原点的坐标轴，分别为 x 轴 <offset-x> 和 y 轴 <offset-y> 的值；如果有第三个 <length> 参数，则第三个数值为形成阴影效果的半径的数值 <blur-radius>。*/ 
  text-shadow: 0 1px 2px rgba(251, 114, 153, 0.2);
}

/* 时间+自动更新状态：字体统一14px，颜色浅灰 */
.update-info {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  gap: 8px; /* 元素间距 */
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

/* 右侧操作区域：按钮间距统一，避免杂乱 */
.header-right {
  display: flex;
  align-items: center;
  gap: 20px; /* 频率文字与按钮、按钮之间的间距 */
}

/* 按钮样式优化：hover时轻微缩放，增强交互感 */
.refresh-btn, .settings-btn {
  transition: all 0.2s ease;
}
.refresh-btn:hover, .settings-btn:hover {
  transform: scale(1.05); /*  hover时放大5% */
}

</style>