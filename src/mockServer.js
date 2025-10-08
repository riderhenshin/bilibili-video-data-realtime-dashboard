// mockServer.js（ESM 格式，适配新布局与Store）
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// 跨域配置（保持前端地址一致）
app.use(cors({
  origin: 'http://localhost:5173', // Vite默认端口，根据实际前端地址调整
  methods: ['GET'],
  credentials: true
}));

// -------------------------- 1. 热门视频TOP5接口（补充category字段） --------------------------
app.get('/api/mock/video-top5', (req, res) => {
  // 每个视频新增category字段，贴合B站核心分区
  const mockData = [
    { 
      id: '1',
      title: 'Vue3+ECharts数据可视化实战', 
      upName: '前端技术栈', 
      publishTime: '2023-09-20',
      views: 856321,
      barrage: 12543,
      cover: 'https://picsum.photos/300/200?random=1',
      category: '科技' // 新增：分区-科技
    },
    { 
      id: '2',
      title: '原神4.2版本新副本攻略', 
      upName: '游戏酱', 
      publishTime: '2023-09-18',
      views: 652147,
      barrage: 8965,
      cover: 'https://picsum.photos/300/200?random=2',
      category: '游戏' // 新增：分区-游戏
    },
    { 
      id: '3',
      title: '经济学通识：为什么物价会涨', 
      upName: '知识君', 
      publishTime: '2023-09-19',
      views: 521478,
      barrage: 6321,
      cover: 'https://picsum.photos/300/200?random=3',
      category: '知识' // 新增：分区-知识
    },
    { 
      id: '4',
      title: '周末Vlog：逛B站总部+漫展', 
      upName: '生活家', 
      publishTime: '2023-09-17',
      views: 412587,
      barrage: 5689,
      cover: 'https://picsum.photos/300/200?random=4',
      category: '生活' // 新增：分区-生活
    },
    { 
      id: '5',
      title: '新番吐槽：十月霸权番预测', 
      upName: '动漫迷', 
      publishTime: '2023-09-16',
      views: 325698,
      barrage: 4125,
      cover: 'https://picsum.photos/300/200?random=5',
      category: '动漫' // 新增：分区-动漫
    }
  ];
  res.json({ code: 200, data: mockData, msg: 'success' });
});

// -------------------------- 2. 24小时播放量接口（保持不变，数据更贴合实际） --------------------------
app.get('/api/mock/hourly-data', (req, res) => {
  // 模拟真实播放量波动（凌晨低、晚间高）
  const mockData = [
    { hour: '0', views: 80 }, { hour: '1', views: 60 }, { hour: '2', views: 40 }, { hour: '3', views: 30 },
    { hour: '4', views: 25 }, { hour: '5', views: 35 }, { hour: '6', views: 70 }, { hour: '7', views: 150 },
    { hour: '8', views: 220 }, { hour: '9', views: 280 }, { hour: '10', views: 320 }, { hour: '11', views: 350 },
    { hour: '12', views: 420 }, { hour: '13', views: 390 }, { hour: '14', views: 360 }, { hour: '15', views: 400 },
    { hour: '16', views: 480 }, { hour: '17', views: 550 }, { hour: '18', views: 620 }, { hour: '19', views: 720 },
    { hour: '20', views: 780 }, { hour: '21', views: 700 }, { hour: '22', views: 580 }, { hour: '23', views: 350 }
  ];
  res.json({ code: 200, data: mockData, msg: 'success' });
});

// -------------------------- 3. 用户活跃度接口（保持不变） --------------------------
app.get('/api/mock/user-activity', (req, res) => {
  // 活跃度在 0.6-0.75 之间波动，符合正常运营范围
  const mockData = { rate: Math.floor(Math.random() * 15) / 100 + 0.6 };
  res.json({ code: 200, data: mockData, msg: 'success' });
});

// -------------------------- 4. 新增：分区播放量占比接口（适配饼图） --------------------------
app.get('/api/mock/category-data', (req, res) => {
  // 分区数据与视频数据的category字段对应，播放量符合B站实际分区热度（游戏>动漫>生活>知识>科技）
  const mockData = [
    { name: '生活', value: 1250000 },
    { name: '游戏', value: 1820000 },
    { name: '知识', value: 980000 },
    { name: '动漫', value: 1560000 },
    { name: '科技', value: 750000 }
  ];
  res.json({ code: 200, data: mockData, msg: 'success' });
});

