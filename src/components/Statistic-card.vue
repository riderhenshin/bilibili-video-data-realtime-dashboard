<template>
  <el-card 
    shadow="hover" 
    body-class="card-body"
    class="stat-card"
    :style="`border-radius: ${cardRadius}px;`"
  >
    <!-- 图标区域 -->
    <div class="card-icon-wrapper" :style="`background-color: ${iconBgColor};`">
      <el-icon class="card-icon">
        <component :is="iconComponent" />
      </el-icon>
    </div>

    <!-- 内容区域（数字+标题+状态） -->
    <div class="card-content">

      <!-- 卡片标题 -->
      <div>
        <div class="card-title" :style="`color: ${titleColor};`">
          {{ cardTitle }}
        </div>
        <!-- 数字+单位 -->
        <count-up
          :end="statNum"
          :prefix="prefix"
          :suffix="suffix"
          :decimal-places="decimalPlaces"
          :duration="1.5"
          :text-style="{ fontSize: numSize, color: numColor }"
        />
      </div>
      
      <!-- 状态提示（增长/下降） -->
      <div v-if="showGrowth" class="card-growth" :class="growthType === Top ? 'growth-up' : 'growth-down'">
        <el-icon :size="25" >
          <component :is="growthType" />
        </el-icon>
        <span>{{ growthRate }}%</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import CountUp from './CountUp.vue';
import type { Component } from 'vue';
import {Top, Bottom} from '@element-plus/icons-vue';
// 定义props，增加状态提示、单位等配置
const props = defineProps<{
  iconComponent: Component; // 图标组件
  iconBgColor: string;      // 图标背景色
  numColor: string;         // 数字颜色
  numSize?: string;         // 数字大小（默认28px）
  statNum: number;          // 目标数字
  cardTitle: string;        // 卡片标题
  titleColor?: string;      // 标题颜色（默认#666）
  prefix?: string;          // 数字前缀（如“”）
  suffix?: string;          // 数字后缀（如“万”“%”）
  decimalPlaces?: number;   // 小数位数
  showGrowth?: boolean;     // 是否显示增长状态
  growthType?: Component;// 增长类型（up=上升，down=下降）
  growthRate?: number;      // 增长率（如5.2）
  cardRadius?: number;      // 卡片圆角（默认12px）
}>();

// 默认值处理
const {
  numSize = '28px',
  titleColor = '#666',
  cardRadius = 12,
  showGrowth = false,
  growthRate = 0,
} = props;
</script>

<style scoped>
/* 卡片整体样式：hover放大+柔和阴影 */
.stat-card {
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: none !important; /* 去掉Element默认边框 */
}
.stat-card:hover {
  transform: scale(1.03); /* hover放大3% */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

/* 卡片内部布局：横向排列，间距20px */
:deep(.card-body) {
  display: flex;
  align-items: center;
  padding: 24px !important; /* 加大内边距，更舒展 */
  gap: 20px;
  height: 100%;
}

/* 图标区域：圆形背景+居中 */
.card-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%; /* 圆形图标背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}
.stat-card:hover .card-icon-wrapper {
  transform: rotate(5deg); /* hover时图标轻微旋转 */
}
.card-icon {
  font-size: 32px;
  color: #fff; /* 图标白色，与背景对比 */
}

/* 内容区域：纵向排列，占满剩余空间 */
.card-content {
  flex: 1;
  display: flex;
  gap: 8px; /* 内部元素间距8px */
}

/* 标题样式：加粗，更醒目 */
.card-title {
  font-size: 16px;
  font-weight: 700;
}

/* 状态提示样式：绿↑/红↓ */
.card-growth {
  display: flex;
  align-items: end;
  gap: 4px;
  font-size: 20px;
  padding-bottom: 5px;
}
.growth-up {
  color: #67c23a; /* 增长-绿色 */
}
.growth-down {
  color: #f56c6c; /* 下降-红色 */
}

</style>