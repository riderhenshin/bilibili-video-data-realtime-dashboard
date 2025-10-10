import { defineStore } from 'pinia';

// 设置项类型定义
interface SettingState {
  refreshInterval: number; // 自动刷新间隔（单位：秒），默认30秒
  chartShowLegend: boolean; // 图表是否显示图例，默认true
  chartShowLabel: boolean; // 图表是否显示数据标签，默认true
  theme: 'light' | 'dark'; // 主题，默认浅色
}

export const useSettingStore = defineStore('setting', {
  state: (): SettingState => {
    // 从localStorage读取配置，无则用默认值
    const savedSetting = localStorage.getItem('biliDashboardSetting');
    return savedSetting 
      ? JSON.parse(savedSetting) as SettingState 
      : {
          refreshInterval: 30,
          chartShowLegend: true,
          chartShowLabel: true,
          theme: 'light'
        };
  },

  actions: {
    // 保存设置（同步到localStorage）
    saveSetting(newSetting: Partial<SettingState>) {
      // 合并新配置到当前状态
      Object.assign(this.$state, newSetting);
      // 持久化到localStorage
      localStorage.setItem('biliDashboardSetting', JSON.stringify(this.$state));
    },

    // 重置设置为默认值
    resetSetting() {
      const defaultSetting: SettingState = {
        refreshInterval: 30,
        chartShowLegend: true,
        chartShowLabel: true,
        theme: 'light'
      };
      this.$state = defaultSetting;
      localStorage.setItem('biliDashboardSetting', JSON.stringify(defaultSetting));
    }
  }
});