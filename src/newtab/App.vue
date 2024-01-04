<script setup lang="ts">
import Sidebar from './components/layout/Sidebar.vue'
import AppTip from './components/layout/AppTip.vue'
import CustomHome from './components/layout/CustomHome.vue'
</script>

<template>
  <Suspense>
    <!-- 背景 -->
    <div
      id="app-container"
      class="
        app-container
        w-screen h-screen overflow-hidden
        bg-#0a0a12
        flex flex-row
      "
    >
      <Sidebar class="z-2" />

      <CustomHome />

      <AppTip />
    </div>
  </Suspense>
</template>
