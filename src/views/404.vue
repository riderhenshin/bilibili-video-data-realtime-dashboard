<template>
  <div class="error-page">
    <!-- 顶部导航栏（保持与B站一致的品牌感） -->
    <div class="nav-bar">
      <div class="logo">
        <span class="bilibili-icon">📺</span>
        <span class="logo-text">Bilibili</span>
      </div>
      <div class="nav-links">
        <router-link to="/">首页</router-link>
        <router-link to="/video">热门视频</router-link>
        <router-link to="/live">直播</router-link>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="content-container">
      <!-- B站风格插画 -->
      <div class="illustration">
        <img src="@/assets/image/404.png" alt="404插画" class="error-image">
      </div>

      <!-- 错误信息与引导 -->
      <div class="error-info">
        <h1 class="error-code">404</h1>
        <p class="error-message">你访问的页面迷路啦～</p>
        <p class="error-tip">可能是输入错误或页面已被删除</p>
        
        <!-- 返回首页按钮（B站品牌粉风格） -->
        <router-link to="/" class="return-btn">
          返回B站数据仪表盘
          <span class="arrow-icon">→</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 无需额外逻辑，仅需路由跳转
</script>

<style scoped>
/* 整体布局 */
.error-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #FB7299 0%, #FFEBEF 100%);
  font-family: '微软雅黑', sans-serif;
}

/* 顶部导航栏 */
.nav-bar {
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #FB7299;
}
.bilibili-icon {
  font-size: 24px;
  color: #FB7299;
}
.nav-links {
  display: flex;
  gap: 24px;
}
.nav-links a {
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}
.nav-links a:hover {
  color: #FB7299;
}

/* 主内容区 */
.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

/* 插画部分 */
.illustration {
  margin-bottom: 32px;
}
.error-image {
  max-width: 600px;
  width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* 错误信息 */
.error-info {
  text-align: center;
  color: #333;
}
.error-code {
  font-size: 120px;
  line-height: 1;
  color: #FB7299;
  margin-bottom: 16px;
  text-shadow: 0 4px 8px rgba(251, 114, 153, 0.2);
}
.error-message {
  font-size: 24px;
  margin-bottom: 8px;
}
.error-tip {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
}

/* 返回按钮（B站品牌粉风格） */
.return-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background: #FB7299;
  color: white;
  text-decoration: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}
.return-btn:hover {
  background: #E05678;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(251, 114, 153, 0.3);
}
.return-btn .arrow-icon {
  margin-left: 8px;
  font-size: 20px;
  transition: transform 0.3s;
}
.return-btn:hover .arrow-icon {
  transform: translateX(4px);
}

</style>