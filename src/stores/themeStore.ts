import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // 主题状态管理
  const currentTheme = ref<'light' | 'dark'>(
    // 优先从localStorage读取，没有则默认浅色主题
    (localStorage.getItem('app-theme') as 'light' | 'dark') || 'light'
  );
  
  // 设置主题
  const setTheme = (theme: 'light' | 'dark') => {
    currentTheme.value = theme;
    localStorage.setItem('app-theme', theme);
  };
  
  return {
    currentTheme,
    setTheme
  };
});
