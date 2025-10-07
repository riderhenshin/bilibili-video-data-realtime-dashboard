<template>
    <header class="header-bar">
      <!-- 左侧标题区域 -->
      <div class="header-left">
        <h1 class="main-title">B站视频数据实时监控看板</h1>
        <p class="update-time">更新时间：{{ updateTime }}</p>
      </div>

      <!-- 右侧操作区域 -->
      <div class="header-right">
        <span class="refresh-rate">
          刷新频率：{{ refreshInterval }}秒/次
        </span>

        <el-button>刷新</el-button>
        <el-button>
          进入设置页面
          <i class="settings-icon">⚙️</i>
        </el-button>
        
      </div>


    </header>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const updateTime = new Date()
const refreshInterval = 10
</script>

<style>
.header-bar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  padding: 0 24px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

/* 左侧标题样式 */
.header-left {
  display: flex;
    flex-direction: column;
    justify-content: center;
}
.main-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.update-time {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
}


</style>