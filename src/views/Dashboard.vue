<template>
    <header>
    <bili-header />
    </header>


    <body>
      <el-row :gutter="20" class="statistic-card">
      <!-- 4个卡片平均分配24份栅格，每列占6份 -->
      <el-col :span="6">
        <statisticCard 
          :icon-component="VideoPlay"
          icon-bg-color="#FB7299"
          num-color="#FB7299"
          :stat-num="125.8"
          suffix="万"
          :decimal-places="1"
          cardTitle="实时播放量"
          :show-growth="true"
          :growth-type="Top"
          :growth-rate="5.2"
           />
      </el-col>

      <el-col :span="6">
        <statisticCard 
          :icon-component="ChatDotRound"
          icon-bg-color="#00A1D6"
          num-color="#00A1D6"
          :stat-num="3.6"
          suffix="万"
          :decimal-places="1"
          cardTitle="实时弹幕数"
          :show-growth="true"
          :growth-type="Top"
          :growth-rate="8.7"
           />
      </el-col>

      <el-col :span="6">
        <statisticCard 
          :icon-component="Upload"
          icon-bg-color="#f56c6c"
          num-color="#f56c6c"
          :stat-num="8923"
          suffix="个"
          :decimal-places="0"
          cardTitle="日投稿视频量"
          :show-growth="true"
          :growth-type="Bottom"
          :growth-rate="2.3"
           />
      </el-col>

      <el-col :span="6">
        <statisticCard 
          :icon-component="User"
          icon-bg-color="#67c23a"
          num-color="#67c23a"
          :stat-num="68.5"
          suffix="%"
          :decimal-places="1"
          cardTitle="用户活跃度"
           />
      </el-col>

    </el-row>  
    </body>

    <footer>
      <!-- 底部图表区：三列栅格布局 -->
      <el-row :gutter="24" class="chart-row">
        <!-- 第一列：日播放量趋势图 + 热门视频TOP5 -->
        <el-col :span="6" class="chart-col">
          <!-- 日播放量趋势图 -->
          <el-card shadow="hover" class="chart-card">
            <div class="card-header">
              <p class="card-header-title">日播放量趋势图</p>
              <p class="card-header-desc">近24小时数据</p>
            </div>
            <v-chart class="chart" :option="lineChartOption" />
          </el-card>

          <!-- 热门视频TOP5 -->
          <el-card shadow="hover" class="chart-card">
            <div class="card-header">
              <p class="card-header-title">
                热门视频TOP5
                <span v-if="currentCategory" class="category-tag">{{ currentCategory }}</span>
              </p>
              <p class="card-header-desc">近1小时播放量</p>
            </div>
            <v-chart class="chart" :option="barChartOption" @click="handleBarClick" />
          </el-card>
        </el-col>

        <!-- 第二列：中国地图（核心突出） -->
        <el-col :span="10" class="chart-col">
          <el-card shadow="hover" class="chart-card map-card">
            <div class="card-header">
              <p class="card-header-title">用户地域分布</p>
              <p class="card-header-desc">
                <el-select 
                  v-model="selectedMapCategory" 
                  placeholder="选择分区" 
                  size="mini"
                  @change="handleMapCategoryChange"
                >
                  <el-option label="全部分区" value="" />
                  <el-option label="生活区" value="生活" />
                  <el-option label="游戏区" value="游戏" />
                  <el-option label="知识区" value="知识" />
                  <el-option label="动漫区" value="动漫" />
                  <el-option label="科技区" value="科技" />
                </el-select>
              </p>
            </div>
            <div class="map-container">
              <v-chart class="map-chart" :option="mapChartOption" @click="handleMapClick" />
              <!-- 地图点击弹窗：B站特色面板 -->
              <el-popover
                v-model:visible="mapPopoverVisible"
                :width="300"
                trigger="manual"
                placement="right"
              >
                <div class="map-popover">
                  <div class="province-header">
                    <span class="province-name">{{ currentProvince }}</span>
                    <span class="region-tag" v-if="regionTag">{{ regionTag }}</span>
                  </div>
                  <div class="province-stats">
                    <div class="stat-item">
                      <span class="stat-label">用户占比</span>
                      <span class="stat-value">{{ provinceStats.userRatio }}%</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">投稿量</span>
                      <span class="stat-value">{{ formatNumber(provinceStats.uploadCount) }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">弹幕量</span>
                      <span class="stat-value">{{ formatNumber(provinceStats.barrageCount) }}</span>
                    </div>
                  </div>
                  <div class="top-video">
                    <p class="top-title">TOP1 视频</p>
                    <div class="video-preview" v-if="provinceTopVideo">
                      <img :src="provinceTopVideo.cover" alt="视频封面" class="video-cover">
                      <p class="video-title">{{ provinceTopVideo.title.slice(0, 15) }}...</p>
                    </div>
                  </div>
                </div>
              </el-popover>
            </div>
          </el-card>
        </el-col>

        <!-- 第三列：水波纹图 + 分区占比饼图 -->
        <el-col :span="8" class="chart-col">
          <!-- 水波纹图（用户活跃度） -->
          <el-card shadow="hover" class="chart-card">
            <div class="card-header">
              <p class="card-header-title">用户活跃度</p>
              <p class="card-header-desc">实时在线用户占比</p>
            </div>
            <v-chart class="chart" :option="liquidChartOption" />
          </el-card>

          <!-- 分区占比饼图 -->
          <el-card shadow="hover" class="chart-card">
            <div class="card-header">
              <p class="card-header-title">视频分区播放量占比</p>
              <p class="card-header-desc">近24小时数据</p>
            </div>
            <v-chart class="chart" :option="pieChartOption" @click="handlePieClick" />
          </el-card>
        </el-col>
      </el-row>

      <!-- 视频详情弹窗 -->
      <el-dialog 
        v-model="dialogVisible" 
        title="视频详情" 
        :width="300"
        :close-on-click-modal="true"
      >
        <div class="video-detail-content" v-if="selectedVideo">
          <img :src="selectedVideo.cover" alt="视频封面" class="video-cover">
          <h3 class="video-title">{{ selectedVideo.title }}</h3>
          <p><span class="label">UP主：</span>{{ selectedVideo.upName }}</p>
          <p><span class="label">分区：</span>{{ selectedVideo.category }}</p>
          <p><span class="label">播放量：</span>{{ formatNumber(selectedVideo.views) }}</p>
        </div>
      </el-dialog>

    </footer>

</template>

<script setup lang="ts">
import {ref,onMounted,watch,computed} from 'vue'
import BiliHeader from '@/components/BiliHeader.vue';
import StatisticCard from '@/components/Statistic-card.vue';
import { User,ChatDotRound,Goods, VideoPlay,Top, Bottom, Upload } from '@element-plus/icons-vue';
import VChart from 'vue-echarts'
import {use,registerMap} from 'echarts/core'
import {LineChart, BarChart,PieChart,MapChart} from 'echarts/charts'
import type {EChartsOption} from 'echarts'
import { GridComponent, TooltipComponent,DataZoomComponent,LegendComponent, VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import 'echarts-liquidfill';  // 必须额外引入水波纹插件
import chinaMap from '@/assets/map/china.ts'; 
import { useChartStore } from '@/stores/chartStore';

import { graphic } from 'echarts/core';

import type { VideoItem, ProvinceData, CategoryData } from '@/stores/chartStore';

use([
  LineChart,BarChart,PieChart,MapChart,
  GridComponent,TooltipComponent,DataZoomComponent,LegendComponent, VisualMapComponent,
  CanvasRenderer
])

// 注册中国地图
registerMap('china', chinaMap);

// 初始化Store
const chartStore = useChartStore();

// 弹窗状态
const dialogVisible = ref(false);
const selectedVideo = ref<VideoItem | null>(null); // 严格指定类型

const currentCategory = ref(''); // 选中的分区（饼图联动）
const selectedMapCategory = ref(''); // 地图分区筛选
const mapPopoverVisible = ref(false);
const currentProvince = ref('');
const regionTag = ref(''); // 地域特色标签（如“弹幕大省”）
const provinceStats = ref({ userRatio: 0, uploadCount: 0, barrageCount: 0 });
const provinceTopVideo = ref<VideoItem | null>(null);


// 1. 饼图点击：筛选TOP5视频
const handlePieClick = (params: any) => {
  if (params.componentType === 'series' && params.name) {
    currentCategory.value = params.name === '全部' ? '' : params.name;
  }
};

// 2. 地图点击：显示省份详情
const handleMapClick = (params: any) => {
  if (params.componentType === 'series' && params.name) {
    currentProvince.value = params.name;
    // 从Store获取省份数据
    const provinceData = chartStore.provinceData.find(item => item.province === params.name);
    if (provinceData) {
      // 提取省份统计数据
      provinceStats.value = {
        userRatio: provinceData.userRatio,
        uploadCount: provinceData.uploadCount,
        barrageCount: provinceData.barrageCount
      };
      // 地域特色标签
      regionTag.value = getRegionTag(params.name);
      // TOP1视频
      provinceTopVideo.value = provinceData.videos
        .sort((a, b) => b.views - a.views)[0] || null;
      // 显示弹窗
      mapPopoverVisible.value = true;
    }
  }
};

// 3. 地图分区筛选变化
const handleMapCategoryChange = () => {
  // 重新计算地图数据（根据选中的分区）
  // 1. 显式确保series是数组且非空
  const series = mapChartOption.value.series as echarts.SeriesOption[];
  if (series[0] && series.length > 0) {
    series[0].data = getMapDataByCategory();
  }
};

// 4. 柱状图点击：显示视频详情
const handleBarClick = (params: any) => {
  if (params.componentType === 'series' && typeof params.dataIndex === 'number') {
    const filteredVideos = getFilteredVideos();
    const video = filteredVideos[params.dataIndex];
    if (video) {
      selectedVideo.value = video;
      dialogVisible.value = true;
    }
  }
};

// 工具函数：格式化数字
const formatNumber = (num: number): string => {
  return num >= 10000 ? `${(num / 10000).toFixed(1)}万` : num.toLocaleString();
};

// 工具函数：获取地域特色标签
const getRegionTag = (province: string): string => {
  type TagMapKey = '广东' | '浙江' | '北京' | '上海' | '四川' | '江苏';
  const tagMap = {
    '广东': '弹幕大省',
    '浙江': '游戏强省',
    '北京': '知识高地',
    '上海': '总部所在地',
    '四川': '动漫之乡',
    '江苏': '科技先锋'
  };
  return tagMap[province as TagMapKey] || '活跃地区';
};

// 工具函数：按分区筛选视频
const getFilteredVideos = (): VideoItem[] => {
  return currentCategory.value 
    ? chartStore.videoTop5.filter(item => item.category === currentCategory.value)
    : chartStore.videoTop5;
};

// 工具函数：按分区获取地图数据
const getMapDataByCategory = () => {
  if (!selectedMapCategory.value) {
    return chartStore.provinceData.map(item => ({
      name: item.province,
      value: item.totalViews
    }));
  }
  // 按选中分区筛选地图数据
  return chartStore.provinceData.map(item => ({
    name: item.province,
    value: item.categoryViews[selectedMapCategory.value] || 0
  }));
};

// 图表配置
const lineChartOption = computed((): EChartsOption => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '5%', right: '5%', bottom: '5%', containLabel: true },
  xAxis: { type: 'category', data: chartStore.hourlyData.map(item => item.hour) },
  yAxis: { type: 'value', name: '万' },
  series: [{
    type: 'line',
    data: chartStore.hourlyData.map(item => item.views),
    lineStyle: { color: '#FB7299' },
    areaStyle: { 
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(251, 114, 153, 0.3)' },
        { offset: 1, color: 'rgba(251, 114, 153, 0)' }
      ])
    }
  }]
}));

