<script setup lang="ts">
import Sidebar from './components/layout/Sidebar.vue'
import NormalHome from './components/layout/NormalHome.vue'
import CleanHome from './components/layout/CleanHome.vue'
import { appHomeShowMode } from '~/logic/storage'

// 只是为了动画效果设置的变量
const isShowNormalHomeAnimate = ref(appHomeShowMode.value === 'normal')
const isShowCleanHomeAnimate = ref(appHomeShowMode.value === 'clean')

const normalHomeRef = ref<InstanceType<typeof NormalHome>>()
const cleanHomeRef = ref<InstanceType<typeof CleanHome>>()

// 动画是否进行中，防抖
watch(appHomeShowMode, async (val) => {
  // 动画过快

  if (val === 'normal') {
    cleanHomeRef.value?.hide().then(() => {
      isShowCleanHomeAnimate.value = false
    })

    isShowNormalHomeAnimate.value = true
    nextTick(() => {
      normalHomeRef.value?.show().then(() => {
      })
    })
  }
  else if (val === 'clean') {
    normalHomeRef.value?.hide().then(() => {
      isShowNormalHomeAnimate.value = false
    })

    isShowCleanHomeAnimate.value = true
    nextTick(() => {
      cleanHomeRef.value?.show().then(() => {
      })
    })
  }
})
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
      <Sidebar
        v-model:appHomeShowMode="appHomeShowMode"
        class="z-2"
      />

      <div class="flex-1 h-full relative z-1">
        <NormalHome v-if="isShowNormalHomeAnimate" ref="normalHomeRef" />
        <CleanHome v-if="isShowCleanHomeAnimate" ref="cleanHomeRef" />
      </div>
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
