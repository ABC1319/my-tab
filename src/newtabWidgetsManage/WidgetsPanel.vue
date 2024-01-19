<script setup lang="ts">
/**
 * 跟 `src/newtab/components/layout=layout-canvas/WidgetsPanel.vue` 保持一致
 * 除了样式不同外，其余要一模一样
 */
import { getAllCustomLayoutComponentsRaw } from '~/utils/layout-components'

const customLayoutAllComponents = await getAllCustomLayoutComponentsRaw()
const allComponents = customLayoutAllComponents.map((components) => {
  return {
    name: components.name,
    components: markRaw(components.raw.default),
  }
})

function handleDragstart(e: DragEvent, title: string) {
  e.dataTransfer!.setData('text/plain', title)
  e.dataTransfer!.dropEffect = 'move'
}

// -----------------------------------设置宽度 start-------------------------------------------------//
const allRef = ref<HTMLDivElement[]>([])
const cellSize = { w: 200, h: 160 }
onMounted(() => {
  initComponentsSize()
})

function initComponentsSize() {
  allRef.value.forEach((el: HTMLElement) => {
    const firstChild = el.firstElementChild as HTMLDivElement

    const scale = calculateMainScale(firstChild.clientWidth, firstChild.clientHeight)
    firstChild.style.transform = `scale(${scale})`
    firstChild.style.marginTop = `-${firstChild.clientHeight / 2}px`
    firstChild.style.marginLeft = `-${firstChild.clientWidth / 2}px`
  })
}

function calculateMainScale(cw: number, ch: number) {
  const ow = cellSize.w - 20 // 减去 padding 宽度
  const oh = cellSize.h

  const sw = (ow / cw).toFixed(6)
  const sh = (oh / ch).toFixed(6)

  return Math.min(Number(sw), Number(sh))
}
// -----------------------------------设置宽度 start-------------------------------------------------//
</script>

<template>
  <div
    class="
      w-full h-full
      text-white
      bg-[#252835]
      px-20px py-10px
    "
  >
    <div class="w-full h-4 font-bold mb-10px">
      拖拽布局组件
    </div>

    <div class="flex flex-row items-start justify-start gap-10px ">
      <div
        v-for="item in allComponents"
        ref="allRef"
        :key="item.name"
        :draggable="true"
        :style="{
          width: `${cellSize.w}px`,
          height: `${cellSize.h}px`,
        }"
        class="
            w-200px h-160px bg-[#484E64] rounded-10px
            flex-shrink-0
            hover:cursor-grab active:cursor-grabbing
            overflow-hidden relative
          "
        @dragstart="(e) => handleDragstart(e, item.name)"
      >
        <component
          :is="item.components"
          :id="`${item.name}`"
          class="origin-center absolute top-1/2 left-1/2"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 4px;
  height: 3px;
  background-color: transparent;
  border-radius: 8px;
}
::-webkit-scrollbar-track-piece {
  width: 12px;
  background-color: transparent;
  border-radius: 8px;
}
::-webkit-scrollbar-thumb:vertical {
  width: 24px;
  height: 24px;
  background: #484e64;
  border-radius: 8px;
}
::-webkit-scrollbar-thumb:horizontal {
  width: 12px;
  height: 12px;
  background: #484e64;
  border-radius: 8px;
}
::-webkit-scrollbar-button {
  display: none;
}
::-webkit-scrollbar-corner {
  display: none;
}
</style>
