import { defineStore } from 'pinia';

// 定义视频数据类型接口（TypeScript类型约束）
export interface VideoItem {
  id: string;
  title: string;
  upName: string;
  publishTime: string;
  views: number;
  barrage: number;
  cover: string;
}

// 定义小时数据类型接口
export interface HourData {
  hour: string;
  views: number;
}

// 定义Store类型（便于TypeScript类型推导）
interface ChartState {
  videoTop5: VideoItem[]; // 热门视频TOP5数据
  hourlyData: HourData[]; // 小时播放量数据
  userActivity: number;   // 用户活跃度（0-1之间）
  isLoading: boolean;     // 加载状态
}

// 创建Pinia Store
export const useChartStore = defineStore('chart', {
  state: (): ChartState => ({
    // 初始化数据（符合类型约束）
    videoTop5: [],
    hourlyData: [],
    userActivity: 0.68,
    isLoading: false
  }),

  actions: {
    // 模拟获取热门视频数据（异步操作）
    async fetchVideoData() {
      this.isLoading = true;
      try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟后端返回数据（严格符合VideoItem类型）
        const mockData: VideoItem[] = [
          { 
            id: '1',
            title: 'Vue3+ECharts数据可视化实战', 
            upName: '前端技术栈', 
            publishTime: '2023-09-20',
            views: 856321,
            barrage: 12543,
            cover: 'https://picsum.photos/300/200?random=1'
          },
          { 
            id: '2',
            title: 'TypeScript从入门到精通', 
            upName: '编程学习营', 
            publishTime: '2023-09-18',
            views: 652147,
            barrage: 8965,
            cover: 'https://picsum.photos/300/200?random=2'
          },
          { 
            id: '3',
            title: 'B站视频数据分析方法', 
            upName: '数据可视化达人', 
            publishTime: '2023-09-19',
            views: 521478,
            barrage: 6321,
            cover: 'https://picsum.photos/300/200?random=3'
          },
          { 
            id: '4',
            title: '前端工程化最佳实践', 
            upName: '工程化专家', 
            publishTime: '2023-09-17',
            views: 412587,
            barrage: 5689,
            cover: 'https://picsum.photos/300/200?random=4'
          },
          { 
            id: '5',
            title: 'Pinia状态管理完全指南', 
            upName: 'Vue技术圈', 
            publishTime: '2023-09-16',
            views: 325698,
            barrage: 4125,
            cover: 'https://picsum.photos/300/200?random=5'
          }
        ];

        this.videoTop5 = mockData;
      } catch (error) {
        console.error('获取视频数据失败:', error);
      } finally {
        this.isLoading = false;
      }
    },

    // 模拟获取小时播放量数据
    async fetchHourlyData() {
      this.isLoading = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // 生成24小时数据（符合HourData类型）
        const mockData: HourData[] = Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}时`,
          views: Math.floor(Math.random() * 500) + 100 // 随机播放量
        }));

        this.hourlyData = mockData;
      } catch (error) {
        console.error('获取小时数据失败:', error);
      } finally {
        this.isLoading = false;
      }
    },

    // 模拟更新用户活跃度
    updateActivityRate() {
      // 随机小幅波动（保持在0.6-0.75之间）
      const change = (Math.random() - 0.5) * 0.02;
      this.userActivity = Math.max(0.6, Math.min(0.75, this.userActivity + change));
    }
  }
});