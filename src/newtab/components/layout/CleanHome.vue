<script setup lang="ts">
import SearchBox from '../ui/search-box/index.vue'

const containerRef = ref<HTMLElement | null>(null)

function hide() {
  return new Promise((resolve) => {
    const animates = [
      `translateY(-100%)`,
      'translateY(0)',
    ]

    // 1. 开始动画
    const animation = containerRef.value!.animate(
      { transform: animates },
      { duration: 300, easing: 'linear', fill: 'backwards' },
    )
    animation.onfinish = () => {
      resolve('完成动画')
    }
  })
}
function show() {
  return new Promise((resolve) => {
    const animates = [
      'translateY(0)',
      'translateY(-100%)',
    ]
    const animation = containerRef.value!.animate(
      { transform: animates },
      { duration: 300, easing: 'linear', fill: 'backwards' },
    )
    animation.onfinish = () => {
      resolve('完成动画')
    }
  })
}

defineExpose({ hide, show })
</script>

<template>
  <div
    ref="containerRef"
    class="
      relative
      flex-1 h-full flex flex-col justify-start items-center
      text-white
      overflow-x-hidden
    "
  >
    <SearchBox />
  </div>
</template>

<style scoped>

</style>