// -------------------------- 5. 新增：省份数据接口（适配地图） --------------------------
app.get('/api/mock/province-data', (req, res) => {
  // 从/video-top5接口中提取视频，按省份分配（核心省份视频更多）
  const videoList = [
    // 广东视频（生活+游戏为主，热度最高）
    { 
      id: '11', title: '广州漫展Vlog', upName: '生活家', category: '生活', views: 320000, cover: 'https://picsum.photos/300/200?random=11'
    },
    { 
      id: '12', title: '王者荣耀省赛复盘', upName: '游戏酱', category: '游戏', views: 450000, cover: 'https://picsum.photos/300/200?random=12'
    },
    // 浙江视频（游戏+动漫为主）
    { 
      id: '21', title: 'LOL手游新赛季攻略', upName: '游戏君', category: '游戏', views: 280000, cover: 'https://picsum.photos/300/200?random=21'
    },
    { 
      id: '22', title: '动漫周边开箱', upName: '动漫迷', category: '动漫', views: 220000, cover: 'https://picsum.photos/300/200?random=22'
    },
    // 北京视频（知识+科技为主）
    { 
      id: '31', title: 'AI大模型原理科普', upName: '科技菌', category: '科技', views: 350000, cover: 'https://picsum.photos/300/200?random=31'
    },
    { 
      id: '32', title: '历史冷知识分享', upName: '知识君', category: '知识', views: 290000, cover: 'https://picsum.photos/300/200?random=32'
    }
  ];

  // 省份数据：包含总访问量、用户占比、各分区播放量等字段（匹配ProvinceData类型）
  const mockData = [
    {
      province: '广东',
      totalViews: 850000, // 总访问量（最高）
      userRatio: 12.5,    // 用户占比（%）
      uploadCount: 12500, // 投稿量
      barrageCount: 356000, // 弹幕量
      categoryViews: {    // 各分区播放量
        生活: 250000,
        游戏: 320000,
        知识: 80000,
        动漫: 150000,
        科技: 50000
      },
      videos: videoList.filter(v => v.id.startsWith('1')) // 广东专属视频
    },
    {
      province: '浙江',
      totalViews: 620000,
      userRatio: 9.8,
      uploadCount: 9800,
      barrageCount: 280000,
      categoryViews: {
        生活: 180000,
        游戏: 250000,
        知识: 60000,
        动漫: 100000,
        科技: 30000
      },
      videos: videoList.filter(v => v.id.startsWith('2')) // 浙江专属视频
    },
    {
      province: '北京',
      totalViews: 580000,
      userRatio: 8.6,
      uploadCount: 8200,
      barrageCount: 240000,
      categoryViews: {
        生活: 120000,
        游戏: 150000,
        知识: 180000,
        动漫: 80000,
        科技: 50000
      },
      videos: videoList.filter(v => v.id.startsWith('3')) // 北京专属视频
    },
    // 可补充其他省份（如江苏、四川等），数据按实际热度递减
    {
      province: '江苏',
      totalViews: 450000,
      userRatio: 7.2,
      uploadCount: 7500,
      barrageCount: 190000,
      categoryViews: {
        生活: 150000,
        游戏: 120000,
        知识: 90000,
        动漫: 60000,
        科技: 30000
      },
      videos: [] // 非核心省份可空或少量视频
    },
    {
      province: '四川',
      totalViews: 380000,
      userRatio: 6.5,
      uploadCount: 6800,
      barrageCount: 160000,
      categoryViews: {
        生活: 130000,
        游戏: 100000,
        知识: 60000,
        动漫: 80000,
        科技: 10000
      },
      videos: []
    }
  ];

  res.json({ code: 200, data: mockData, msg: 'success' });
});

// 启动服务
app.listen(port, () => {
  console.log(`Mock服务已启动：http://localhost:${port}`);
  console.log('可用接口：');
  console.log('1. 热门视频TOP5：/api/mock/video-top5');
  console.log('2. 24小时播放量：/api/mock/hourly-data');
  console.log('3. 用户活跃度：/api/mock/user-activity');
  console.log('4. 分区占比：/api/mock/category-data');
  console.log('5. 省份数据：/api/mock/province-data');
});