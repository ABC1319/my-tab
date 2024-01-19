<script setup lang="ts">
import WidgetsPanel from './WidgetsPanel.vue'
</script>

<template>
  <Suspense>
    <!-- 背景 -->
    <div class=" w-screen h-screen overflow-hidden bg-#101214 text-white">
      <!-- title -->
      <div class="h-64px w-full bg-[#252836] text-18px leading-64px px-30px">
        管理我的小组件
      </div>
      <!-- content -->
      <div class="h-100% w-full bg-transparent">
        66
      </div>
    </div>
  </Suspense>
</template>