const barChartOption = computed((): EChartsOption => {
  const filtered = getFilteredVideos();
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: '5%', right: '5%', bottom: '10%', containLabel: true },
    xAxis: { 
      type: 'category',
      axisLabel: { formatter: (v: string) => v.length > 6 ? `${v.slice(0,6)}...` : v }
    },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: filtered.map(item => item.views),
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#FB7299' },
          { offset: 1, color: '#FF9EBC' }
        ])
      },
      label: { show: true, position: 'top', formatter: (p: any) => formatNumber(p.value) }
    }]
  };
});

const pieChartOption = computed((): EChartsOption => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, left: 'center', textStyle: { fontSize: 12 } },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    data: [
      { name: '全部', value: chartStore.categoryData.reduce((s, i) => s + i.value, 0) },
      ...chartStore.categoryData
    ],
    itemStyle: {
      color: (p: any) => {
        type ColorKey = '生活' | '游戏' | '知识' | '动漫' | '科技';
        const colors = { '生活': '#FB7299', '游戏': '#00A1D6', '知识': '#67c23a', '动漫': '#FF9F43', '科技': '#48dbfb' };
        return colors[p.name as ColorKey] || '#eee';
      }
    }
  }]
}));

const liquidChartOption = computed(() => ({
  series: [{
    type: 'liquidFill',
    data: [chartStore.userActivity, chartStore.userActivity - 0.03],
    radius: '80%',
    color: ['rgba(251, 114, 153, 0.7)'],
    itemStyle: { borderColor: '#FB7299', borderWidth: 2 },
    label: {
      formatter: `${(chartStore.userActivity * 100).toFixed(0)}%`,
      fontSize: 36,
      color: '#FB7299'
    }
  }]
}));

