<!-- eslint-disable eqeqeq -->
<script setup lang="ts">
import { getAllCustomLayoutComponentsRaw } from '~/utils/layout-components'
import { appIsEditCleanHome, widgetsPopupWindowId } from '~/logic'

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
// 2. popup 关闭后，需要将 widgetsPopupWindowId 的值清空
function handleOpenPopup() {
  const widgetsPanelUrl = './dist/newtabWidgetsPanel/index.html'

  browser.windows.getAll().then((windows) => {
    const popup = windows.find(window => window.id == widgetsPopupWindowId.value)
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
        widgetsPopupWindowId.value = res.id

        browser.windows.onRemoved.addListener((windowId) => {
          if (windowId === widgetsPopupWindowId.value)
            widgetsPopupWindowId.value = -1
        })
      })
    }
  })
}

function handleSetPopupTop() {
  browser.windows.getAll().then((windows) => {
    const popup = windows.find(window => window.id == widgetsPopupWindowId.value)
    if (popup && popup.id) {
      // 说明已经打开了popup窗口，直接激活
      browser.windows.update(popup.id, {
        focused: true,
      })
    }
  })
}
// -------------------------------弹出 end--------------------------------------//
</script>

<template>
  <div
    class="
      widgets-panel-canvas
      absolute top-0px right-8px z-999
      w-fit h-screen
      text-white
      flex-shrink-0
      flex justify-center items-center
    "
  >
    <!-- panel -->
    <div
      v-show="widgetsPopupWindowId === -1"
      class="
        w-200px h-[calc(100vh_-_100px)]
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

    <!-- toggle button -->
    <div
      v-show="widgetsPopupWindowId !== -1"
      class="w-fit h-fit p-5"
    >
      <div class="relative">
        <div
          class="
            flex flex-col justify-center items-center gap-10px
            h-full w-40px text-12px
            cursor-pointer rounded-8px
            bg-#404459
            border-2 border-transparent
            duration-200 ease-in-out transition-all
            hover:border-#767fa2a1
            py-10px tracking-6px mb-20px
            peer
          "
          @click="() => appIsEditCleanHome = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2" /><path d="M17 21v-8H7v8M7 3v5h8" /></g></svg>
          <span style="writing-mode:vertical-lr">退出编辑</span>
        </div>
        <div class="button-glowing save-exit-btn peer-hover:opacity-100 opacity-0" />
      </div>
      <div class="relative">
        <div
          class="
            flex flex-col justify-center items-center gap-10px
            h-full w-40px text-12px
            cursor-pointer rounded-8px
            bg-#404459
            border-2 border-transparent
            duration-200 ease-in-out transition-all
            hover:border-#767fa2a1
            py-10px tracking-6px
            peer
          "
          @click="handleSetPopupTop"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="M10 4v4M2 8h20M6 4v4" /></g></svg>
          <span style="writing-mode:vertical-lr">找到弹窗</span>
        </div>
        <div class="button-glowing find-popup-btn peer-hover:opacity-100 opacity-0" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.button-glowing {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 160px;
  height: 160px;
  transform: translate(-50%, -50%);
  transition: all 1s ease;
  pointer-events: none;
  z-index: -1;
  border-radius: 9999px;
  filter: blur(60px);
}
.save-exit-btn {
  background-image: linear-gradient(45deg, #1b6ef3, #484f63, #5021ff);
}
.find-popup-btn {
  background-image: linear-gradient(45deg, #5021ff, #36e4da, #0047e1);
}
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
