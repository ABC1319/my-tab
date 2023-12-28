<script setup lang="ts">
import { ref } from 'vue'
import { initGridContainer } from './draggable'
import CustomLayoutComponentsList from './CustomLayoutComponentsList.vue'
import { appIsEditCleanHome } from '~/logic/storage'
import { getAllCustomLayoutComponentsRaw } from '~/utils/layout-components'

interface BentoCellsType {
  id: string
  x: number
  y: number
  width: number
  height: number
  [key: string]: any
}

const customLayoutAllComponents = await getAllCustomLayoutComponentsRaw()

const cfg = customLayoutAllComponents.map((components) => {
  return { id: '1', x: 0, y: 0, width: 100, height: 100, component: markRaw(components.raw.default) }
})

const bentoCells = ref<BentoCellsType[]>(cfg)
const bentoContainerRef = ref()
const currentClickedElement: Ref<any> = ref()

/**
 * 1. 编辑模式
 * 2. 添加小组件
 */

onMounted(() => {
  initGridContainer(bentoCells, currentClickedElement)
})

// ------------------右键弹窗 start ----------------------- //
const contextMenuPosition = ref({ x: 0, y: 0 })
const contextMenuRef = ref<typeof import('~/components/CustomContextMenu.vue').default | null>(null)
const contextMenuOptions = [
  { label: '添加小组件', key: 'addWidgets' },
]
function openContextmenu(e: MouseEvent) {
  e.preventDefault()
  contextMenuPosition.value = {
    x: e.clientX,
    y: e.clientY,
  }
  contextMenuRef.value?.open()
}

function handleSelectContextMenu(e: typeof contextMenuOptions[number]) {
  switch (e.key) {
    case 'addWidgets':
      addWidgets()
      break

    default:
      break
  }
}

function addWidgets() {
  // eslint-disable-next-line no-console
  console.log(contextMenuPosition.value)
}
// ------------------右键弹窗 end ----------------------- //

function handleSwitchCleanHomeMode() {
  appIsEditCleanHome.value = !appIsEditCleanHome.value
}

// ------------------拖拽 start -------------------------//

function handleDrop(_e: DragEvent) {
  // eslint-disable-next-line no-console
  console.log('放下拖拽的要素')
}
function handleDragover(e: DragEvent) {
  e.preventDefault()
  // eslint-disable-next-line no-console
  console.log('拖拽的要素在可放置的区域上')
}
// ------------------拖拽 end ---------------------------//
</script>

