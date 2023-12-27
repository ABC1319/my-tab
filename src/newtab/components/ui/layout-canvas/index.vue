<script setup lang="ts">
import { ref } from 'vue'
import { initGridContainer } from './draggable'

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

// 从单个文件目录获取原始文件内容
async function getAllCustomLayoutComponentsRaw() {
  const posts = await Promise.all(
    Object.entries(
      import.meta.glob('~/components/custom-layout-card/*.vue'),
    )
      .map(async ([path, resolver]) => {
        return {
          raw: await resolver() as any,
          title: (path as any).split('/').pop().split('.')[0],
          path,
        }
      }),
  )
  return posts
}
</script>

<template>
  <div
    ref="bentoContainerRef"
    class="bento-container w-full h-full absolute top-0 left-0 overflow-hidden z-50"
    @contextmenu="e => openContextmenu(e)"
  >
    <div v-for="item in bentoCells" :key="item.id">
      <component
        :is="item.component"
        :id="`${item.id}`"
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
      />
    </div>
  </div>

  <CustomContextMenu
    ref="contextMenuRef"
    :x="contextMenuPosition.x"
    :y="contextMenuPosition.y"
    :options="contextMenuOptions"
    @select="handleSelectContextMenu"
  />
</template>

<style scoped>

</style>
