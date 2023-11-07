<script setup lang="ts">
import Sidebar from './components/layout/Sidebar.vue'
import Home from './components/layout/Home.vue'
</script>

<template>
  <Suspense>
    <!-- 背景 -->
    <div class="main-container w-screen h-screen bg-black overflow-hidden">
      <div
        ref="boxRef"
        class="w-full h-full flex flex-row"
        style="
            transition: ALl .3s cubic-bezier(0.4, 0, 0.2, 1);
            background-image: url(/assets/main_resource.png);
            background-size: cover;
          "
      >
        <Sidebar class="flex-shrink-0" />
        <Home />
      </div>
    </div>
  </Suspense>
</template>
