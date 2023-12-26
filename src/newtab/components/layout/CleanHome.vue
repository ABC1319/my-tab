<script setup lang="ts">
// import SearchBox from '../ui/search-box/index.vue'
// import DigitalClock from '../ui/DigitalClock.vue'
import LayoutCanvas from '../ui/layout-canvas/index.vue'

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

const contextMenuPosition = ref({
  x: 0,
  y: 0,
})
const contextMenuRef = ref<typeof import('~/components/CustomContextMenu.vue').default | null>(null)
const contextMenuOptions = [
  { label: '编辑', key: 'edit' },
  { label: '删除', key: 'delete' },
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
    case 'edit':
      // eslint-disable-next-line no-console
      console.log('edit')
      break
    case 'delete':
      // eslint-disable-next-line no-console
      console.log('delete')
      break

    default:
      break
  }
}
</script>

<template>
  <div
    ref="containerRef"
    class="
      relative
      flex-1 h-full flex flex-col justify-start items-center
      text-white
      overflow-hidden
    "
    @contextmenu="e => openContextmenu(e)"
  >
    <LayoutCanvas />
    <!-- <DigitalClock />
    <SearchBox /> -->
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
