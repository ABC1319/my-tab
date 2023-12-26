<script setup lang="ts">
import { ref } from 'vue'
import { cfg } from './cfg'
import { initGridContainer } from './draggable'

interface BentoCellsType {
  id: string
  x: number
  y: number
  width: number
  height: number
  [key: string]: any
}

const bentoCells = ref<BentoCellsType[]>(cfg)
const bentoContainerRef = ref()
const currentClickedElement: Ref<any> = ref()

onMounted(() => {
  initGridContainer(bentoCells, currentClickedElement)
})
</script>

<template>
  <div
    ref="bentoContainerRef"
    class="bento-container w-full h-full absolute top-0 left-0 bg-gray-200 overflow-hidden z-50"
  >
    <div v-for="item, index in bentoCells" :key="item.id">
      <component
        :is="item.component"
        :id="`${item.id}`"
        v-model="bentoCells[index]"
        :style="{
          position: 'absolute',
          transform: `
          translate3d(
            ${item.x}px,
            ${item.y}px,
          0)`,
          width: `${item.width}px`,
          height: `${item.height}px`,
        }"
      />
    </div>
  </div>
</template>
