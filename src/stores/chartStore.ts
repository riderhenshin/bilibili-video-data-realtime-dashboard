import { defineStore } from 'pinia'

// 定义视频数据类型
interface VideoItem {
  title: string
  upName: string
  publishTime: string
  views: number
  barrage: number
  cover: string
}

// 定义小时播放量数据类型
interface HourData {
  hour: string
  views: number
}

export const useChartStore = defineStore('chart', {
  state: () => ({
    // 热门视频TOP5数据
    videoTop5: [] as VideoItem[],
    // 24小时播放量趋势数据
    hourlyData: [] as HourData[],
    // 用户活跃度
    userActivityRate: 0.68,
    // 加载状态
    isLoading: false
  }),

  actions: {
    // 初始化数据（模拟API请求）
    async initData() {
      this.isLoading = true
      try {
        // 模拟网络请求延迟
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 初始化热门视频数据
        this.videoTop5 = [
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
        ]

        // 初始化24小时播放量数据
        this.hourlyData = Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}时`,
          views: Math.floor(Math.random() * 500) + 100 // 随机生成100-600的播放量（万）
        }))

      } catch (error) {
        console.error('数据初始化失败:', error)
      } finally {
        this.isLoading = false
      }
    },

    // 模拟数据更新（定时刷新）
    async updateData() {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 修复：先检查数组长度，再生成有效索引
        if (this.hourlyData.length > 0) {
          // 生成0到数组长度-1之间的随机索引（而非固定24）
          const randomIndex = Math.floor(Math.random() * this.hourlyData.length)
          // 再次确认元素存在
          if (this.hourlyData[randomIndex]) {
            this.hourlyData[randomIndex].views = Math.floor(Math.random() * 500) + 100
          }
        }

        // 随机更新用户活跃度（±5%范围内）
        const change = (Math.random() - 0.5) * 0.1 // -5% 到 +5% 的波动
        this.userActivityRate = Math.max(0.3, Math.min(0.9, this.userActivityRate + change))

      } catch (error) {
        console.error('数据更新失败:', error)
      }
    },

    // 获取单个视频详情
    getVideoDetail(index: number) {
      return this.videoTop5[index]
    }
  },

  // 可选：定义计算属性（Getter）
  getters: {
    // 计算总播放量
    totalViews: (state) => {
      return state.hourlyData.reduce((sum, item) => sum + item.views, 0)
    }
  }
})
