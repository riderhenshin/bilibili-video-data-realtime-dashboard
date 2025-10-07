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
                <p class="card-header-desc">热门视频 TOP5</p>
              </div>
              <v-chart class="chart2" :option="barChartOption"  @click="handleBarClick"/>
            </el-card>
        </el-col>

        <el-col :span="8">
            <el-card shadow="hover" >
              <div class="card-header">
                <p class="card-header-title" >用户活跃度</p>
                <p class="card-header-desc">用户活跃度</p>
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
      
        <div class="video-detail-content">
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
import {ref} from 'vue'
import BiliHeader from '@/components/BiliHeader.vue';
import StatisticCard from '@/components/Statistic-card.vue';
import { User,ChatDotRound,Goods } from '@element-plus/icons-vue';

import VChart from 'vue-echarts'
import {use} from 'echarts/core'
import {LineChart, BarChart} from 'echarts/charts'
import { GridComponent, TooltipComponent,DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import 'echarts-liquidfill';  // 必须额外引入水波纹插件

import { useChartStore } from '@/stores/chartStore';

import { graphic } from 'echarts/core';


use([
  LineChart,BarChart,
  GridComponent,TooltipComponent,DataZoomComponent,
  CanvasRenderer
])

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
  { 
    title: 'Vue3+ECharts数据可视化实战', 
    upName: '前端技术栈', 
    publishTime: '2023-09-20',
    views: 856321,
    barrage: 12543,
    cover: 'https://picsum.photos/300/200?random=1'
  },
  { 
    title: 'TypeScript从入门到精通', 
    upName: '编程学习营', 
    publishTime: '2023-09-18',
    views: 652147,
    barrage: 8965,
    cover: 'https://picsum.photos/300/200?random=2'
  },
  { 
    title: 'B站视频数据分析方法', 
    upName: '数据可视化达人', 
    publishTime: '2023-09-19',
    views: 521478,
    barrage: 6321,
    cover: 'https://picsum.photos/300/200?random=3'
  },
  { 
    title: '前端工程化最佳实践', 
    upName: '工程化专家', 
    publishTime: '2023-09-17',
    views: 412587,
    barrage: 5689,
    cover: 'https://picsum.photos/300/200?random=4'
  },
  { 
    title: 'Pinia状态管理完全指南', 
    upName: 'Vue技术圈', 
    publishTime: '2023-09-16',
    views: 325698,
    barrage: 4125,
    cover: 'https://picsum.photos/300/200?random=5'
  }
]);

const userActivityRate = ref(0.68);
const showVideoDetail = ref(false);

// 弹窗控制变量
const dialogVisible = ref(false);
const selectedVideo = ref<any>({});

// 处理柱状图点击事件
const handleBarClick = (params: any) => {
  // 只处理系列数据点击
  if (params.componentType === 'series') {
    // 根据点击索引获取对应视频数据
    selectedVideo.value = videoTop5.value[params.dataIndex];
    // 显示弹窗
    dialogVisible.value = true;
  }
};

// 格式化数字（添加千位分隔符）
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN');
};

// 折线图配置
const lineChartOption = ref({
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
       // 格式化提示框内容，params为当前鼠标指向的数据信息数组
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