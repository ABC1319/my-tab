<script setup lang="ts">
import { useDraggable, useMouseInElement, useWindowSize } from '@vueuse/core'

/**
 * 1. 获取窗口的尺寸
 * 2. 每十个像素显示一条线
 */

const props = defineProps<{
  layoutContainerScale: number
  xRulerPosition: number
  yRulerPosition: number
}>()

const emit = defineEmits<{
  (e: 'update:xRulerPosition', value: number): void
  (e: 'update:yRulerPosition', value: number): void
}>()

const { width, height } = useWindowSize()

const xRuler = ref(null)
const yRuler = ref(null)
const xBaseline = ref(null)
const yBaseline = ref(null)

const { isOutside: xIsOutside } = useMouseInElement(xRuler)

const { isOutside: yIsOutside } = useMouseInElement(yRuler)

const { x: xOriginalBaselinePosition, isDragging: isDraggingX } = useDraggable(xBaseline, {
  initialValue: { x: 0, y: 0 },
})

const { y: yOriginalBaselinePosition, isDragging: isDraggingY } = useDraggable(yBaseline, {
  initialValue: { x: 0, y: 0 },
})

const xBaselinePosition = computed(() => {
  return calcXPosition(xOriginalBaselinePosition.value, props.layoutContainerScale)
})

const yBaselinePosition = computed(() => {
  return calcYPosition(yOriginalBaselinePosition.value, props.layoutContainerScale)
})

watch(xBaselinePosition, (x, _prevX) => {
  emit('update:xRulerPosition', x)
})

watch(yBaselinePosition, (y, _prevY) => {
  emit('update:yRulerPosition', y)
})

function calcXPosition(x: number, scale: number) {
  const containerDom = document.querySelector('.layout-container')

  const originX = containerDom?.getBoundingClientRect().left || 0
  const mouseX = (x - originX) / scale

  return Math.max(mouseX, 0)
}

function calcYPosition(y: number, scale: number) {
  const containerDom = document.querySelector('.layout-container')

  const originY = containerDom?.getBoundingClientRect().top || 0
  const mouseY = (y - originY) / scale

  return Math.max(mouseY, 0)
}
</script>

<template>
  <div class="relative">
    <!-- x 轴 -->
    <div
      ref="xRuler"
      class="absolute top-0 left-0 w-screen z-0 flex flex-row "
    >
      <div
        v-for="i in (Math.ceil(width / 10))"
        :key="i"
        class="w-10px relative"
      >
        <div
          class="w-1px bg-[#ffffff5e] select-none pointer-events-none transition-all duration-200 ease-in-out"
          :class="
            i % 10 !== 0
              ? 'h-4px'
              : !xIsOutside
                ? 'h-20px'
                : 'h-12px'
          "
        />
        <div
          class="absolute top-5px left-5px text-[#ffffff5e] select-none pointer-events-none transition-all duration-200 ease-in-out"
          :class="
            xIsOutside
              ? 'opacity-0'
              : i % 10 === 0
                ? 'opacity-100'
                : 'opacity-0'
          "
        >
          {{ i }}
        </div>
      </div>
    </div>
    <!-- y 轴 -->
    <div
      ref="yRuler"
      class="absolute top-0 left-0 h-screen z-0 flex flex-col "
    >
      <div
        v-for="i in (Math.ceil(height / 10))"
        :key="i"
        class="h-10px relative"
      >
        <div
          class="h-1px bg-[#ffffff5e] transition-all duration-200 ease-in-out"
          :class="
            i % 10 !== 0
              ? 'w-4px'
              : !yIsOutside
                ? 'w-20px'
                : 'w-12px'
          "
        />
        <div
          class="absolute top-0px left-5px text-[#ffffff5e] select-none transition-all duration-200 ease-in-out"
          :class="
            yIsOutside
              ? 'opacity-0'
              : i % 10 === 0
                ? 'opacity-100'
                : 'opacity-0'
          "
        >
          {{ i }}
        </div>
      </div>
    </div>

    <!-- x 轴可以移动的线 -->
    <div
      ref="xBaseline"
      class="absolute top-0 left-0 w-2px h-screen hover:bg-[#5021ff] bg-[#ffffff1e] cursor-pointer select-none"
      :style=" { transform: `translateX(${xBaselinePosition}px)` }"
      :class="isDraggingX ? 'bg-[#5021ff]!' : ''"
    />

    <!-- y 轴可以移动的线 -->
    <div
      ref="yBaseline"
      class="absolute top-0 left-0 h-2px w-screen hover:bg-[#5021ff] bg-[#ffffff1e] cursor-pointer select-none"
      :style=" { transform: `translateY(${yBaselinePosition}px)` }"
      :class="isDraggingY ? 'bg-[#5021ff]!' : ''"
    />
  </div>
</template>
