<script setup lang="ts">
import { getAllCustomLayoutComponentsRaw } from '~/utils/layout-components'
import { appIsEditCleanHome, widgetsPopupWindow } from '~/logic'

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
// -------------------------------弹出 start--------------------------------------//
// 1. 需要知道 popup 窗口的状态（打开/关闭）
function handleOpenPopup() {
  const widgetsPanelUrl = './dist/newtabWidgetsPanel/index.html'

  browser.windows.getAll().then((windows) => {
    const popup = windows.find(window => window.id === widgetsPopupWindow.value?.id)

    if (popup && popup.id) {
      // 说明已经打开了popup窗口，直接激活
      browser.windows.update(popup.id, {
        focused: true,
      })
    }
    else {
      browser.windows.create({
        url: browser.runtime.getURL(widgetsPanelUrl),
        width: 800,
        height: 600,
        left: 600,
        type: 'popup',
        focused: true,
        incognito: false,
      }).then((res) => {
        widgetsPopupWindow.value = res
      })
    }
  })
}
// -------------------------------弹出 end--------------------------------------//
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
        relative
      "
    >
      <div
        class="
          absolute top-10px right-10px
          cursor-pointer
          text-white
          rounded-full
          w-4 h-4
        "
        @click="() => appIsEditCleanHome = false"
      >
        <div class="w-full h-full" i-carbon-close />
      </div>

      <div
        class="
          absolute top-10px right-40px
          cursor-pointer
          text-white
          rounded-full
          w-4 h-4
        "
        @click="handleOpenPopup"
      >
        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 12A10 10 0 1 1 12 2m10 0L12 12m4-10h6v6" /></svg>
      </div>
      <div class="w-full h-4 font-bold">
        拖拽布局组件
      </div>

      <div class="flex flex-col flex-1 gap-10px ">
        <div
          v-for="item in allComponents"
          :key="item.name"
          :draggable="true"
          class="
            w-full h-140px bg-[#484E64] rounded-10px
            flex-shrink-0 grid place-items-center
            hover:cursor-grab active:cursor-grabbing
            overflow-hidden
          "
          @dragstart="(e) => handleDragstart(e, item.name)"
        >
          <div>
            <component
              :is="item.components"
              :id="`${item.name}`"
            />
          </div>
        </div>
      </div>

      <div class="w-full h-40px flex flex-row justify-around items-center gap-10px">
        <div
          class="
            flex flex-row justify-center items-center gap-10px
            h-36px w-full text-12px
            cursor-pointer rounded-8px
            bg-#404459
            mt-2
            border-2 border-transparent
            duration-200 ease-in-out transition-all
            hover:border-#767fa2a1
          "
          @click="() => appIsEditCleanHome = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2" /><path d="M17 21v-8H7v8M7 3v5h8" /></g></svg>
          <div>
            退出编辑
          </div>
        </div>
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
