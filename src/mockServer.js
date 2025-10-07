// mockServer.js（ESM 格式，用 import 替代 require）
import express from 'express'; // ESM 导入语法
import cors from 'cors';       // ESM 导入语法

const app = express();
const port = 3000;

// 1. 配置跨域（允许前端地址访问，假设前端运行在 8080 端口）
app.use(cors({
  origin: 'http://localhost:5173', // 替换为你的前端项目地址（如 Vite 默认是 5173）
  methods: ['GET'],
  credentials: true
}));

// 2. 热门视频 TOP5 接口
app.get('/api/mock/video-top5', (req, res) => {
  const mockData = [
    { id: '1', title: 'Vue3+ECharts实战', upName: '前端技术栈', publishTime: '2023-09-20', views: 856321, barrage: 12543, cover: 'https://picsum.photos/300/200?random=1' },
    { id: '2', title: 'TypeScript入门', upName: '编程学习营', publishTime: '2023-09-18', views: 652147, barrage: 8965, cover: 'https://picsum.photos/300/200?random=2' },
    { id: '3', title: 'B站数据分析', upName: '数据可视化达人', publishTime: '2023-09-19', views: 521478, barrage: 6321, cover: 'https://picsum.photos/300/200?random=3' },
    { id: '4', title: '前端工程化', upName: '工程化专家', publishTime: '2023-09-17', views: 412587, barrage: 5689, cover: 'https://picsum.photos/300/200?random=4' },
    { id: '5', title: 'Pinia指南', upName: 'Vue技术圈', publishTime: '2023-09-16', views: 325698, barrage: 4125, cover: 'https://picsum.photos/300/200?random=5' }
  ];
  res.json({ code: 200, data: mockData, msg: 'success' });
});

// 3. 24小时播放量接口
app.get('/api/mock/hourly-data', (req, res) => {
  const mockData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}时`,
    views: Math.floor(Math.random() * 500) + 100
  }));
  res.json({ code: 200, data: mockData, msg: 'success' });
});

// 4. 用户活跃度接口
app.get('/api/mock/user-activity', (req, res) => {
  const mockData = { rate: Math.floor(Math.random() * 15) / 100 + 0.6 };
  res.json({ code: 200, data: mockData, msg: 'success' });
});

// 启动服务
app.listen(port, () => {
  console.log(`Mock服务已启动：http://localhost:${port}`);
});