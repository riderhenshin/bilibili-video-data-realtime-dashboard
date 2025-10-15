import request from '@/utils/request';
// 导入 Pinia 中定义的类型（复用类型，避免重复定义）
import type { VideoItem, HourData, CategoryData, ProvinceData } from '@/stores/chartStore';

// 1. 获取热门视频 TOP5
export const getVideoTop5 = () => {
  // return request.get<VideoItem[]>('/api/mock/video-top5');
  return request.get<VideoItem[]>('/api/mock/video-top5.json');
};

// 2. 获取 24 小时播放量
export const getHourlyData = () => {
  // return request.get<HourData[]>('/api/mock/hourly-data');
  return request.get<HourData[]>('/api/mock/hourly-data.json');
};

// 3. 获取用户活跃度
export const getUserActivity = () => {
  // return request.get<{ rate: number }>('/api/mock/user-activity');
  return request.get<{ rate: number }>('/api/mock/user-activity.json');
};

// 4. 获取分区播放量占比
export const getCategoryData = () => {
  // return request.get<CategoryData[]>('/api/mock/category-data');
  return request.get<CategoryData[]>('/api/mock/category-data.json');
};

// 5. 获取省份数据
export const getProvinceData = () => {
  // return request.get<ProvinceData[]>('/api/mock/province-data');
  return request.get<ProvinceData[]>('/api/mock/province-data.json');
};