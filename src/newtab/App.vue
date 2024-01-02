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
        main-container
        w-screen h-screen overflow-hidden
        bg-black
        flex flex-row
      "
    >
      <Sidebar class="z-2" />

      <CustomHome />

      <AppTip />
    </div>
  </Suspense>
</template>

<style scoped>
.main-container {
  background-image: url(/assets/main_resource.png);
  background-size: cover;
  background-position: center;
}
</style>
、
