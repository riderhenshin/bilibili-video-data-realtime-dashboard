<template>
  <span ref="countRef" class="count-up" :style="textStyle"></span>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { CountUp } from 'countup.js';

// 定义props类型，支持前缀/后缀、小数位数、文本样式
const props = defineProps<{
  end: number; // 目标值
  prefix?: string; // 前缀（如“”）
  suffix?: string; // 后缀（如“万”“%”）
  decimalPlaces?: number; // 小数位数（默认0）
  duration?: number; // 动画时长（默认2秒）
  textStyle?: { [key: string]: string }; // 文本样式（如fontSize）
}>();

// 默认配置
const defaultOption = computed(() => ({
  prefix: props.prefix || '',
  suffix: props.suffix || '',
  decimalPlaces: props.decimalPlaces || 0,
  duration: props.duration || 2, // 动画更平缓（2秒）
  // 缓动动画 useEasing
  // true 从起始值增长到目标值的过程不是匀速的，而是会遵循预设的缓动函数（如先慢后快、先快后慢、慢 - 快 - 慢等），使动画更符合自然运动规律
  // 例如：从 0 计数到 1000 时，可能开始增长较慢，中间加速，接近目标值时又减速，最终平稳停在 1000。
  // false 数字增长会以匀速进行。即每秒增长的数值是固定的，直到达到目标值
  useEasing: true, 
  useGrouping: true, // 千位分隔符（如12,345）
}));

const countRef = ref<HTMLSpanElement | null>(null);
let countUpInstance: CountUp | null = null;

// 初始化数字动画
onMounted(() => {
  if (!countRef.value) return;
  countUpInstance = new CountUp(countRef.value, props.end, defaultOption.value);
  if (countUpInstance.error) {
    console.error('CountUp初始化失败:', countUpInstance.error);
    return;
  }
  countUpInstance.start();
});

// 监听目标值变化，更新动画
watch(() => props.end, (newVal) => {
  if (countUpInstance) {
    countUpInstance.update(newVal);
  }
});
</script>

<style scoped>
.count-up {
  font-weight: 600; 
}
</style>