<template>
  <div
    ref="bentoContainerRef"
    class="
      bento-container
      w-full h-full
      absolute top-0 left-0 overflow-hidden z-50
      transition-all duration-300 ease-in-out
      outline-10px outline-solid outline-[#474d63]
    "
    :class="appIsEditCleanHome ? 'bento-container-edit-mode' : ''"
    @contextmenu="e => openContextmenu(e)"
    @drop="handleDrop"
    @dragover="handleDragover"
  >
    <div
      v-for="item in bentoCells"
      :key="item.id"
      :style="{
        position: 'absolute',
        transform: `
          translate3d(
            ${item.x}px,
            ${item.y}px,
          0)`,
        width: `${item.width}px`,
        height: `${item.height}px`,
        willChange: 'transform',
      }"
    >
      <component
        :is="item.component"
        :id="`${item.id}`"
        class="w-full h-full"
      />

      <div v-if="appIsEditCleanHome" class="absolute top-0 left-0 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <path fill="currentColor" d="M7.615 20q-.67 0-1.143-.472Q6 19.056 6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.152q-.463.463-1.153.463zM17 6H7v12.385q0 .269.173.442t.442.173h8.77q.23 0 .423-.192q.192-.193.192-.423zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z" />
        </svg>
      </div>
    </div>

    <!-- 编辑模式 -->
    <Teleport to="body">
      <button
        title="编辑模式"
        draggable="false"
        class="
        fixed bottom-2 right-50px z-99
        h-32px w-32px p-0 min-w-32px
        rounded-full bg-[#25283590]
        grid place-items-center
        cursor-pointer
        text-[#ffffff90]
      "
        @click="handleSwitchCleanHomeMode"
      >
        <svg class="w-14px h-14px rounded-full hover:scale-110" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="currentColor" fill-rule="evenodd" d="M11.943 1.25H13.5a.75.75 0 0 1 0 1.5H12c-2.378 0-4.086.002-5.386.176c-1.279.172-2.05.5-2.62 1.069c-.569.57-.896 1.34-1.068 2.619c-.174 1.3-.176 3.008-.176 5.386s.002 4.086.176 5.386c.172 1.279.5 2.05 1.069 2.62c.57.569 1.34.896 2.619 1.068c1.3.174 3.008.176 5.386.176s4.086-.002 5.386-.176c1.279-.172 2.05-.5 2.62-1.069c.569-.57.896-1.34 1.068-2.619c.174-1.3.176-3.008.176-5.386v-1.5a.75.75 0 0 1 1.5 0v1.557c0 2.309 0 4.118-.19 5.53c-.194 1.444-.6 2.584-1.494 3.479c-.895.895-2.035 1.3-3.48 1.494c-1.411.19-3.22.19-5.529.19h-.114c-2.309 0-4.118 0-5.53-.19c-1.444-.194-2.584-.6-3.479-1.494c-.895-.895-1.3-2.035-1.494-3.48c-.19-1.411-.19-3.22-.19-5.529v-.114c0-2.309 0-4.118.19-5.53c.194-1.444.6-2.584 1.494-3.479c.895-.895 2.035-1.3 3.48-1.494c1.411-.19 3.22-.19 5.529-.19m4.827 1.026a3.503 3.503 0 0 1 4.954 4.953l-6.648 6.649c-.371.37-.604.604-.863.806a5.34 5.34 0 0 1-.987.61c-.297.141-.61.245-1.107.411l-2.905.968a1.492 1.492 0 0 1-1.887-1.887l.968-2.905c.166-.498.27-.81.411-1.107c.167-.35.372-.68.61-.987c.202-.26.435-.492.806-.863zm3.893 1.06a2.003 2.003 0 0 0-2.832 0l-.376.377c.022.096.054.21.098.338c.143.413.415.957.927 1.469a3.875 3.875 0 0 0 1.807 1.025l.376-.376a2.003 2.003 0 0 0 0-2.832m-1.558 4.391a5.397 5.397 0 0 1-1.686-1.146a5.395 5.395 0 0 1-1.146-1.686L11.218 9.95c-.417.417-.58.582-.72.76a3.84 3.84 0 0 0-.437.71c-.098.203-.172.423-.359.982l-.431 1.295l1.032 1.033l1.295-.432c.56-.187.779-.261.983-.358c.251-.12.49-.267.71-.439c.177-.139.342-.302.759-.718z" clip-rule="evenodd" />
        </svg>
      </button>
    </Teleport>

    <!-- 缩略图 -->
    <Transition
      name="scale"
      @after-leave="$emit('destroy')"
    >
      <div v-if="false" class="absolute bottom-5px left-0 w-172px h-140px bg-[#252835] rounded-10px p-10px ">
        <div class="w-full h-full bg-[#484e64] grid place-items-center rounded-5px cursor-default">
          缩略图
        </div>
      </div>
    </Transition>
  </div>

  <Transition
    name="slide-x"
    @after-leave="$emit('destroy')"
  >
    <CustomLayoutComponentsList v-if="appIsEditCleanHome" />
  </Transition>

  <CustomContextMenu
    ref="contextMenuRef"
    :x="contextMenuPosition.x"
    :y="contextMenuPosition.y"
    :options="contextMenuOptions"
    @select="handleSelectContextMenu"
  />
</template>

<style scoped>
.bento-container {
  background-image: url(/assets/main_resource.png);
  background-size: cover;
  background-position: center;
}
.bento-container-edit-mode {
  transform: scaleY(0.8);
  width: calc(100% - 250px);
  margin-left: 20px;
  border-radius: 10px;
  transform-origin: 10% 50%;
}
.scale-enter-active {
  animation: scale-in 0.5s;
  transform-origin: bottom left;
}
.scale-leave-active {
  animation: scale-in 0.5s reverse;
  transform-origin: bottom left;
}
@keyframes scale-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

.slide-x-enter-active {
  animation: slide-x-in 0.3s;
}
.slide-x-leave-active {
  animation: slide-x-in 0.2s reverse;
}
@keyframes slide-x-in {
  0% {
    transform: translateX(100%);
  }
  /* 50% {
    transform: translateX(-5%);
  } */
  100% {
    transform: translateX(0);
  }
}
</style>
