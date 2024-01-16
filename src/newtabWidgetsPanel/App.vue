<script setup lang="ts">
import WidgetsPanel from './WidgetsPanel.vue'
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
      <WidgetsPanel />
    </div>
  </Suspense>
</template>
