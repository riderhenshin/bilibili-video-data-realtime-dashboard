// src/stores/chartStore.ts
import { defineStore } from 'pinia';
import axios from 'axios'; // 引入Axios

// 1. 定义基础类型（不变）
export interface VideoItem {
  id: string;
  title: string;
  upName: string;
  publishTime: string;
  views: number;
  barrage: number;
  cover: string;
}

export interface HourData {
  hour: string;
  views: number;
}

interface ChartState {
  videoTop5: VideoItem[];
  hourlyData: HourData[];
  userActivity: number;
  isLoading: boolean;
}

// 2. 创建Store（核心改造actions）
export const useChartStore = defineStore('chart', {
  state: (): ChartState => ({
    videoTop5: [],
    hourlyData: [],
    userActivity: 0.68,
    isLoading: false
  }),

  actions: {
    // 改造1：获取热门视频TOP5（请求Mock接口）
    async fetchVideoData() {
      this.isLoading = true;
      try {
        // 请求Mock接口（地址对应mockServer.js中的定义）
        const response = await axios.get('http://localhost:3000/api/mock/video-top5');
        // 验证接口返回格式，数据赋值（类型断言匹配VideoItem）
        if (response.data.code === 200) {
          this.videoTop5 = response.data.data as VideoItem[];
        }
      } catch (error) {
        console.error('获取视频数据失败:', error);
        this.videoTop5 = []; // 失败时清空数据
      } finally {
        this.isLoading = false;
      }
    },

    // 改造2：获取24小时播放量（请求Mock接口）
    async fetchHourlyData() {
      this.isLoading = true;
      try {
        const response = await axios.get('http://localhost:3000/api/mock/hourly-data');
        if (response.data.code === 200) {
          this.hourlyData = response.data.data as HourData[];
        }
      } catch (error) {
        console.error('获取小时数据失败:', error);
        this.hourlyData = [];
      } finally {
        this.isLoading = false;
      }
    },

    // 改造3：获取用户活跃度（请求Mock接口，替代原来的随机波动）
    async fetchUserActivity() {
      try {
        const response = await axios.get('http://localhost:3000/api/mock/user-activity');
        if (response.data.code === 200) {
          this.userActivity = response.data.data.rate;
        }
      } catch (error) {
        console.error('获取活跃度失败:', error);
      }
    },

    // 保留定时更新逻辑（改为定时请求接口）
    startUpdateActivity() {
      setInterval(() => {
        this.fetchUserActivity(); // 定时调用接口获取最新活跃度
      }, 5000);
    }
  }
});