const mapChartOption = computed((): EChartsOption => ({
  tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}: ${formatNumber(p.value)}` },
  visualMap: {
    min: 100000,
    max: 1000000,
    inRange: {
      color: ['rgba(0, 161, 214, 0.3)', 'rgba(0, 161, 214, 0.6)', 'rgba(251, 114, 153, 0.6)', 'rgba(251, 114, 153, 0.9)']
    },
    text: ['高', '低'],
    calculable: true
  },
  series: [{
    type: 'map',
    map: 'china',
    data: getMapDataByCategory(),
    label: { show: true, fontSize: 10 },
    itemStyle: { areaColor: '#f5f5f5', borderColor: '#fff' },
    // 叠加B站小电视图标（核心省份）
    markPoint: {
      symbol: 'image://https://picsum.photos/30/30', // 替换为B站小电视图标
      symbolSize: 30,
      data: [
        { name: '广东', value: '热门', xAxis: 125, yAxis: 25 },
        { name: '浙江', value: '热门', xAxis: 118, yAxis: 30 },
        { name: '上海', value: '热门', xAxis: 121, yAxis: 31 }
      ]
    }
  }]
}));

// 初始化数据
onMounted(() => {
  chartStore.fetchAllData(); // 统一请求所有数据
  chartStore.startUpdateActivity();
});

</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

/* 三列栅格布局 */
.chart-row {
  margin-top: 24px;
}
.chart-col {
  display: flex;
  flex-direction: column;
  gap: 24px; /* 列内图表间距 */
}

/* 统一图表卡片样式 */
.chart-card {
  border-radius: 12px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
  border: none !important;
  flex: 1; /* 卡片高度自适应列高 */
  display: flex;
  flex-direction: column;
}
.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
}
.card-header-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #333;
}
.card-header-desc {
  font-size: 12px;
  color: #999;
  margin: 4px 0 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.category-tag {
  font-size: 12px;
  color: #FB7299;
  background: rgba(251, 114, 153, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
}

/* 图表尺寸 */
.chart {
  width: 100%;
  flex: 1; /* 图表高度填满卡片剩余空间 */
  min-height: 200px;
}
.map-card {
  height: 100%; /* 地图卡片占满列高 */
}
.map-container {
  position: relative;
  flex: 1;
  width: 100%;
}
.map-chart {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

/* 地图弹窗样式 */
.map-popover {
  padding: 12px;
}
.province-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.province-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.region-tag {
  font-size: 12px;
  background: rgba(251, 114, 153, 0.1);
  color: #FB7299;
  padding: 2px 8px;
  border-radius: 12px;
}
.province-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f5;
}
.stat-item {
  display: flex;
  justify-content: space-between;
}
.stat-label {
  color: #999;
  font-size: 13px;
}
.stat-value {
  font-weight: 600;
  color: #333;
}
.top-title {
  font-size: 14px;
  margin: 0 0 8px 0;
  color: #666;
}
.video-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.video-cover {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}
.video-title {
  font-size: 13px;
  margin: 0;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 视频详情弹窗 */
.video-detail-content {
  padding: 8px 0;
}
.video-cover {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
}
.video-title {
  font-size: 16px;
  margin: 12px 0;
}
.label {
  color: #999;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .el-col {
    /* 中等屏幕：第一列6 → 8，第二列10 → 16，第三列8 → 24（换行） */
    &:nth-child(1) { flex: 0 0 calc(100% * 8 / 24) !important; }
    &:nth-child(2) { flex: 0 0 calc(100% * 16 / 24) !important; }
    &:nth-child(3) { flex: 0 0 100% !important; margin-top: 24px; }
  }
}
@media (max-width: 768px) {
  .el-col {
    /* 小屏幕：所有列占满宽度，垂直堆叠 */
    flex: 0 0 100% !important;
    margin-top: 0 !important;
    margin-bottom: 24px !important;
  }
  .map-chart {
    min-height: 350px;
  }
}
</style>
