import { defineStore } from 'pinia';
import axios from 'axios';

// 视频数据类型（新增分区字段）
export interface VideoItem {
  id: string;
  title: string;
  upName: string;
  publishTime: string;
  views: number;
  barrage: number;
  cover: string;
  category: string; // 分区（生活/游戏/知识/动漫/科技）
}

// 分区数据类型
export interface CategoryData {
  name: string; // 分区名称
  value: number; // 播放量
}

// 省份数据类型（增强版）
export interface ProvinceData {
  province: string; // 省份名称
  totalViews: number; // 总访问量
  userRatio: number; // 用户占比（%）
  uploadCount: number; // 投稿量
  barrageCount: number; // 弹幕量
  categoryViews: Record<string, number>; // 各分区播放量（如{生活: 120000, 游戏: 150000}）
  videos: VideoItem[]; // 该省份热门视频
}

// 小时播放量数据
export interface HourData {
  hour: string;
  views: number;
}

interface ChartState {
  videoTop5: VideoItem[];
  hourlyData: HourData[];
  userActivity: number;
  categoryData: CategoryData[];
  provinceData: ProvinceData[];
  isLoading: boolean;
}

export const useChartStore = defineStore('chart', {
  state: (): ChartState => ({
    videoTop5: [],
    hourlyData: [],
    userActivity: 0.68,
    categoryData: [],
    provinceData: [],
    isLoading: false
  }),

  actions: {
    // 统一请求所有数据
    async fetchAllData() {
      this.isLoading = true;
      try {
        // 并行请求多个接口（优化性能）
        const [
          videoRes, 
          hourlyRes, 
          categoryRes, 
          provinceRes
        ] = await Promise.all([
          axios.get('http://localhost:3000/api/mock/video-top5'),
          axios.get('http://localhost:3000/api/mock/hourly-data'),
          axios.get('http://localhost:3000/api/mock/category-data'),
          axios.get('http://localhost:3000/api/mock/province-data')
        ]);

        // 赋值数据（严格类型断言）
        this.videoTop5 = videoRes.data.data as VideoItem[];
        this.hourlyData = hourlyRes.data.data as HourData[];
        this.categoryData = categoryRes.data.data as CategoryData[];
        this.provinceData = provinceRes.data.data as ProvinceData[];
      } catch (error) {
        console.error('数据请求失败:', error);
        this.loadFallbackData(); // 加载备用数据
      } finally {
        this.isLoading = false;
      }
    },

    // 获取用户活跃度
    async fetchUserActivity() {
      try {
        const res = await axios.get('http://localhost:3000/api/mock/user-activity');
        this.userActivity = res.data.data.rate;
      } catch (error) {
        console.error('获取活跃度失败:', error);
        this.userActivity = 0.65 + Math.random() * 0.1; // 随机模拟
      }
    },

    // 定时更新活跃度
    startUpdateActivity() {
      setInterval(() => this.fetchUserActivity(), 5000);
    },

    // 加载备用数据（接口失败时）
    loadFallbackData() {
      // 备用视频数据
      this.videoTop5 = [
        { id: '1', title: 'Vue3+ECharts实战', upName: '前端菌',publishTime:'2025-10-8', category: '科技', views: 856321, barrage: 12543, cover: 'https://picsum.photos/300/200?random=1' },
        { id: '2', title: '原神新版本攻略', upName: '游戏酱', publishTime:'2025-10-9', category: '游戏', views: 652147, barrage: 8965, cover: 'https://picsum.photos/300/200?random=2' },
        { id: '3', title: '经济学通识', upName: '知识君', publishTime:'2025-10-10', category: '知识', views: 521478, barrage: 6321, cover: 'https://picsum.photos/300/200?random=3' },
        { id: '4', title: '周末Vlog', upName: '生活家', publishTime:'2025-10-11', category: '生活', views: 412587, barrage: 5689, cover: 'https://picsum.photos/300/200?random=4' },
        { id: '5', title: '新番吐槽', upName: '动漫迷', publishTime:'2025-10-12', category: '动漫', views: 325698, barrage: 4125, cover: 'https://picsum.photos/300/200?random=5' }
      ];

      // 备用分区数据
      this.categoryData = [
        { name: '生活', value: 1250000 },
        { name: '游戏', value: 1820000 },
        { name: '知识', value: 980000 },
        { name: '动漫', value: 1560000 },
        { name: '科技', value: 750000 }
      ];

      // 备用省份数据
      this.provinceData = [
        {
          province: '广东',
          totalViews: 850000,
          userRatio: 12.5,
          uploadCount: 12500,
          barrageCount: 356000,
          categoryViews: { 生活: 250000, 游戏: 320000, 知识: 80000, 动漫: 150000, 科技: 50000 },
          videos: this.videoTop5.filter(item => ['生活', '游戏'].includes(item.category))
        },
        {
          province: '浙江',
          totalViews: 620000,
          userRatio: 9.8,
          uploadCount: 9800,
          barrageCount: 280000,
          categoryViews: { 生活: 180000, 游戏: 250000, 知识: 60000, 动漫: 100000, 科技: 30000 },
          videos: this.videoTop5.filter(item => ['游戏', '动漫'].includes(item.category))
        }
        // 可补充其他省份...
      ];
    }
  }
});
