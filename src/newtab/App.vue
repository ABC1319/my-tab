<script setup lang="ts">
import Sidebar from './components/layout/Sidebar.vue'
import Home from './components/layout/Home.vue'
</script>

<template>
  <Suspense>
    <!-- 背景 -->
    <div
      class="
        main-container
        w-screen h-screen overflow-hidden
        bg-black
        flex flex-row
      "
    >
      <Sidebar />
      <Home />
    </div>
  </Suspense>
</template>

<style scoped>
.main-container{
  background-image: url(/assets/main_resource.png);
  background-size: cover;
  background-position: center;
}
</style>
