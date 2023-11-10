<script setup lang="ts">
import { useElementSize, useWindowSize } from '@vueuse/core'
import { watch } from 'vue'
import { createDragInHorizontal } from '~/utils/drag'

const DEFAULT_SITES = [
  {
    index: 0,
    type: 0,
    webName: 'add',
    url: 'https://mmeme.me/',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13v3q0 .425.288.713T12 17q.425 0 .713-.288T13 16v-3h3q.425 0 .713-.288T17 12q0-.425-.288-.713T16 11h-3V8q0-.425-.288-.713T12 7q-.425 0-.713.288T11 8v3H8q-.425 0-.713.288T7 12q0 .425.288.713T8 13h3Zm1 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"/></svg>',
  },
]

const modalRef = ref<typeof import('~/components/Modal.vue').default | null>(null)

// 这里使用两个变量的原因是：要获取 main DOM 的 width 来确定每行几个
// 但是在初始化的时候，main DOM 还没有渲染出来
// 等 onMounted 的时候再确定，会每次都有排列动画，效果不好
// 所以初始的时候，要么确定 main DOM 的宽度(100vw - 48)，要么就直接给个默认值(使用 window.innerWidth )
// 这里使用 window.innerWidth 去确定个数

const outerContainerRef = ref(null)
const { width: windowWidth } = useWindowSize()
const { width } = useElementSize(outerContainerRef)

const options = ref({
  containerClassName: 'drag-container',
  elementsClassName: 'my-website-item',
  size: { width: 144, height: 88 },
  gap: 20,
  maximumInLine: Math.min(Math.floor((windowWidth.value - 100 - 58) / (144 + 20)), 6), // 58 是 sidebar 的 width
  duration: 300,
})

const containerWidth = computed(() => {
  const w = (options.value.size.width + options.value.gap) * options.value.maximumInLine - options.value.gap
  return `${w}px`
})
const containerHeight = computed(() => {
  const h = (options.value.size.width + options.value.gap) * Math.ceil(DEFAULT_SITES.length / options.value.maximumInLine) - options.value.gap
  return `${h}px`
})

const { resetLayout } = createDragInHorizontal(options.value)
watch(width, (val) => {
  const max = Math.min(Math.floor((val - 100) / (options.value.size.width + options.value.gap)), 6)

  if (max !== options.value.maximumInLine) {
    options.value.maximumInLine = max
    resetLayout(undefined, undefined, max)
  }
})

function handleAddWebSite() {
  modalRef.value?.open()
}
</script>

<template>
  <div ref="outerContainerRef" class="w-full flex justify-center items-center">
    <div
      :class="options.containerClassName"
      class="my-website-box"
    >
      <div
        v-for="(item) in DEFAULT_SITES"
        :key="item.webName"
        :class="options.elementsClassName"
        class="
          w-144px h-88px
          flex flex-col justify-center items-center gap-5px flex-shrink-0 flex-grow-0
          cursor-pointer
          overflow-hidden
          rounded-10px
          text-center
        "
        @click="handleAddWebSite"
      >
        <div class="w-10 h-10 grid place-items-center" v-html="item.icon" />

        <div class="w-full">
          {{ item.webName === 'add' ? '' : item.webName }}
        </div>
      </div>
    </div>
  </div>

  <Modal ref="modalRef">
    测试
  </Modal>
</template>

<style scoped>
.my-website-box{
  will-change: width,height;
  transition-property: width,height;
  transition-duration: 300ms;
  transition-timing-function: linear;
  width: v-bind(containerWidth);
  height: v-bind(containerHeight);
}
.my-website-item {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(40px);
  clip-path: path("M 0 44 C 0 0.9849735503722608 0.9849735503722608 0 44 0 L 100 0 C 143.01502644962773 0 144 0.9849735503722608 144 44 L 144 44 C 144 87.01502644962774 143.01502644962773 88 100 88 L 44 88 C 0.9849735503722608 88 0 87.01502644962774 0 44 z");
}

.my-website-item::before {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 8px;
  background: none;
  box-shadow: inset 0 0 0 200px rgb(255, 255, 255, 0.2);
  filter: blur(16px);
  pointer-events: none;
}
</style>
