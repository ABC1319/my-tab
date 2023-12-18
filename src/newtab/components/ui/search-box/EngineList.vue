<script setup lang="ts">
import { ref, watch } from 'vue'
import { searchEngine } from './engine'
import { createDragInHorizontal } from '~/utils/drag'

const emits = defineEmits(['handleSelectedSearchEngine'])

const searchConfig = ref(searchEngine)

let isDraggedEngineList = false

const options = {
  containerClassName: 'search-engine-container',
  elementsClassName: 'search-engine-item',
  defaultPinedClassName: '自定义',
  size: { width: 70, height: 70 },
  gap: 0,
  maximumInLine: 9,
}

const { isDragged } = createDragInHorizontal(options)
watch(isDragged, () => {
  isDraggedEngineList = true
})

function handleSelectedSearchEngine(item: typeof searchConfig.value[0]) {
  if (isDraggedEngineList)
    isDraggedEngineList = false
  else
    emits('handleSelectedSearchEngine', item)
}
</script>

<template>
  <div
    :class="options.containerClassName"
    class="search-engine-container w-full h-full -mt-10px"
  >
    <div
      v-for="item in searchConfig.slice(0, 9)"
      :key="item.label"
      :class="`${options.elementsClassName} search-${item.label}`"
      class="w-70px h-64px flex flex-col justify-center items-center cursor-pointer gap-5px flex-shrink-0 flex-grow-0"
      @click="handleSelectedSearchEngine(item)"
    >
      <div class="w-36px h-36px text-blue-500 rounded-8px bg-white flex flex-col justify-center items-center" v-html="item.icon" />

      <span class="text-12px">{{ item.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.search-engine-item {
  overflow: hidden;
  border-radius: 10px;
}
.search-engine-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(80px);
}
</style>
