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
        :key="item.name"
        :draggable="true"
        class="
            w-fit h-100px bg-[#484E64] rounded-10px px-10px
            flex-shrink-0 grid place-items-center
            hover:cursor-grab active:cursor-grabbing
            overflow-hidden
          "
        @dragstart="(e) => handleDragstart(e, item.name)"
      >
        <component
          :is="item.components"
          :id="`${item.name}`"
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
