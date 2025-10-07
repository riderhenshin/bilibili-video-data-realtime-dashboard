<template>

  <el-card shadow="hover" body-class="card-body">
    <el-icon class="card-icon" :style="`background-color: ${iconBgColor};`" >
      <component  :is="iconComponent" />
    </el-icon>
    <div class="card-content">
      <countup class="card-num" :style="`color:${numColor};`" :end="statNum" />
      <div>{{cardTitle}}</div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import countup from './CountUp.vue';
import type {Component} from 'vue'

const props = defineProps<{
  iconComponent: Component; // 图标组件（如User、Search）
  iconBgColor: string;      // 图标背景色（如#2d8cf0）
  numColor: string;         // 统计数字颜色（如#2d8cf0）
  statNum: number;          // 统计目标值（如6666）
  cardTitle: string;        // 卡片标题（如用户访问量）
}>()

</script>

<style scoped>

:deep(.card-body) {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0;
    margin: 0;
}
.card-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}
.card-content{
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
    padding: 0 20px;
}

.card-num {
    font-size: 30px;
}
</style>