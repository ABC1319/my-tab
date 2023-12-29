<script setup lang="ts">
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
  // eslint-disable-next-line no-console
  console.log('开始拖拽')
}
</script>

<template>
  <div
    class="
      absolute top-0px right-8px z-999
      w-200px h-screen
      text-white
      flex-shrink-0
      flex justify-center items-center
    "
  >
    <div
      class="
        w-full h-[calc(100vh_-_100px)]
        bg-[#252835]
        rounded-10px py-10px px-10px
        flex flex-col gap-10px flex-shrink-0
        overflow-auto select-none
      "
    >
      <div>拖拽布局组件</div>
      <div
        v-for="item in allComponents"
        :key="item.name"
        :draggable="true"
        class="
          w-full h-100px bg-[#484E64] rounded-10px
          flex-shrink-0 grid place-items-center
          hover:cursor-grab active:cursor-grabbing
          overflow-hidden
        "
        @dragstart="(e) => handleDragstart(e, item.name)"
      >
        <component
          :is="item.components"
          :id="`${item.name}`"
          class="w-full h-full"
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
