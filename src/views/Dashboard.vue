<template>
    <header>
    <bili-header />
    </header>


    <body>
      <el-row :gutter="20" class="data-card">
      <!-- 4个卡片平均分配24份栅格，每列占6份 -->
      <el-col :span="8">
        <statisticCard 
          :iconComponent="User"
          iconBgColor="#2d8cf0"
          numColor="#2d8cf0"
          :statNum="6666"
          cardTitle="用户访问量"
           />
      </el-col>

      <el-col :span="8">
        <statisticCard 
          :iconComponent="ChatDotRound"
          iconBgColor="#64d572"
          numColor="#64d572"
          :statNum="168"
          cardTitle="系统消息"
           />
      </el-col>

      <el-col :span="8">
        <statisticCard 
          :iconComponent="Goods"
          iconBgColor="#f25e43"
          numColor="#f25e43"
          :statNum="8888"
          cardTitle="商品数量"
           />
      </el-col>

    </el-row>  
    </body>

    <footer>
      <el-row :gutter="20" class="data-card">
        <el-col :span="16">
            <el-card shadow="hover">
              <div class="card-header">
                <p class="card-header-title" >日播放量趋势图</p>
                <p class="card-header-desc">近 24 小时数据</p>
              </div>
              <v-chart class="chart1" :option="lineChartOption" />
            </el-card>
            <el-card shadow="hover" >
              <div class="card-header">
                <p class="card-header-title" >热门视频 TOP5</p>
                <p class="card-header-desc">近1小时播放量排名</p>
              </div>
              <v-chart class="chart2" :option="barChartOption"  @click="handleBarClick"/>
            </el-card>
        </el-col>

        <el-col :span="8">
            <el-card shadow="hover" >
              <div class="card-header">
                <p class="card-header-title" >用户活跃度</p>
                <p class="card-header-desc">实时在线用户占比</p>
              </div>
              <v-chart class="chart3" :option="liquidChartOption" />
            </el-card>
        </el-col>
      </el-row>

        <!-- 视频详情弹窗 (Element Plus 对话框组件) -->
         <!-- close-on-click-modal="true"  点击遮罩层可关闭 -->
      <el-dialog 
        v-model="dialogVisible" 
        title="视频详情" 
        :width="300"
        :close-on-click-modal="true"  
      >
      
      <!-- 只有当selectedVideo存在时才渲染内容 -->
      <div class="video-detail-content" v-if="selectedVideo">
        <img 
          :src="selectedVideo.cover" 
          alt="视频封面" 
          class="video-cover"
        >
        <h3 class="video-title">{{ selectedVideo.title }}</h3>
        <p><span class="label">UP主：</span>{{ selectedVideo.upName }}</p>
        <p><span class="label">发布时间：</span>{{ selectedVideo.publishTime }}</p>
        <p><span class="label">播放量：</span>{{ formatNumber(selectedVideo.views) }}</p>
        <p><span class="label">弹幕数：</span>{{ formatNumber(selectedVideo.barrage) }}</p>
      </div>
      </el-dialog>

    </footer>

</template>

<script setup lang="ts">
import {ref,onMounted,watch,computed} from 'vue'
import BiliHeader from '@/components/BiliHeader.vue';
import StatisticCard from '@/components/Statistic-card.vue';
import { User,ChatDotRound,Goods } from '@element-plus/icons-vue';

import VChart from 'vue-echarts'
import {use} from 'echarts/core'
import {LineChart, BarChart} from 'echarts/charts'
import type {EChartsOption} from 'echarts'
import { GridComponent, TooltipComponent,DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import 'echarts-liquidfill';  // 必须额外引入水波纹插件

import { useChartStore } from '@/stores/chartStore';

import { graphic } from 'echarts/core';

import type { VideoItem } from '@/stores/chartStore';

use([
  LineChart,BarChart,
  GridComponent,TooltipComponent,DataZoomComponent,
  CanvasRenderer
])



// 初始化Store
const chartStore = useChartStore();

// 弹窗状态
const dialogVisible = ref(false);
const selectedVideo = ref<VideoItem | null>(null); // 严格指定类型

// 处理柱状图点击
// 处理柱状图点击（彻底修复类型错误）
const handleBarClick = (params: any) => {
  // 1. 先验证参数基础有效性
  if (params.componentType !== 'series' || typeof params.dataIndex !== 'number') {
    selectedVideo.value = null;
    dialogVisible.value = false;
    return;
  }

  // 2. 显式获取元素并判断是否存在
  const videoItem = chartStore.videoTop5[params.dataIndex];
  if (videoItem) {
    // 确认元素存在后再赋值（此时TypeScript能确定类型为VideoItem）
    selectedVideo.value = videoItem;
    dialogVisible.value = true;
  } else {
    // 元素不存在时的安全处理
    selectedVideo.value = null;
    dialogVisible.value = false;
  }
};

// 格式化数字
const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

// 折线图配置（基于Store数据动态生成）
const lineChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { 
    type: 'category',
    data: chartStore.hourlyData.map(item => item.hour)
  },
  yAxis: { type: 'value', name: '万' },
  dataZoom: [{ type: 'inside' }],
  series: [{
    type: 'line',
    data: chartStore.hourlyData.map(item => item.views),
    lineStyle: { color: '#FB7299' }
  }]
}));

// 柱状图配置
const barChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { 
    type: 'category',
    axisLabel: {
      formatter: (value: string) => value.length > 8 ? `${value.slice(0, 8)}...` : value
    },
    data: chartStore.videoTop5.map(item => item.title)
  },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar',
    data: chartStore.videoTop5.map(item => item.views),
    itemStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: '#FB7299' }, { offset: 1, color: '#FF9EBC' }]
      }
    },
    label: { show: true, position: 'top' }
  }]
}));

// 水波纹图配置
const liquidChartOption = computed(() => ({
  series: [{
    type: 'liquidFill',
    data: [chartStore.userActivity, chartStore.userActivity - 0.03],
    radius: '85%',
    color: ['rgba(251, 114, 153, 0.7)'],
    label: {
      formatter: `${(chartStore.userActivity * 100).toFixed(0)}%`,
      fontSize: 36,
      color: '#FB7299'
    }
  }]
}));

// 初始化数据
onMounted(() => {
  // 调用Store中的方法加载数据
  chartStore.fetchVideoData();
  chartStore.fetchHourlyData();

  // 定时更新活跃度（模拟实时数据）
  setInterval(() => {
    chartStore.updateActivityRate();
  }, 5000);
});

// 监听视频数据变化（可选，用于调试）
watch(
  () => chartStore.videoTop5,
  (newVal) => {
    console.log('视频数据更新:', newVal);
  },
  { deep: true }
);

</script>

<style>
.data-card{
  margin-bottom: 20px;
}

.chart1{
  width: 100%;
  height: 300px;
}

.chart2{
  width: 100%;
  height: 250px;
}

.chart3{
  width: 100%;
  height: 685px;
}

.card-header {
    padding-left: 10px;
    margin-bottom: 20px;
}

.card-header-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
}

.card-header-desc {
    font-size: 14px;
    color: #999;
}


</style>