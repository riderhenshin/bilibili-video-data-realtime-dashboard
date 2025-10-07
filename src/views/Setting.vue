<template>
  <div class="chart-container">
    <!-- 左侧图表区域 -->
    <div class="left-charts">
      <!-- 日播放量趋势图 -->
      <div class="chart-card">
        <h3>日播放量趋势（近24小时）</h3>
        <v-chart 
          :option="lineChartOption" 
          :style="{ width: '100%', height: '300px' }"
          autoresize
        />
      </div>

      <!-- 热门视频TOP5 -->
      <div class="chart-card">
        <h3>热门视频TOP5</h3>
        <v-chart 
          :option="barChartOption" 
          :style="{ width: '100%', height: '250px' }"
          autoresize
          @click="handleBarClick"
        />
        
        <!-- 视频详情弹窗 -->
        <div v-if="showVideoDetail" class="video-detail">
          <h4>{{ selectedVideo.title }}</h4>
          <p>UP主: {{ selectedVideo.upName }}</p>
          <p>发布时间: {{ selectedVideo.publishTime }}</p>
        </div>
      </div>
    </div>

    <!-- 右侧水波纹图 -->
    <div class="right-chart">
      <div class="chart-card">
        <h3>用户活跃度</h3>
        <v-chart 
          :option="liquidChartOption" 
          :style="{ width: '100%', height: '550px' }"
          autoresize
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import  VChart  from 'vue-echarts';
import { use } from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import {
  TooltipComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import 'echarts-liquidfill';

// 注册必要的echarts组件
use([
  LineChart, BarChart,
  TooltipComponent, GridComponent, DataZoomComponent,
  CanvasRenderer
]);

// 组件内直接管理数据（不使用store）
const hourlyData = ref([
  { hour: '0', views: 120 }, { hour: '1', views: 80 },
  { hour: '2', views: 50 }, { hour: '3', views: 30 },
  { hour: '4', views: 20 }, { hour: '5', views: 40 },
  { hour: '6', views: 90 }, { hour: '7', views: 150 },
  { hour: '8', views: 220 }, { hour: '9', views: 280 },
  { hour: '10', views: 320 }, { hour: '11', views: 350 },
  { hour: '12', views: 420 }, { hour: '13', views: 390 },
  { hour: '14', views: 360 }, { hour: '15', views: 400 },
  { hour: '16', views: 480 }, { hour: '17', views: 550 },
  { hour: '18', views: 620 }, { hour: '19', views: 700 },
  { hour: '20', views: 680 }, { hour: '21', views: 600 },
  { hour: '22', views: 450 }, { hour: '23', views: 280 }
]);

const videoTop5 = ref([
  { title: 'Vue3实战教程', upName: '技术胖', publishTime: '2023-09-15', views: 580000 },
  { title: 'ECharts数据可视化', upName: '前端开发', publishTime: '2023-09-16', views: 420000 },
  { title: 'TypeScript入门到精通', upName: '编程学习', publishTime: '2023-09-14', views: 350000 },
  { title: 'B站数据分析报告', upName: '数据可视化', publishTime: '2023-09-17', views: 280000 },
  { title: '前端工程化最佳实践', upName: '工程化专家', publishTime: '2023-09-13', views: 220000 }
]);

const userActivityRate = ref(0.68);
const selectedVideo = ref<any>({});
const showVideoDetail = ref(false);

// 折线图配置
const lineChartOption = ref({
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const param = params[0];
      const prev = param.dataIndex > 0 ? (hourlyData.value[param.dataIndex - 1]?.views ?? 0) : 0;
      const rate = ((param.value - prev) / prev * 100).toFixed(1);
      return `${param.name}时<br>播放量: ${param.value}万<br>环比: ${rate}%`;
    }
  },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: hourlyData.value.map(item => item.hour) },
  yAxis: { type: 'value', name: '万' },
  dataZoom: [{ type: 'inside' }],
  series: [{
    type: 'line',
    data: hourlyData.value.map(item => item.views),
    lineStyle: { color: '#FB7299' },
    animationDuration: 1500
  }]
});

// 柱状图配置
const barChartOption = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { 
    type: 'category',
    axisLabel: {
      formatter: (value: string) => value.length > 8 ? value.slice(0, 8) + '...' : value
    },
    data: videoTop5.value.map(item => item.title)
  },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar',
    data: videoTop5.value.map(item => item.views),
    itemStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: '#FB7299' }, { offset: 1, color: '#FF9EBC' }]
      }
    },
    label: { show: true, position: 'top' },
    animationDuration: 1500
  }]
});

// 水波纹图配置
const liquidChartOption = ref({
  series: [{
    type: 'liquidFill',
    data: [userActivityRate.value, userActivityRate.value - 0.03],
    radius: '85%',
    color: ['rgba(251, 114, 153, 0.7)'],
    label: {
      formatter: `${(userActivityRate.value * 100).toFixed(0)}%`,
      fontSize: 36,
      color: '#FB7299'
    },
    waveAnimation: true
  }]
});

// 柱状图点击事件
const handleBarClick = (params: any) => {
  if (params.componentType === 'series') {
    selectedVideo.value = videoTop5.value[params.dataIndex];
    showVideoDetail.value = true;
    setTimeout(() => showVideoDetail.value = false, 3000);
  }
};

</script>

<style scoped>
.chart-container {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.left-charts {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-chart {
  flex: 1;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
}

.chart-card h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
}

.video-detail {
  position: absolute;
  right: 20px;
  top: 20px;
  background: white;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 200px;
}

@media (max-width: 1024px) {
  .chart-container {
    flex-direction: column;
  }
}
</style>
